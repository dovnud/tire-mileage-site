import fs from 'node:fs';
fs.mkdirSync('public/data',{recursive:true});
for (const [src,dst] of [['data/normalized/records.csv','public/data/nhtsa-utqg-records.csv'],['data/normalized/records.json','public/data/nhtsa-utqg-records.json'],['data/normalized/lines.json','public/data/nhtsa-utqg-lines.json'],['data/normalized/sizes.json','public/data/nhtsa-utqg-sizes.json'],['data/normalized/summary.json','public/data/summary.json']]) fs.copyFileSync(src,dst);
console.log('copied downloads');
// Pre-launch safety: the *.pages.dev preview is noindex (header + meta). Build with PREVIEW=0 for launch.
if (process.env.PREVIEW !== '0') fs.writeFileSync('public/_headers','/*\n  X-Robots-Tag: noindex, nofollow\n');
else if (fs.existsSync('public/_headers')) fs.unlinkSync('public/_headers');
// IndexNow (Bing/Yandex/etc.): OFF for the preview. Only when building for launch (PREVIEW=0) with INDEXNOW_KEY set
// (8-128 chars of a-z, A-Z, 0-9, dashes) do we publish the key file at /<key>.txt. See scripts/indexnow.mjs.
const key = process.env.INDEXNOW_KEY;
for (const f of fs.readdirSync('public')) if (/^[A-Za-z0-9-]{8,128}\.txt$/.test(f) && f !== 'robots.txt') fs.unlinkSync(`public/${f}`);
if (process.env.PREVIEW === '0' && key && /^[A-Za-z0-9-]{8,128}$/.test(key)) { fs.writeFileSync(`public/${key}.txt`, key); console.log('IndexNow key file written'); }
else console.log('IndexNow: off (preview build or no INDEXNOW_KEY)');
