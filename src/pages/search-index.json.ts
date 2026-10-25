import { siteLines, siteBrands, siteSizes, lineUrl, sizeUrl, fmt } from '../lib/data';
// Compact client-side search index: [type, label, url, extra]. L=line, B=brand, S=size. Loaded lazily on first search focus.
export function GET() {
  const rows: (string | number)[][] = [
    ...siteSizes.map((s) => ['S', s.label, sizeUrl(s.key), `${s.lines} lines`, s.key]),
    ...siteBrands.map((b) => ['B', b.name, `/tires/${b.slug}/`, `${b.lines.length} lines`]),
    ...siteLines.map((l) => ['L', `${l.brand} ${l.line}`, lineUrl(l), `treadwear ${fmt(l.wear_median)}`]),
  ];
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
