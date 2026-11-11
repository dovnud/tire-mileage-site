// Thin tire-line pages (Nov 10 2026 audit). A line page is "thin" when it has no unique data beyond one grade:
//   - no NHTSA record names a specific size (every row is "All sizes"/unspecified, so there is no size table), and
//   - no maker mileage warranty is cited on the page (MAKER_FACTS has none).
// Thin pages stay published and linked, but carry <meta name="robots" content="noindex, follow"> and are left out of the sitemaps.
// Nothing is invented to "thicken" them. Add a cited warranty to MAKER_FACTS to make one indexable again.
import { MAKER_FACTS } from './makers';
import type { Line } from './data';
export const isThinLine = (l: Line) => l.records_with_explicit_size === 0 && !MAKER_FACTS[`${l.brand_slug}/${l.line_slug}`]?.warranty;
