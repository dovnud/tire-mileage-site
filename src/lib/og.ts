// Build-time Open Graph images: SVG -> PNG with sharp (no satori needed). 1200x630.
import sharp from 'sharp';
import { FULL, siteBrands, siteSizes, siteLines, S, fmt } from './data';
import { GUIDES } from './all-guides';
import { BANDS, TYPES, RIMS, inBand, inType, rimSlug, sizesForRim } from './taxonomy';

export interface OgEntry { slug: string; kicker: string; title: string; sub: string }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const ogSlugForLine = (l: { brand_slug: string; line_slug: string }) => (FULL ? `brand/${l.brand_slug}` : `line/${l.brand_slug}/${l.line_slug}`);
export function ogEntries(): OgEntry[] {
  const e: OgEntry[] = [
    { slug: 'default', kicker: 'TireMileage', title: 'Which tires last longest? Government data, plain English.', sub: `${S.normalized_lines.toLocaleString()} tire lines from NHTSA’s UTQG ratings` },
    { slug: 'guides/index', kicker: 'Guides', title: 'Tire guides backed by sources', sub: `${GUIDES.length} guides · every claim cited` },
    { slug: 'treadwear/index', kicker: 'Browse by treadwear', title: 'Tires by treadwear band', sub: 'Under 200 to 800 and up' },
    { slug: 'type/index', kicker: 'Browse by type', title: 'Tires by category', sub: 'All-season, touring, performance, all-terrain, highway' },
    { slug: 'rim/index', kicker: 'Browse by rim size', title: 'Tires by rim diameter', sub: `${RIMS[0]}- to ${RIMS[RIMS.length - 1]}-inch` },
  ];
  for (const g of GUIDES) e.push({ slug: `guides/${g.slug}`, kicker: `Guide · ${g.kicker}`, title: g.h1, sub: `Updated ${g.updated} · sources cited` });
  for (const b of BANDS) e.push({ slug: `treadwear/${b.slug}`, kicker: 'Treadwear band', title: `Tires with treadwear ${b.label}`, sub: `${inBand(b).length} NHTSA-rated lines` });
  for (const t of TYPES) e.push({ slug: `type/${t.slug}`, kicker: 'Tire category', title: `${t.label} tires: treadwear and grades`, sub: `${inType(t).length} NHTSA-rated lines carry this marker` });
  for (const r of RIMS) e.push({ slug: `rim/${rimSlug(r)}`, kicker: 'Rim diameter', title: `${r}-inch tires: sizes and treadwear`, sub: `${sizesForRim(r).length} sizes in NHTSA’s data` });
  for (const b of siteBrands) e.push({ slug: `brand/${b.slug}`, kicker: 'Brand', title: `${b.name} tire treadwear ratings`, sub: 'NHTSA UTQG grades by line' });
  for (const s of siteSizes) e.push({ slug: `size/${s.key}`, kicker: 'Tire size', title: `${s.label} tires ranked by treadwear`, sub: `${s.lines} NHTSA-graded lines` });
  if (!FULL) for (const l of siteLines) e.push({ slug: ogSlugForLine(l), kicker: l.brand, title: `${l.line} treadwear & UTQG grades`, sub: `Treadwear ${l.wear_min === l.wear_max ? l.wear_min : `${l.wear_min}–${l.wear_max}`} · median ${fmt(l.wear_median)}` });
  return e;
}
function wrap(t: string, max: number, maxLines: number) {
  const words = t.split(/\s+/); const out: string[] = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) out.push(cur);
  if (out.length > maxLines) { out.length = maxLines; out[maxLines - 1] = out[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
  return out;
}
export async function renderOg(e: OgEntry): Promise<Buffer> {
  const lines = wrap(e.title, 26, 4);
  const fs = lines.length > 3 ? 56 : 64;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2545"/><stop offset="1" stop-color="#123a6b"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<circle cx="1080" cy="120" r="210" fill="none" stroke="#ffffff" stroke-opacity=".07" stroke-width="46"/>
<circle cx="1080" cy="120" r="110" fill="none" stroke="#ffffff" stroke-opacity=".05" stroke-width="24"/>
<rect x="64" y="64" width="12" height="44" rx="3" fill="#ffb938"/>
<text x="92" y="98" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="34" fill="#ffffff">TireMileage</text>
<text x="64" y="190" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="26" letter-spacing="3" fill="#ffb938">${esc(e.kicker.toUpperCase().slice(0, 44))}</text>
${lines.map((ln, i) => `<text x="64" y="${262 + i * (fs + 14)}" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="${fs}" fill="#ffffff">${esc(ln)}</text>`).join('\n')}
<text x="64" y="560" font-family="DejaVu Sans, sans-serif" font-size="30" fill="#c9d8ee">${esc(e.sub.slice(0, 70))}</text>
<text x="64" y="598" font-family="DejaVu Sans, sans-serif" font-size="22" fill="#8fa8c9">Source: NHTSA UTQG ratings · independent · sells nothing</text>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
}
