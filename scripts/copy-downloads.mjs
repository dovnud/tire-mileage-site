import fs from 'node:fs';
fs.mkdirSync('public/data',{recursive:true});
for (const [src,dst] of [['data/normalized/records.csv','public/data/nhtsa-utqg-records.csv'],['data/normalized/records.json','public/data/nhtsa-utqg-records.json'],['data/normalized/lines.json','public/data/nhtsa-utqg-lines.json'],['data/normalized/sizes.json','public/data/nhtsa-utqg-sizes.json'],['data/normalized/summary.json','public/data/summary.json']]) fs.copyFileSync(src,dst);
console.log('copied downloads');
// Pre-launch safety: the *.pages.dev preview is noindex (header + meta). Build with PREVIEW=0 for launch.
if (process.env.PREVIEW !== '0') fs.writeFileSync('public/_headers','/*\n  X-Robots-Tag: noindex, nofollow\n');
else if (fs.existsSync('public/_headers')) fs.unlinkSync('public/_headers');
