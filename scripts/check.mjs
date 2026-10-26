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
  // Affiliate rules: Amazon links carry tag=AMAZON_TAG; no other retailer link carries affiliate params; Amazon disclosure on every page.
  const AMZ_TAG = process.env.AMAZON_TAG ?? 'tiremileage-20';
  for (const m of h.matchAll(/<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>/g)) {
    let u; try { u = new URL(m[1].replace(/&amp;/g, '&')); } catch { continue; }
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'amazon.com') { if (AMZ_TAG && u.searchParams.get('tag') !== AMZ_TAG) err.push(`${rel}: Amazon link missing tag=${AMZ_TAG}: ${m[1].slice(0, 90)}`); }
    else if (/^(discounttire\.com|tirerack\.com|simpletire\.com|prioritytire\.com)$/.test(host)) { const bad = [...u.searchParams.keys()].filter((k) => k !== 'q' && k !== 'searchTerm'); if (bad.length) err.push(`${rel}: ${host} link has extra params (${bad.join(',')})`); }
    else if (/(anrdoezrs|jdoqocy|tkqlhce|dpbolvw|kqzyfj|awin1|shareasale|linksynergy|go\.skimresources|click\.linksynergy)\./.test(u.hostname)) err.push(`${rel}: unexpected affiliate network link ${u.hostname}`);
  }
  if (!h.includes('As an Amazon Associate I earn from qualifying purchases.')) err.push(`${rel}: missing Amazon Associates disclosure`);
  if (/^tires\/[^/]+\/[^/]+\/index\.html$/.test(rel)) {
    const amz = [...h.matchAll(/href="(https:\/\/www\.amazon\.com\/[^"]*)"/g)]; if (!amz.length) err.push(`${rel}: line page has no Amazon link`);
    if (!/class="buy"[\s\S]*As an Amazon Associate I earn from qualifying purchases\.[\s\S]*<\/section>/.test(h)) err.push(`${rel}: Where-to-buy block lacks Amazon disclosure`);
  }
  // ---- Buy-path UX: every page links to /where-to-buy/, lines have a Shop CTA above "Where to buy", sizes have Shop links ----
  if (!rel.startsWith('404') && !/<nav class="nav"[^>]*>[\s\S]*?href="\/where-to-buy\/"[\s\S]*?<\/nav>/.test(h)) err.push(`${rel}: header nav lacks Where to buy`);
  if (/^tires\/[^/]+\/[^/]+\/index\.html$/.test(rel)) {
    const cta = h.indexOf('class="shop-cta"'), buy = h.indexOf('class="buy"');
    if (cta < 0) err.push(`${rel}: no Shop CTA block`);
    else {
      if (buy >= 0 && cta > buy) err.push(`${rel}: Shop CTA is not above the Where to buy section`);
      const blk = h.slice(cta, h.indexOf('</section>', cta));
      if (!/Check price on Amazon/.test(blk) || !/Check price at Discount Tire/.test(blk)) err.push(`${rel}: Shop CTA lacks Amazon/Discount Tire buttons`);
      if (!/href="https:\/\/www\.amazon\.com\/s\?[^"]*tag=/.test(blk) || !/href="https:\/\/www\.discounttire\.com\/search\?q=/.test(blk)) err.push(`${rel}: Shop CTA links are not real retailer search links`);
      if (!blk.includes('As an Amazon Associate I earn from qualifying purchases.')) err.push(`${rel}: Shop CTA lacks Amazon Associates disclosure`);
      if (/<h2[^>]*>(Key facts|What these grades)/.test(h.slice(0, cta))) err.push(`${rel}: Shop CTA is below the main content (not above the fold)`);
    }
    if (!/class="shopbar"/.test(h)) err.push(`${rel}: no sticky mobile Shop bar`);
    else { const bar = h.slice(h.indexOf('class="shopbar"'), h.indexOf('class="shopbar"') + 1800); if (!/Check price on Amazon/.test(bar) || !/Check price at Discount Tire/.test(bar)) err.push(`${rel}: sticky bar lacks CTA buttons`); }
  }
  if (/^sizes\/[^/]+\/index\.html$/.test(rel)) {
    const sh = h.indexOf('class="shop-cta shop-size"');
    if (sh < 0) err.push(`${rel}: size page has no Shop block`);
    else {
      if (sh > h.indexOf('<table')) err.push(`${rel}: Shop block is below the ranking table`);
      const blk = h.slice(sh, h.indexOf('</section>', sh));
      if (!/href="https:\/\/www\.amazon\.com\/s\?k=[^"]*tires[^"]*tag=/.test(blk) || !/href="https:\/\/www\.discounttire\.com\/search\?q=/.test(blk)) err.push(`${rel}: size Shop block lacks Amazon/Discount Tire size search links`);
    }
    const rows = (h.match(/<tr><td class="n c-rank"[^>]*>\d+<\/td>/g) || []).length, shops = (h.match(/data-shop-row/g) || []).length;
    if (!rows || shops < rows) err.push(`${rel}: ranked rows ${rows} but only ${shops} Shop buttons`);
  }
  if (rel === 'index.html') {
    if (!/Find tires for your size/.test(h) || !/we link to retailers/.test(h) || !/How it works/.test(h)) err.push(`${rel}: home lacks size flow / how-it-works line`);
    if ((h.match(/<li><h3>/g) || []).length < 3) err.push(`${rel}: home lacks 3-step strip`);
    if (!/View &amp; shop/.test(h)) err.push(`${rel}: home tire cards lack View & shop`);
  }
  if (rel === 'where-to-buy/index.html') {
    if (!/id="size-lookup"/.test(h)) err.push(`${rel}: no size entry form`);
    for (const k of ['doesn’t sell tires', 'commission', 'DOT']) if (!h.includes(k)) err.push(`${rel}: missing "${k}"`);
  }
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
{ const ll = fs.existsSync(path.join(DIST, 'llms.txt')) ? fs.readFileSync(path.join(DIST, 'llms.txt'), 'utf8') : ''; if (!ll.includes('/where-to-buy/')) err.push('llms.txt lacks /where-to-buy/'); }
{ const sp = fs.readFileSync(path.join(DIST, 'sitemap-pages.xml'), 'utf8'); if (!sp.includes('/where-to-buy/')) err.push('sitemap-pages lacks /where-to-buy/'); }
// ---- Legal pages (privacy, terms, affiliate disclosure, disclaimer; contact only when CONTACT_EMAIL is set) ----
{ const rd = (f) => fs.existsSync(path.join(DIST, f)) ? fs.readFileSync(path.join(DIST, f), 'utf8') : '';
  const contactRaw = (process.env.CONTACT_EMAIL !== undefined ? process.env.CONTACT_EMAIL : 'contact@tiremileage.com').trim(); // must mirror src/lib/site.ts
  const contactOn = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(contactRaw) ? contactRaw : '';
  const ga = /^G-[A-Z0-9]{4,20}$/.test((process.env.GA4_ID || '').trim()) ? process.env.GA4_ID.trim() : '';
  const legal = ['/privacy/', '/terms/', '/affiliate-disclosure/', '/disclaimer/', ...(contactOn ? ['/contact/'] : [])];
  const spages = rd('sitemap-pages.xml'), sitemapHtml = rd('sitemap/index.html');
  for (const u of legal) {
    if (!rd(u.slice(1) + 'index.html')) err.push(`legal page missing: ${u}`);
    if (!spages.includes(`${u}</loc>`)) err.push(`sitemap-pages lacks ${u}`);
    if (!llms.includes(u)) err.push(`llms.txt lacks ${u}`);
    if (!sitemapHtml.includes(`href="${u}"`)) err.push(`HTML sitemap lacks ${u}`);
    for (const f of htmls) if (!new RegExp(`<nav class="legal-links"[^>]*>[\\s\\S]*?href="${u}"[\\s\\S]*?</nav>`).test(fs.readFileSync(f, 'utf8'))) err.push(`${path.relative(DIST, f)}: footer lacks link to ${u}`);
  }
  // Contact gate: with CONTACT_EMAIL empty there is no /contact/ page and no link, sitemap or llms.txt entry anywhere.
  const hasContactPage = fs.existsSync(path.join(DIST, 'contact'));
  if (!contactOn) {
    if (hasContactPage) err.push('/contact/ was generated although CONTACT_EMAIL is empty');
    if (spages.includes('/contact/') || llms.includes('/contact/') || sitemapHtml.includes('/contact/')) err.push('/contact/ listed in a sitemap/llms.txt although CONTACT_EMAIL is empty');
    for (const f of htmls) if (/href="\/contact\/?"/.test(fs.readFileSync(f, 'utf8'))) err.push(`${path.relative(DIST, f)}: links /contact/ although CONTACT_EMAIL is empty`);
    const ab = rd('about/index.html'); if (!ab.includes('has not been set up yet')) err.push('about page lost its "contact not set up yet" wording');
  } else {
    const cp = rd('contact/index.html'); if (!cp) err.push('CONTACT_EMAIL set but /contact/ missing');
    else { if (cp.includes(contactOn) || /href="mailto:/i.test(cp)) err.push('contact page exposes the email in plain HTML'); if (!/data-r="/.test(cp)) err.push('contact page lacks obfuscated address'); for (const k of ['Corrections', 'Data issues', 'Affiliate']) if (!cp.includes(k)) err.push(`contact page missing "${k}"`); }
    if (contactOn !== 'contact@tiremileage.com' && !process.env.ALLOW_OTHER_CONTACT) console.log(`note: CONTACT_EMAIL is ${contactOn}, not the production default`);
    if (/has not been set up yet/.test(rd('about/index.html'))) err.push('about page still says contact is not set up although CONTACT_EMAIL is set');
  }
  // Privacy: states what is true today; GA4 text only when GA4_ID is set.
  const pv = rd('privacy/index.html');
  for (const k of ['Cloudflare Web Analytics', 'Amazon', 'tiremileage-20', 'Discount Tire', 'no accounts', 'Last revised']) if (pv && !pv.includes(k)) err.push(`privacy page missing "${k}"`);
  const GA_TEXT = /Google Analytics|GA4|gtag|googletagmanager|\b_ga\b|Global Privacy Control|Do Not Track/i;
  if (!ga && GA_TEXT.test(pv)) err.push(`privacy page contains GA text although GA4_ID is empty: ${(pv.match(GA_TEXT) || [])[0]}`);
  if (ga) for (const k of ['Google Analytics 4', 'Global Privacy Control', '_ga', 'opt']) if (!pv.includes(k)) err.push(`GA4 enabled but privacy page missing "${k}"`);
  // Terms / disclaimer / affiliate disclosure content.
  const tm = rd('terms/index.html'); for (const k of ['at your own risk', 'No warranty', 'Limitation of liability', 'Governing law', 'id="data-accuracy"', 'Intellectual property', 'Third-party links']) if (tm && !tm.includes(k)) err.push(`terms page missing "${k}"`);
  const ds = rd('disclaimer/index.html'); for (const k of ['not safety advice', 'only comparable within the same maker', 'placard', 'sidewall', 'estimate', 'tire makers']) if (ds && !ds.includes(k)) err.push(`disclaimer page missing "${k}"`);
  for (const [n, h] of [['terms', tm], ['disclaimer', ds]]) if (h && !h.includes('only comparable within the same maker')) err.push(`${n} lacks the data-accuracy list`);
  const af = rd('affiliate-disclosure/index.html'); for (const k of ['As an Amazon Associate I earn from qualifying purchases.', 'Discount Tire', 'rankings', 'cost-per-mile', 'may not show the exact tire']) if (af && !af.toLowerCase().includes(k.toLowerCase())) err.push(`affiliate-disclosure page missing "${k}"`);
  // Footer: one-line data-disclaimer pointer on every page; short disclosures link to the full affiliate disclosure.
  for (const f of htmls) { const h = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f);
    if (!h.includes('not safety advice (<a href="/disclaimer/">disclaimer</a>)')) err.push(`${rel}: footer lacks disclaimer pointer`);
    if (!/class="disc"[\s\S]*?href="\/affiliate-disclosure\/"/.test(h)) err.push(`${rel}: disclosure strip lacks affiliate-disclosure link`); }
  console.log(`Legal pages: ${legal.join(' ')}; contact ${contactOn ? 'ENABLED' : 'off (not generated)'}`); }
// ---- GA4 (see src/layouts/Base.astro): inert when GA4_ID is empty; when set, an inline loader on every page, never a render-blocking <script src> ----
{ const ga = /^G-[A-Z0-9]{4,20}$/.test((process.env.GA4_ID || '').trim()) ? process.env.GA4_ID.trim() : '';
  for (const f of htmls) { const h = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f);
    if (/<script[^>]+src="[^"]*(googletagmanager|google-analytics)/.test(h)) err.push(`${rel}: render-blocking/static Google script tag`);
    if (!ga) { if (/googletagmanager|google-analytics|gtag\(/.test(h)) err.push(`${rel}: GA4 code present but GA4_ID is empty`); }
    else if (!h.includes('googletagmanager.com/gtag/js') || !h.includes(ga) || !h.includes('globalPrivacyControl') || !h.includes("'load'")) err.push(`${rel}: GA4_ID set but loader missing/incomplete`); }
  console.log(`GA4 mode: ${ga ? 'ENABLED (' + ga + ')' : 'off (inert)'}`); }
console.log(`${guideCount} guides, ${hubCount} hub pages, ${sitemapLocs.size} sitemap URLs`);
for (const [t, p] of titles) if (p.length > 1) err.push(`duplicate title "${t}": ${p.join(', ')}`);
if (preview) { const hd = fs.readFileSync(path.join(DIST, '_headers'), 'utf8'); if (!/X-Robots-Tag: noindex/i.test(hd)) err.push('_headers missing X-Robots-Tag noindex'); }
console.log(`${htmls.length} html pages checked; ${err.length} problem(s)`); err.slice(0, 40).forEach((e) => console.log(' -', e)); process.exit(err.length ? 1 : 0);

