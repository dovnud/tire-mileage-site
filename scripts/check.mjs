// Post-build checks on dist/: broken internal links, duplicate titles, JSON-LD validity, noindex, retailer rel, prices, ad slots.
import fs from 'node:fs'; import path from 'node:path';
const DIST = 'dist'; const preview = process.env.PREVIEW !== '0';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(DIST); const htmls = files.filter((f) => f.endsWith('.html'));
const exists = (u) => { const p = decodeURIComponent(u.split('#')[0].split('?')[0]); if (!p) return true;
  const f = path.join(DIST, p); return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))); };
const err = []; const titles = new Map();
for (const f of htmls) {
  const h = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f);
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1]; if (!t) err.push(`${rel}: no title`); else { (titles.get(t) || titles.set(t, []).get(t)).push(rel); }
  for (const m of h.matchAll(/href="(\/[^"]*)"/g)) if (!m[1].startsWith('//') && !exists(m[1])) err.push(`${rel}: broken link ${m[1]}`);
  for (const m of h.matchAll(/(?:src)="(\/[^"]*)"/g)) if (!m[1].startsWith('//') && !exists(m[1])) err.push(`${rel}: broken src ${m[1]}`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { const j = JSON.parse(m[1]); if (!j['@context']) err.push(`${rel}: JSON-LD missing @context`); } catch (e) { err.push(`${rel}: invalid JSON-LD ${e.message}`); } }
  if (preview && !/<meta name="robots" content="noindex/.test(h) && !rel.startsWith('404')) err.push(`${rel}: missing noindex meta`);
  for (const m of h.matchAll(/<a [^>]*href="https?:\/\/(?:www\.)?(?:discounttire|amazon)\.com[^"]*"[^>]*>/g)) if (!/rel="sponsored nofollow noopener/.test(m[0])) err.push(`${rel}: retailer link without rel: ${m[0].slice(0, 80)}`);
  const text = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  if (/\$\d/.test(text.replace(/\$\{[^}]*\}/g, '')) && !/cost-per-mile|calculator/i.test(rel)) { const m = text.match(/.{20}\$\d.{20}/); if (m && !/\$1,?000|\$\d+ price/i.test(m[0])) err.push(`${rel}: possible price string: ${m[0]}`); }
  if (/class="ad-slot[^"]*"/.test(h) && !/ad-slot[^>]*hidden/.test(h)) err.push(`${rel}: ad slot not hidden`);
}
for (const [t, p] of titles) if (p.length > 1) err.push(`duplicate title "${t}": ${p.join(', ')}`);
if (preview) { const hd = fs.readFileSync(path.join(DIST, '_headers'), 'utf8'); if (!/X-Robots-Tag: noindex/i.test(hd)) err.push('_headers missing X-Robots-Tag noindex'); }
console.log(`${htmls.length} html pages checked; ${err.length} problem(s)`); err.slice(0, 40).forEach((e) => console.log(' -', e)); process.exit(err.length ? 1 : 0);
