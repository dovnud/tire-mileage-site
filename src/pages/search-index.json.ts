import { siteLines, siteBrands, siteSizes, lineUrl, sizeUrl, fmt } from '../lib/data';
import { COMPARE_PATH, REPLACE_PATH, REBATE_PATH, AFTER_REBATE_PATH, HOLIDAY_PATH, LOOKUP_PATH, LOAD_INDEX_PATH, SPEED_RATING_PATH, blackFridayPath, cyberMondayPath, loadIndexPath, sizeCostPath, sizeMeaningPath, speedRatingPath } from '../lib/paths';
import { querySizes } from '../lib/size-facts';
import { EXACT_PAGES, exactPath } from '../lib/exact-match';
import { LOAD_PAGES, SPEED_PAGES, lbLabel } from '../lib/service-ratings';
// Compact client-side search index: [type, label, url, extra]. L=line, B=brand, S=size. Loaded lazily on first search focus.
export function GET() {
  const rows: (string | number)[][] = [
    ...siteSizes.map((s) => ['S', s.label, sizeUrl(s.key), `${s.lines} lines`, s.key]),
    ...querySizes.map((s) => ['M', `What does ${s.label} mean?`, sizeMeaningPath(s.key), 'size code', s.key]),
    ...querySizes.map((s) => ['C', `${s.label} cost per mile`, sizeCostPath(s.key), 'your quote', s.key]),
    ...siteBrands.map((b) => ['B', b.name, `/tires/${b.slug}/`, `${b.lines.length} lines`]),
    ...siteLines.map((l) => ['L', `${l.brand} ${l.line}`, lineUrl(l), `treadwear ${fmt(l.wear_median)}`]),
    ['T', 'Compare two tires by cost per mile', COMPARE_PATH, 'tool'],
    ['T', 'Cost per mile after a rebate', AFTER_REBATE_PATH, 'tool'],
    ['T', 'November and December 2026 tire rebates', REBATE_PATH, 'tool'],
    ['T', 'When to replace your tires', REPLACE_PATH, 'tool'],
    ['T', 'Holiday 2026 winter tire and gear gift guide', HOLIDAY_PATH, 'tool'],
    ['Q', 'Exact tire size and line lookups', LOOKUP_PATH, 'wave 2'],
    ...EXACT_PAGES.map((p) => ['Q', p.h1, exactPath(p.slug), p.kicker]),
    ['I', 'Tire load index chart', LOAD_INDEX_PATH, 'Michelin kg'],
    ...LOAD_PAGES.map((p) => ['I', `Load index ${p.code}`, loadIndexPath(p.code), `${p.kg} kg, ${lbLabel(p.lb)} lb`]),
    ['V', 'Tire speed rating chart', SPEED_RATING_PATH, 'mph'],
    ...SPEED_PAGES.map((r) => ['V', `Speed rating ${r.letter}`, speedRatingPath(r.letter), `${r.mph} mph`]),
    ['T', 'Black Friday 2026 tire rebate dates', blackFridayPath, 'November 27, 2026'],
    ['T', 'Cyber Monday 2026 tire rebate dates', cyberMondayPath, 'November 30, 2026'],
  ];
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
