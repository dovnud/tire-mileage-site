// Post-build: write dist/_headers (preview vs launch) and the IndexNow key file (launch only).
import fs from 'node:fs';
const preview = process.env.PREVIEW !== '0';
// Static hosts guess Content-Type from the extension (.xml -> application/xml); the Atom feed should be served as Atom.
const feedHdr = ['/guides/feed.xml', '  Content-Type: application/atom+xml; charset=utf-8', ''];
// ads.txt must be text/plain at the site root (Cloudflare Pages). .txt is already plain text; set it explicitly.
const adsTxtHdr = ['/ads.txt', '  Content-Type: text/plain; charset=utf-8', ''];
const sec = ['  X-Content-Type-Options: nosniff', '  Referrer-Policy: strict-origin-when-cross-origin'];
let h;
if (preview) {
  h = ['/*', '  X-Robots-Tag: noindex, nofollow', ...sec, '', ...feedHdr, ...adsTxtHdr].join('\n');
} else {
  // Launch build: indexable on the real domain. Any *.pages.dev host (production alias or per-deploy preview) stays noindex.
  h = ['/*', ...sec, '', 'https://:project.pages.dev/*', '  X-Robots-Tag: noindex, nofollow', '', 'https://:version.:project.pages.dev/*', '  X-Robots-Tag: noindex, nofollow', '',
    '/_astro/*', '  Cache-Control: public, max-age=31536000, immutable', '', ...feedHdr, ...adsTxtHdr].join('\n');
  const key = fs.readFileSync('indexnow-key.txt', 'utf8').trim();
  if (!/^[a-f0-9]{32}$/.test(key)) throw new Error('bad IndexNow key');
  fs.writeFileSync(`dist/${key}.txt`, key);
  console.log(`IndexNow key file written: dist/${key}.txt`);
}
fs.writeFileSync('dist/_headers', h);
console.log(`dist/_headers written (${preview ? 'preview' : 'launch'})`);
