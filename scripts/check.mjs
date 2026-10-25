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
// ---- SEO / structure checks ----
const ORIGIN = (fs.readFileSync(path.join(DIST, 'sitemap-pages.xml'), 'utf8').match(/<loc>(https?:\/\/[^/<]+)/) || [])[1] || '';
const linked = new Set(); const pageRel = (f) => '/' + path.relative(DIST, f).replace(/index\.html$/, '');
const sitemapLocs = new Set(); for (const f of files.filter((x) => /sitemap-[a-z]+\.xml$/.test(x))) for (const m of fs.readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapLocs.add(new URL(m[1]).pathname);
const idx = fs.readFileSync(path.join(DIST, 'sitemap-index.xml'), 'utf8');
for (const n of ['pages', 'guides', 'tags', 'brands', 'tires', 'sizes']) if (!idx.includes(`sitemap-${n}.xml`)) err.push(`sitemap-index missing ${n}`);
for (const l of sitemapLocs) if (!exists(l)) err.push(`sitemap lists missing page ${l}`);
let guideCount = 0, hubCount = 0;
for (const f of htmls) {
  const h = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f); const url = pageRel(f);
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) if (m[1] !== url) linked.add(m[1]);
  if (rel.startsWith('404')) continue;
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return {}; } });
  const types = ld.map((j) => j['@type']);
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1]?.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  if (!desc || desc.length < 50 || desc.length > 200) err.push(`${rel}: meta description missing or length ${desc ? desc.length : 0} (want 50-200)`);
  const dec = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const title = dec((h.match(/<title>([^<]*)<\/title>/) || [])[1] || ''); if (title.length > 95) err.push(`${rel}: title too long (${title.length})`);
  if ((h.match(/<h1[ >]/g) || []).length !== 1) err.push(`${rel}: expected exactly one h1`);
  const canon = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]; if (!canon || new URL(canon).pathname !== url) err.push(`${rel}: canonical missing/mismatch (${canon})`);
  for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:site_name']) if (!h.includes(`property="${k}"`)) err.push(`${rel}: missing ${k}`);
  if (!h.includes('name="twitter:card" content="summary_large_image"')) err.push(`${rel}: missing twitter card`);
  const og = (h.match(/property="og:image" content="([^"]*)"/) || [])[1]; if (og) { const op = new URL(og).pathname; if (!exists(op) || !fs.existsSync(path.join(DIST, op))) err.push(`${rel}: og:image file missing ${op}`); }
  if (!/rel="alternate" type="application\/atom\+xml"/.test(h)) err.push(`${rel}: no feed autodiscovery link`);
  if (!sitemapLocs.has(url) && url !== '/404') err.push(`${rel}: not in any sitemap`);
  if (rel.startsWith('guides/') && rel !== 'guides/index.html') {
    guideCount++; const faqN = (h.match(/<details open>/g) || []).length;
    if (!types.includes('Article')) err.push(`${rel}: no Article JSON-LD`); if (!types.includes('FAQPage')) err.push(`${rel}: no FAQPage JSON-LD`);
    if (faqN < 3) err.push(`${rel}: <3 FAQ items`);
    const art = ld.find((j) => j['@type'] === 'Article'); if (art && (art.author?.['@type'] !== 'Organization' || !art.dateModified || !art.datePublished)) err.push(`${rel}: Article author/date incomplete`);
    const ext = new Set([...h.matchAll(/<a href="(https?:\/\/[^"]+)" rel="noopener"/g)].map((m) => new URL(m[1]).host)); if (ext.size < 2) err.push(`${rel}: fewer than 2 distinct cited source hosts`);
    if (!/<div class="answer">/.test(h)) err.push(`${rel}: no answer-first box`); if (!/Last updated/.test(h)) err.push(`${rel}: no last-updated date`);
    if (!/href="\/(sizes|tires)\/[^"]+"/.test(h)) err.push(`${rel}: no internal link to a size or line page`);
    if (!/id="src-h"/.test(h)) err.push(`${rel}: no sources section`);
  }
  if (/^(treadwear|type|rim)\/[^/]+\/index\.html$/.test(rel)) {
    hubCount++; const txt = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ');
    if (txt.length < 2500) err.push(`${rel}: thin hub (${txt.length} chars)`); if ((h.match(/<table/g) || []).length < 3) err.push(`${rel}: hub has <3 tables`);
    for (const k of ['ItemList', 'FAQPage', 'CollectionPage', 'BreadcrumbList']) if (!types.includes(k)) err.push(`${rel}: hub missing ${k} JSON-LD`);
    if (!/class="relblock"/.test(h)) err.push(`${rel}: hub has no guide links block`);
  }
  if (/^tires\/[^/]+\/[^/]+\/index\.html$/.test(rel) && !/class="tagrow"/.test(h)) err.push(`${rel}: line page has no tag chips`);
  if (rel === 'data/index.html' && !types.includes('Dataset')) err.push(`${rel}: no Dataset JSON-LD`);
}
for (const f of htmls) { const url = pageRel(f); if (url !== '/' && !url.startsWith('/404') && !linked.has(url)) err.push(`orphan page (no inbound link): ${url}`); }
if (guideCount < 8) err.push(`only ${guideCount} guides built (want 8+)`);
const feed = fs.existsSync(path.join(DIST, 'guides/feed.xml')) ? fs.readFileSync(path.join(DIST, 'guides/feed.xml'), 'utf8') : '';
if ((feed.match(/<entry>/g) || []).length !== guideCount) err.push(`feed entries (${(feed.match(/<entry>/g) || []).length}) != guides (${guideCount})`);
const llms = fs.readFileSync(path.join(DIST, 'llms.txt'), 'utf8'); if (!/\/guides\//.test(llms) || !/\/treadwear\//.test(llms)) err.push('llms.txt missing guides/treadwear links');
if (!/Sitemap: /.test(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8'))) err.push('robots.txt has no Sitemap line');
if (preview && files.some((f) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(path.basename(f)) && !/robots|llms/.test(f) && path.dirname(f) === DIST)) err.push('IndexNow key file present in a preview build');
if (!preview) {
  const hd = fs.readFileSync(path.join(DIST, '_headers'), 'utf8');
  if (hd.split(/\n\s*\n/).some((b) => b.startsWith('/*') && /X-Robots-Tag/.test(b))) err.push('launch _headers has a global X-Robots-Tag');
  if (!/https:\/\/:project\.pages\.dev\/\*\s*\n\s+X-Robots-Tag: noindex/.test(hd)) err.push('launch _headers missing pages.dev noindex rule');
  for (const f of htmls) { const h = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f); if (/name="robots" content="noindex/.test(h) && !rel.startsWith('404') && !/^sitemap\/index/.test(rel)) err.push(`${rel}: noindex in launch build`); }
  if (!/^https:\/\/tiremileage\.com$/.test(ORIGIN)) err.push(`launch origin is ${ORIGIN}, expected https://tiremileage.com`);
  for (const f of ['robots.txt', 'llms.txt', 'sitemap-index.xml', ...files.filter((x) => /sitemap-[a-z]+\.xml$/.test(x)).map((x) => path.relative(DIST, x)), 'guides/feed.xml']) { const t = fs.readFileSync(path.join(DIST, f), 'utf8'); if (/pages\.dev|localhost/.test(t)) err.push(`${f}: references pages.dev/localhost`); }
  for (const f of htmls) { const h = fs.readFileSync(f, 'utf8'); if (/pages\.dev/.test(h)) err.push(`${path.relative(DIST, f)}: references pages.dev`); }
  const keyFiles = files.filter((x) => path.dirname(x) === DIST && /^[a-f0-9]{32}\.txt$/.test(path.basename(x))); if (keyFiles.length !== 1) err.push('IndexNow key file missing in launch build');
  else if (fs.readFileSync(keyFiles[0], 'utf8').trim() !== path.basename(keyFiles[0], '.txt')) err.push('IndexNow key file content mismatch');
}
console.log(`${guideCount} guides, ${hubCount} hub pages, ${sitemapLocs.size} sitemap URLs`);
for (const [t, p] of titles) if (p.length > 1) err.push(`duplicate title "${t}": ${p.join(', ')}`);
if (preview) { const hd = fs.readFileSync(path.join(DIST, '_headers'), 'utf8'); if (!/X-Robots-Tag: noindex/i.test(hd)) err.push('_headers missing X-Robots-Tag noindex'); }
console.log(`${htmls.length} html pages checked; ${err.length} problem(s)`); err.slice(0, 40).forEach((e) => console.log(' -', e)); process.exit(err.length ? 1 : 0);
