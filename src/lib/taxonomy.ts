// Computed taxonomy (tags) over the FULL NHTSA dataset. Hubs always exist for every band/type/rim; they only LINK to line/size pages that exist in this build.
import { allLines, allSizes, hasLine, median, type Line } from './data';
import records from '../../data/normalized/records.json';

export interface Band { slug: string; label: string; lo: number; hi: number; blurb: string }
export const BANDS: Band[] = [
  { slug: 'under-200', label: 'Under 200', lo: 0, hi: 199, blurb: 'The lowest band: grades under 200 mean the maker rates the tire to wear less than twice as slowly as the government’s control tire (graded 100).' },
  { slug: '200-299', label: '200–299', lo: 200, hi: 299, blurb: 'Rated to wear 2 to just under 3 times as slowly as the government’s control tire (graded 100) on the test course.' },
  { slug: '300-399', label: '300–399', lo: 300, hi: 399, blurb: 'Rated to wear 3 to just under 4 times as slowly as the government’s control tire (graded 100) on the test course.' },
  { slug: '400-499', label: '400–499', lo: 400, hi: 499, blurb: 'Rated to wear 4 to just under 5 times as slowly as the government’s control tire (graded 100) on the test course.' },
  { slug: '500-599', label: '500–599', lo: 500, hi: 599, blurb: 'Rated to wear 5 to just under 6 times as slowly as the government’s control tire (graded 100) on the test course.' },
  { slug: '600-699', label: '600–699', lo: 600, hi: 699, blurb: 'Rated to wear 6 to just under 7 times as slowly as the government’s control tire (graded 100) on the test course.' },
  { slug: '700-799', label: '700–799', lo: 700, hi: 799, blurb: 'Rated to wear 7 to just under 8 times as slowly as the government’s control tire (graded 100) on the test course.' },
  { slug: '800-plus', label: '800 and up', lo: 800, hi: 9999, blurb: 'The top of the scale: the maker rates these to wear 8 times as slowly as the control tire (graded 100) or more.' },
];
export const bandOf = (w: number) => BANDS.find((b) => w >= b.lo && w <= b.hi)!;

export interface TireType { slug: string; label: string; re: RegExp; blurb: string; markers: string }
// Name-marker based, so it is only as good as how the maker names the line. Nothing is inferred beyond the marker.
export const TYPES: TireType[] = [
  { slug: 'all-season', label: 'All-season', re: /(^|[^A-Z0-9])(A\/S|AS|ALL[- ]?SEASON|ALLSEASON|4S|AS\d?)([^A-Z0-9]|$)/, markers: 'A/S, AS, "All Season"', blurb: 'Lines whose NHTSA product name carries an all-season marker.' },
  { slug: 'touring', label: 'Touring', re: /TOURING|(^|[^A-Z0-9])TOUR([^A-Z0-9]|$)|GRAND TOUR/, markers: '"Touring", "Tour"', blurb: 'Lines whose NHTSA product name says touring or grand touring.' },
  { slug: 'performance', label: 'Performance', re: /(^|[^A-Z0-9])(H\/P|HP|UHP|MAX PERFORMANCE|ULTRA HIGH PERFORMANCE|PERFORMANCE)([^A-Z0-9]|$)/, markers: 'HP, H/P, UHP, "Performance"', blurb: 'Lines whose NHTSA product name says performance, high-performance (HP) or ultra-high-performance (UHP).' },
  { slug: 'all-terrain', label: 'All-terrain', re: /(^|[^A-Z0-9])(A\/T|AT|ALL[- ]TERRAIN|ATR)([^A-Z0-9]|$)/, markers: 'A/T, AT, "All Terrain"', blurb: 'Lines whose NHTSA product name says all-terrain (A/T).' },
  { slug: 'highway-terrain', label: 'Highway-terrain', re: /(^|[^A-Z0-9])(H\/T|HT|HIGHWAY)([^A-Z0-9]|$)/, markers: 'H/T, HT, "Highway"', blurb: 'Lines whose NHTSA product name says highway-terrain (H/T) or highway.' },
];

export const typesOf = (l: { line: string }) => TYPES.filter((t) => t.re.test(l.line.toUpperCase()));
const rated = allLines.filter((l) => l.wear_median != null) as (Line & { wear_median: number })[];
export const ratedLines = rated;
export const lineBand = (l: Line) => bandOf(Math.floor(l.wear_median as number));

export const inBand = (b: Band) => rated.filter((l) => lineBand(l).slug === b.slug);
export const inType = (t: TireType) => rated.filter((l) => t.re.test(l.line.toUpperCase()));

// ---- rim diameter hubs (from explicit sizes only) ----
export const rimOf = (key: string) => Number(key.match(/r(\d+)$/)![1]);
const rimRecCount = new Map<number, number>();
for (const r of records) if (r.size_key) rimRecCount.set(rimOf(r.size_key), (rimRecCount.get(rimOf(r.size_key)) ?? 0) + 1);
export const RIMS = [...rimRecCount.entries()].filter(([, n]) => n >= 15).map(([rim]) => rim).sort((a, b) => a - b);
export const rimSlug = (rim: number) => `${rim}-inch`;
export const sizesForRim = (rim: number) => allSizes.filter((s) => rimOf(s.key) === rim);

// ---- URLs & chips ----
export const bandUrl = (b: Band) => `/treadwear/${b.slug}/`;
export const typeUrl = (t: TireType) => `/type/${t.slug}/`;
export const rimUrl = (rim: number) => `/rim/${rimSlug(rim)}/`;
export interface Chip { label: string; href: string; kind: 'brand' | 'treadwear' | 'type' | 'rim' }
export function lineChips(l: Line): Chip[] {
  return [
    { label: l.brand, href: `/tires/${l.brand_slug}/`, kind: 'brand' },
    { label: `Treadwear ${lineBand(l).label}`, href: bandUrl(lineBand(l)), kind: 'treadwear' },
    ...typesOf(l).map((t) => ({ label: t.label, href: typeUrl(t), kind: 'type' as const })),
  ];
}
export const sizeChips = (key: string): Chip[] => [{ label: `${rimOf(key)}-inch rim`, href: rimUrl(rimOf(key)), kind: 'rim' }];

// ---- facts used by several pages ----
export const share = (n: number, d: number) => (d ? Math.round((1000 * n) / d) / 10 : 0);
export const medianOf = (ls: Line[]) => median(ls.map((l) => l.wear_median as number));
export function gradeCounts(ls: Line[], field: 'traction' | 'temperature') {
  const c: Record<string, number> = {};
  for (const l of ls) for (const [k, v] of Object.entries(l[field] as Record<string, number>)) c[k] = (c[k] ?? 0) + v;
  return c;
}
export function brandBreakdown(ls: Line[]) {
  const m = new Map<string, { brand: string; slug: string; n: number }>();
  for (const l of ls) (m.get(l.brand_slug) ?? m.set(l.brand_slug, { brand: l.brand, slug: l.brand_slug, n: 0 }).get(l.brand_slug)!).n++;
  return [...m.values()].sort((a, b) => b.n - a.n || a.brand.localeCompare(b.brand));
}
export { hasLine };
