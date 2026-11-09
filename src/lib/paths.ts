/** Stable URLs for the tool and gift pages. */
export const COMPARE_PATH = '/tools/compare-cost-per-mile/';
export const REPLACE_PATH = '/tools/when-to-replace/';
export const REBATE_PATH = '/tools/tire-rebates/';
export const AFTER_REBATE_PATH = '/tools/cost-per-mile-after-rebate/';
/** Exact-query pages for one published size. */
export const sizeMeaningPath = (key: string) => `/sizes/${key}/meaning/`;
export const sizeCostPath = (key: string) => `/sizes/${key}/cost-per-mile/`;
/** Opens a tool with that size already selected. The size key is [0-9r-]. */
export const compareSizePath = (key: string) => `${COMPARE_PATH}?size=${key}`;
export const afterRebateSizePath = (key: string) => `${AFTER_REBATE_PATH}?size=${key}`;
export const HOLIDAY_SLUG = 'holiday-2026-tire-gifts';
export const HOLIDAY_PATH = `/guides/${HOLIDAY_SLUG}/`;
export const BLACK_FRIDAY_SLUG = 'black-friday-2026-tire-rebates';
export const CYBER_MONDAY_SLUG = 'cyber-monday-2026-tire-rebates';
export const blackFridayPath = `/guides/${BLACK_FRIDAY_SLUG}/`;
export const cyberMondayPath = `/guides/${CYBER_MONDAY_SLUG}/`;
export const LOOKUP_PATH = '/lookup/';
/** One exact-query page. Slug is lowercase [a-z0-9-]. */
export const exactPath = (slug: string) => `/lookup/${slug}/`;
/** Date the November 2026 exact-match warranty and rebate pages were read. */
export const EXACT_DATE = '2026-11-09';
export const LOAD_INDEX_PATH = '/load-index/';
export const SPEED_RATING_PATH = '/speed-rating/';
export const loadIndexPath = (code: string) => `/load-index/${code}/`;
export const speedRatingPath = (letter: string) => `/speed-rating/${letter.toLowerCase()}/`;
export const PAGE_DATE = '2026-10-31';
/** Date the November–December 2026 manufacturer rebate pages were read. */
export const REBATE_DATE = '2026-11-04';
/** Date Michelin’s load and speed charts were read for the exact-match pages. */
export const CHART_DATE = '2026-11-06';
/** Friday after Thanksgiving 2026 (November 26 is the fourth Thursday). */
export const BLACK_FRIDAY_2026 = '2026-11-27';
/** Monday after that Friday. */
export const CYBER_MONDAY_2026 = '2026-11-30';
