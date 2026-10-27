// Which guides a lookup page should link. A stable hash spreads the long guides across lines and sizes
// so each guide gets many inbound links, and a few slots stay tied to the tire’s category.
import { typesOf, rimOf } from './taxonomy';

export const GUIDE_POOL = [
  'dot-tire-date-code',
  'load-index-and-speed-rating',
  'why-treadwear-grades-differ-by-size',
  'which-tires-are-exempt-from-utqg',
  'how-the-utqg-treadwear-test-works',
  'all-terrain-vs-highway-terrain-tires',
  'replacing-two-tires-instead-of-four',
  'original-equipment-vs-replacement-tires',
  'summer-tires-vs-all-season-tires',
  'what-tpms-does-not-tell-you',
  'p-metric-vs-euro-metric-vs-lt-tires',
  'why-your-size-may-be-missing',
] as const;

const uniq = (slugs: string[]) => [...new Set(slugs)];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fromPool(key: string, n: number, skip: string[] = []): string[] {
  const h = hash(key);
  const out: string[] = [];
  for (let i = 0; out.length < n && i < GUIDE_POOL.length * 2; i++) {
    const slug = GUIDE_POOL[(h + i * 5) % GUIDE_POOL.length];
    if (skip.includes(slug) || out.includes(slug)) continue;
    out.push(slug);
  }
  return out;
}

export function guidesForLine(l: { brand_slug: string; line_slug: string; line: string; wear_median: number | null }): string[] {
  const kinds = new Set(typesOf(l).map((t) => t.slug));
  const contextual = kinds.has('all-terrain') || kinds.has('highway-terrain')
    ? 'all-terrain-vs-highway-terrain-tires'
    : kinds.has('performance')
      ? 'load-index-and-speed-rating'
      : kinds.has('all-season')
        ? 'summer-tires-vs-all-season-tires'
        : 'why-treadwear-grades-differ-by-size';
  const high = (l.wear_median ?? 0) >= 600;
  const fixed = ['what-does-treadwear-rating-mean', contextual, high ? 'treadwear-vs-warranty-mileage' : 'how-to-make-tires-last-longer'];
  return uniq([...fixed, ...fromPool(`${l.brand_slug}/${l.line_slug}`, 3, fixed)]).slice(0, 6);
}

export function guidesForSize(key: string): string[] {
  const rim = rimOf(key);
  const contextual = rim >= 18 ? 'p-metric-vs-euro-metric-vs-lt-tires' : 'load-index-and-speed-rating';
  const fixed = ['how-to-find-longest-lasting-tires-for-your-size', 'why-your-size-may-be-missing', 'tire-cost-per-mile', contextual];
  return uniq([...fixed, ...fromPool(key, 2, fixed)]).slice(0, 6);
}

export function guidesForBrand(slug: string): string[] {
  const fixed = ['what-does-treadwear-rating-mean', 'why-treadwear-grades-differ-by-size', 'original-equipment-vs-replacement-tires'];
  return uniq([...fixed, ...fromPool(slug, 3, fixed)]).slice(0, 6);
}

export function guidesForBand(slug: string): string[] {
  const high = slug === '600-699' || slug === '700-799' || slug === '800-plus';
  const fixed = ['what-does-treadwear-rating-mean', high ? 'treadwear-vs-warranty-mileage' : 'how-the-utqg-treadwear-test-works', 'which-tires-are-exempt-from-utqg', 'why-treadwear-grades-differ-by-size'];
  return uniq([...fixed, ...fromPool(slug, 2, fixed)]).slice(0, 6);
}

export function guidesForType(slug: string): string[] {
  const contextual = slug === 'all-terrain' || slug === 'highway-terrain'
    ? 'all-terrain-vs-highway-terrain-tires'
    : slug === 'performance'
      ? 'summer-tires-vs-all-season-tires'
      : slug === 'touring'
        ? 'original-equipment-vs-replacement-tires'
        : 'summer-tires-vs-all-season-tires';
  const fixed = [contextual, 'all-season-vs-all-weather-vs-winter-tires', 'what-does-treadwear-rating-mean', 'p-metric-vs-euro-metric-vs-lt-tires'];
  return uniq([...fixed, ...fromPool(slug, 2, fixed)]).slice(0, 6);
}

export function guidesForRim(rim: number): string[] {
  const fixed = ['how-to-read-a-tire-sidewall', 'p-metric-vs-euro-metric-vs-lt-tires', 'load-index-and-speed-rating', 'why-your-size-may-be-missing'];
  return uniq([...fixed, ...fromPool(String(rim), 2, fixed)]).slice(0, 6);
}

export const guidesForTreadwearIndex = () => ['what-does-treadwear-rating-mean', 'how-the-utqg-treadwear-test-works', 'why-treadwear-grades-differ-by-size', 'which-tires-are-exempt-from-utqg', 'how-to-find-longest-lasting-tires-for-your-size'];
export const guidesForTypeIndex = () => ['all-season-vs-all-weather-vs-winter-tires', 'summer-tires-vs-all-season-tires', 'all-terrain-vs-highway-terrain-tires', 'p-metric-vs-euro-metric-vs-lt-tires', 'what-does-treadwear-rating-mean'];
export const guidesForRimIndex = () => ['how-to-read-a-tire-sidewall', 'p-metric-vs-euro-metric-vs-lt-tires', 'load-index-and-speed-rating', 'dot-tire-date-code', 'replacing-two-tires-instead-of-four'];
