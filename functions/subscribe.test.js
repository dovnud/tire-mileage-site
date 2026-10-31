import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CONSENT, PURPOSE, handleSubscribe, hashIp, validateFields } from './subscribe-core.js';

const ORIGIN = 'https://tiremileage.com';
const PATH = '/tires/michelin/defender-2/';

function fields(over = {}) {
  return {
    email: 'reader@tiremileage.com',
    tire: 'Michelin Defender 2',
    current_miles: '42000',
    miles_per_year: '12000',
    purpose: PURPOSE,
    consent: CONSENT,
    page_url: PATH,
    hp_field: '',
    ...over,
  };
}

function createDb() {
  const subscribers = [];
  const buckets = new Map();
  return {
    subscribers,
    prepare(sql) {
      const text = sql.replace(/\s+/g, ' ').trim();
      return {
        bind(...args) {
          return {
            async run() {
              if (text.startsWith('INSERT INTO subscribers')) {
                const [email, page_url, purpose, extra, consent_text, created_at, ip_hash] = args;
                if (subscribers.some((row) => row.email === email && row.purpose === purpose)) return { meta: { changes: 0 } };
                subscribers.push({ email, page_url, purpose, extra, consent_text, created_at, ip_hash });
                return { meta: { changes: 1 } };
              }
              if (text.startsWith('DELETE FROM submit_buckets')) return { meta: { changes: 0 } };
              throw new Error(`unexpected run: ${text}`);
            },
            async first() {
              if (text.startsWith('INSERT INTO submit_buckets')) {
                const key = `${args[0]}|${args[1]}`;
                const hits = (buckets.get(key) || 0) + 1;
                buckets.set(key, hits);
                return hits;
              }
              throw new Error(`unexpected first: ${text}`);
            },
          };
        },
      };
    },
  };
}

function requestFor(body, headers = {}) {
  return new Request(`${ORIGIN}/api/subscribe`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      origin: ORIGIN,
      'cf-connecting-ip': '203.0.113.10',
      ...headers,
    },
    body: new URLSearchParams(body),
  });
}

test('validate accepts a tire page and builds extra JSON', () => {
  const parsed = validateFields(fields(), ORIGIN);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.row.email, 'reader@tiremileage.com');
  assert.equal(parsed.row.page_url, `${ORIGIN}${PATH}`);
  assert.equal(parsed.row.consent_text, CONSENT);
  assert.deepEqual(JSON.parse(parsed.row.extra), { tire: 'Michelin Defender 2', current_miles: 42000, miles_per_year: 12000 });
});

test('validate rejects a bad email, miles, consent, and off-site origin', () => {
  assert.equal(validateFields(fields({ email: 'not-an-email' }), ORIGIN).status, 400);
  assert.equal(validateFields(fields({ current_miles: '-1' }), ORIGIN).status, 400);
  assert.equal(validateFields(fields({ miles_per_year: '0' }), ORIGIN).status, 400);
  assert.equal(validateFields(fields({ consent: 'send me deals' }), ORIGIN).status, 400);
  assert.equal(validateFields(fields({ page_url: '/about/' }), ORIGIN).status, 400);
  assert.equal(validateFields(fields(), 'https://example.com').status, 403);
  assert.equal(validateFields(fields({ page_url: '/sizes/225-65r17/' }), ORIGIN).ok, true);
  assert.equal(validateFields(fields({ page_url: '/guides/tire-cost-per-mile/' }), ORIGIN).ok, true);
});

test('hash does not contain the IP and changes with the salt', async () => {
  const a = await hashIp('203.0.113.10', 'salt-a');
  const b = await hashIp('203.0.113.10', 'salt-b');
  const c = await hashIp('203.0.113.11', 'salt-a');
  assert.equal(a.length, 64);
  assert.notEqual(a, b);
  assert.notEqual(a, c);
  assert.equal(a.includes('203.0.113.10'), false);
});

test('stores one row, dedupes, and drops honeypot posts', async () => {
  const db = createDb();
  const env = { DB: db, IP_HASH_SALT: 'test-salt' };
  const first = await handleSubscribe(requestFor(fields()), env);
  assert.equal(first.status, 200);
  assert.equal((await first.json()).message, 'Stored. We saved this request and did not send a message.');
  assert.equal(db.subscribers.length, 1);
  assert.equal(db.subscribers[0].ip_hash.includes('203.0.113.10'), false);
  const again = await handleSubscribe(requestFor(fields({ current_miles: '100' })), env);
  assert.equal((await again.json()).message, 'This request is already stored for that email.');
  assert.equal(db.subscribers.length, 1);
  assert.equal(JSON.parse(db.subscribers[0].extra).current_miles, 42000);
  const honey = await handleSubscribe(requestFor(fields({ email: 'other@tiremileage.com', hp_field: 'filled' })), env);
  assert.equal(honey.status, 200);
  assert.equal(db.subscribers.length, 1);
});

test('rate limit and turnstile fail closed', async () => {
  const db = createDb();
  const env = { DB: db, IP_HASH_SALT: 'test-salt', TURNSTILE_SECRET: 'secret' };
  const fetchImpl = async () => ({ ok: true, json: async () => ({ success: false, action: 'reminder', hostname: 'tiremileage.com' }) });
  const blocked = await handleSubscribe(requestFor(fields()), env, { fetch: fetchImpl });
  assert.equal(blocked.status, 403);
  assert.equal(db.subscribers.length, 0);
  const localHost = await handleSubscribe(requestFor(fields()), env, {
    fetch: async () => ({ ok: true, json: async () => ({ success: true, action: 'reminder', hostname: 'localhost' }) }),
  });
  assert.equal(localHost.status, 403);
  const open = { DB: createDb(), IP_HASH_SALT: 'test-salt' };
  for (let i = 0; i < 5; i++) {
    const res = await handleSubscribe(requestFor(fields({ email: `r${i}@tiremileage.com` })), open);
    assert.equal(res.status, 200);
  }
  const limited = await handleSubscribe(requestFor(fields({ email: 'r6@tiremileage.com' })), open);
  assert.equal(limited.status, 429);
  assert.equal(open.DB.subscribers.length, 5);
});

test('form source uses the same consent sentence and does not promise a mailing', () => {
  const form = readFileSync(new URL('../src/components/ReminderForm.astro', import.meta.url), 'utf8');
  assert.equal(form.includes('newsletter') || form.includes('weekly') || form.includes('deal'), false);
  assert.match(form, /Request a rotation\/replacement reminder/);
  assert.match(form, /action="\/api\/subscribe"/);
  assert.match(form, /name="hp_field"/);
});
