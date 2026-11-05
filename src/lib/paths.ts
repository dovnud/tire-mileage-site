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
export const PAGE_DATE = '2026-10-31';
/** Date the November–December 2026 manufacturer rebate pages were read. */
export const REBATE_DATE = '2026-11-04';
