// IndexNow submitter. DRY RUN by default: prints what it would send. Nothing is sent unless ALL are true:
//   --submit flag, PREVIEW=0, INDEXNOW_KEY set, SITE_URL set to the real domain (not *.pages.dev).
// Protocol: https://www.indexnow.org/documentation  (POST JSON to https://api.indexnow.org/indexnow)
import fs from 'node:fs';
const site = (process.env.SITE_URL || '').replace(/\/$/, '');
const key = process.env.INDEXNOW_KEY || '';
const submit = process.argv.includes('--submit');
const urls = [];
for (const f of fs.readdirSync('dist').filter((n) => /^sitemap-.+\.xml$/.test(n) && n !== 'sitemap-index.xml')) {
  for (const m of fs.readFileSync(`dist/${f}`, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
}
console.log(`${urls.length} URLs found in dist sitemaps`);
const ok = submit && process.env.PREVIEW === '0' && key && site && !/pages\.dev/.test(site);
if (!ok) { console.log('DRY RUN: not sending. (needs --submit, PREVIEW=0, INDEXNOW_KEY, SITE_URL=<real domain>)'); process.exit(0); }
const host = new URL(site).host;
for (let i = 0; i < urls.length; i += 10000) {
  const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host, key, keyLocation: `${site}/${key}.txt`, urlList: urls.slice(i, i + 10000) }) });
  console.log('IndexNow response', r.status);
}
