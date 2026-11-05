import { siteLines, siteBrands, siteSizes, lineUrl, sizeUrl, fmt } from '../lib/data';
import { COMPARE_PATH, REPLACE_PATH, REBATE_PATH, AFTER_REBATE_PATH, HOLIDAY_PATH, sizeCostPath, sizeMeaningPath } from '../lib/paths';
import { querySizes } from '../lib/size-facts';
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
  ];
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
