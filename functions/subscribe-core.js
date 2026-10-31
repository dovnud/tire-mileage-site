// Stored reminder requests only. This module does not send email.

export const PURPOSE = 'rotation-reminder';
export const CONSENT = "We'll only use your email for this request.";
export const TURNSTILE_ACTION = 'reminder';
export const HOUR_LIMIT = 5;
export const DAY_LIMIT = 20;
export const MAX_BODY = 4096;

const PAGE = /^\/(?:tires\/[a-z0-9-]+\/[a-z0-9-]+|sizes\/[a-z0-9-]+|guides\/tire-cost-per-mile)\/$/;
const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

const INSERT = `INSERT INTO subscribers (email, page_url, purpose, extra, consent_text, created_at, ip_hash)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(email, purpose) DO NOTHING`;
const BUMP = `INSERT INTO submit_buckets (ip_hash, bucket, hits) VALUES (?, ?, 1)
  ON CONFLICT(ip_hash, bucket) DO UPDATE SET hits = hits + 1 RETURNING hits`;
const PRUNE = `DELETE FROM submit_buckets
  WHERE (bucket LIKE 'h:%' AND CAST(substr(bucket, 3) AS INTEGER) < ?)
     OR (bucket LIKE 'd:%' AND CAST(substr(bucket, 3) AS INTEGER) < ?)`;

export function allowedPageHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  if (host === 'tiremileage.com' || host === 'www.tiremileage.com' || host === 'tiremileage.pages.dev') return true;
  if (host.endsWith('.tiremileage.pages.dev') && host.length < 100) return true;
  if (host === 'localhost' || host === '127.0.0.1') return true;
  return false;
}

// Production Turnstile hostnames. Localhost is intentionally absent.
export function turnstileHostnameOk(hostname) {
  const host = String(hostname || '').toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1') return false;
  if (host === 'tiremileage.com' || host === 'www.tiremileage.com' || host === 'tiremileage.pages.dev') return true;
  return host.endsWith('.tiremileage.pages.dev') && host.length < 100;
}

export async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}\n${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fail(status, message) {
  return { ok: false, status, message };
}

export function validateFields(fields, originHeader) {
  const email = String(fields.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return fail(400, 'Enter a valid email address.');
  const tire = String(fields.tire || '').trim().replace(/\s+/g, ' ');
  if (tire.length < 2 || tire.length > 80 || /[\u0000-\u001F\u007F<>]/.test(tire)) return fail(400, 'Enter the tire name.');
  const current = intField(fields.current_miles, 0, 2000000);
  if (current == null) return fail(400, 'Enter current miles as a whole number.');
  const perYear = intField(fields.miles_per_year, 1, 200000);
  if (perYear == null) return fail(400, 'Enter miles per year as a whole number.');
  if (fields.purpose !== PURPOSE) return fail(400, 'This form cannot store that request.');
  if (fields.consent !== CONSENT) return fail(400, 'Check the consent box to store this request.');
  const path = String(fields.page_url || '');
  if (path.length > 200 || !PAGE.test(path)) return fail(400, 'Open this form on a tire or calculator page and try again.');
  let originUrl;
  try { originUrl = new URL(originHeader); } catch { return fail(403, 'This form only submits from the site itself.'); }
  const https = originUrl.protocol === 'https:';
  const localHttp = originUrl.protocol === 'http:' && (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1');
  if (!https && !localHttp) return fail(403, 'This form only submits from the site itself.');
  if (!allowedPageHost(originUrl.hostname)) return fail(403, 'This form only submits from the site itself.');
  const page_url = `${originUrl.origin}${path}`;
  const extra = JSON.stringify({ tire, current_miles: current, miles_per_year: perYear });
  return { ok: true, path, row: { email, page_url, purpose: PURPOSE, extra, consent_text: CONSENT } };
}

function intField(value, min, max) {
  const text = String(value ?? '').trim();
  if (!/^\d{1,7}$/.test(text)) return null;
  const n = Number(text);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

async function readLimited(request) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { buf.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(buf);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function respond(request, status, ok, message, back) {
  const headers = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
  const accept = request.headers.get('accept') || '';
  if (accept.includes('application/json')) {
    return Response.json({ ok, message }, { status, headers });
  }
  const href = back && back.startsWith('/') && !back.startsWith('//') ? back : '/';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Reminder request</title></head><body><p>${escapeHtml(message)}</p><p><a href="${escapeHtml(href)}">Back</a></p></body></html>`;
  return new Response(html, { status, headers: { ...headers, 'content-type': 'text/html; charset=utf-8' } });
}

async function bump(db, ipHash, now) {
  const hour = Math.floor(now / 3600000);
  const day = Math.floor(now / 86400000);
  const hourHits = Number(await db.prepare(BUMP).bind(ipHash, `h:${hour}`).first('hits'));
  const dayHits = Number(await db.prepare(BUMP).bind(ipHash, `d:${day}`).first('hits'));
  await db.prepare(PRUNE).bind(hour - 48, day - 3).run();
  return hourHits > HOUR_LIMIT || dayHits > DAY_LIMIT;
}

export async function verifyTurnstile(fetchImpl, secret, token, ip) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false;
  let result;
  try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return false;
    result = await response.json();
  } catch {
    return false;
  }
  return Boolean(result && result.success === true && result.action === TURNSTILE_ACTION && turnstileHostnameOk(result.hostname));
}

export async function handleSubscribe(request, env, deps = {}) {
  if (request.method !== 'POST') return respond(request, 405, false, 'Use the form on the page.');
  if (!env || !env.DB || !env.IP_HASH_SALT) return respond(request, 503, false, 'This form is not available right now.');
  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (!type.includes('application/x-www-form-urlencoded')) return respond(request, 415, false, 'Use the form on the page.');
  const raw = await readLimited(request);
  if (raw == null) return respond(request, 413, false, 'That submission is too large.');
  const fields = Object.fromEntries(new URLSearchParams(raw));
  const ip = request.headers.get('cf-connecting-ip') || '0';
  let ipHash;
  try {
    ipHash = await hashIp(ip, env.IP_HASH_SALT);
  } catch {
    return respond(request, 503, false, 'This form is not available right now.');
  }
  let limited = false;
  try {
    limited = await bump(env.DB, ipHash, deps.now || Date.now());
  } catch {
    return respond(request, 503, false, 'This form is not available right now.');
  }
  if (limited) return respond(request, 429, false, 'Too many requests from this network. Try again later.');
  if (String(fields.hp_field || '').trim() !== '') {
    return respond(request, 200, true, 'Stored. We saved this request and did not send a message.');
  }
  const parsed = validateFields(fields, request.headers.get('origin'));
  if (!parsed.ok) return respond(request, parsed.status, false, parsed.message, String(fields.page_url || ''));
  if (env.TURNSTILE_SECRET) {
    const passed = await verifyTurnstile(deps.fetch || fetch, env.TURNSTILE_SECRET, fields['cf-turnstile-response'], ip);
    if (!passed) return respond(request, 403, false, 'The check did not pass. Reload the page and try again.', parsed.path);
  }
  const createdAt = new Date(deps.now || Date.now()).toISOString();
  try {
    const result = await env.DB.prepare(INSERT).bind(
      parsed.row.email,
      parsed.row.page_url,
      parsed.row.purpose,
      parsed.row.extra,
      parsed.row.consent_text,
      createdAt,
      ipHash,
    ).run();
    const changes = Number(result?.meta?.changes ?? 0);
    if (changes === 0) return respond(request, 200, true, 'This request is already stored for that email.', parsed.path);
  } catch {
    return respond(request, 503, false, 'This form is not available right now.', parsed.path);
  }
  return respond(request, 200, true, 'Stored. We saved this request and did not send a message.', parsed.path);
}
