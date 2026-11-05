// Facts for the exact-query size pages. Grades come from the NHTSA file.
// Diameter, sidewall and revolutions per mile are arithmetic on the size code, not a measured tire.
import { median, siteSizes } from './data';
import { RIMS, rimOf } from './taxonomy';

export type SizeEntry = (typeof siteSizes)[number];

const MM_PER_IN = 25.4;
const IN_PER_MILE = 5280 * 12;

export function parseMetricSize(key: string): { width: number; aspect: number; rim: number } | null {
  const m = key.match(/^(\d+)-(\d+)r(\d+)$/);
  if (!m) return null;
  return { width: Number(m[1]), aspect: Number(m[2]), rim: Number(m[3]) };
}

/** Geometry from the three numbers in a metric size code. Not a measurement. */
export function sizeCodeGeometry(width: number, aspect: number, rim: number) {
  const sidewallMm = (width * aspect) / 100;
  const sidewallIn = sidewallMm / MM_PER_IN;
  const diameterIn = rim + 2 * sidewallIn;
  const circumferenceIn = Math.PI * diameterIn;
  const revsPerMile = IN_PER_MILE / circumferenceIn;
  return { sidewallMm, sidewallIn, diameterIn, circumferenceIn, revsPerMile };
}

export function oneDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, '');
}

export function revsLabel(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export interface RankedRow {
  brand: string;
  line: string;
  brand_slug: string;
  line_slug: string;
  wear_min: number | null;
  wear_max: number | null;
  traction: string | null;
  temperature: string | null;
  key: number;
  rank: number;
}

export function rankSize(s: SizeEntry) {
  const rows = s.rows
    .filter((r) => r.wear_min != null)
    .map((r) => ({ ...r, key: r.wear_min as number }))
    .sort((a, b) => b.key - a.key || a.brand.localeCompare(b.brand) || a.line.localeCompare(b.line));
  const n = rows.length;
  let rank = 0;
  let prev = -1;
  const ranked: RankedRow[] = rows.map((r, i) => {
    if (r.key !== prev) {
      rank = i + 1;
      prev = r.key;
    }
    return { ...r, rank };
  });
  const med = n ? median(rows.map((r) => r.key)) : null;
  const top = ranked[0];
  const topTies = ranked.filter((r) => r.rank === 1);
  const lowest = ranked[n - 1];
  return { ranked, n, med, top, topTies, lowest };
}

export function topLinePhrase(topTies: { brand: string; line: string; key: number }[]): string {
  if (topTies.length === 1) return `${topTies[0].brand} ${topTies[0].line} (${topTies[0].key})`;
  if (topTies.length > 1) return `${topTies.length} lines tied at ${topTies[0].key}, including ${topTies[0].brand} ${topTies[0].line}`;
  return 'none on file';
}

export const querySizes = siteSizes.filter((s) => parseMetricSize(s.key) && rankSize(s).n > 0);

export function relatedSizes(key: string, list: readonly SizeEntry[] = querySizes): SizeEntry[] {
  const parsed = parseMetricSize(key);
  if (!parsed) return [];
  const aspect = String(parsed.aspect);
  const rim = String(parsed.rim);
  return list.filter((x) => x.key !== key && (x.key.endsWith(`r${rim}`) || x.key.split('-')[1]?.startsWith(aspect))).slice(0, 8);
}

export function hasRimHub(key: string): boolean {
  try {
    return RIMS.includes(rimOf(key));
  } catch {
    return false;
  }
}

export const POPULAR_SIZE_KEYS = ['225-65r17', '235-65r17', '205-55r16', '215-60r16', '235-55r19', '245-45r18', '265-70r17', '225-45r17'] as const;

export function popularSizes(): SizeEntry[] {
  return POPULAR_SIZE_KEYS.map((k) => querySizes.find((s) => s.key === k)).filter((s): s is SizeEntry => !!s);
}
