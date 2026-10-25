// Central place for every outbound retailer link. Nothing else in the site should hand-build a retailer URL.
//
// Rules (set by Dov): plain, non-affiliate links only. CJ/Awin/Amazon Associates are NOT approved yet.
// No prices are scraped or shown. Each retailer's URL pattern below was checked on 2026-10-25 (see `verified`).
// Tire Rack and SimpleTire are listed but DISABLED: both block automated requests from our test machine
// (Tire Rack returns an "unavailable" page, SimpleTire returns 403 Access Denied), so a pattern could not be verified.

export const AFFILIATE_ENABLED = false; // TODO(affiliate): flip only after a program approves the site; then fill AFFILIATE below.
export const LINK_REL = 'sponsored nofollow noopener'; // correct for current plain links and for future affiliate links
export const CHECKED_ON = '2026-10-25';

export type RetailerId = 'discount-tire' | 'amazon' | 'tire-rack' | 'simpletire' | 'priority-tire';
export interface Retailer {
  id: RetailerId;
  name: string;
  enabled: boolean;
  verified: string; // how the pattern was verified (or why it was not)
  search: (query: string) => string;
}

const q = (s: string) => encodeURIComponent(s).replace(/%20/g, '+');

export const RETAILERS: Retailer[] = [
  {
    id: 'discount-tire',
    name: 'Discount Tire',
    enabled: true,
    verified: 'Browser load shows matching tire results for the query (e.g. "Continental ProContact TX" returns the ProContact TX listings); curl 200.',
    search: (s) => `https://www.discounttire.com/search?q=${q(s)}`,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    enabled: true,
    verified: 'curl 200 with server-rendered search results for several queries. Amazon sometimes returns 503 to automated clients; normal browsers are fine.',
    search: (s) => `https://www.amazon.com/s?k=${q(`${s} tire`)}`,
  },
  {
    id: 'tire-rack',
    name: 'Tire Rack',
    enabled: false,
    verified: 'NOT verified: site returns an "unavailable" page to automated requests (curl and headless Chromium) from our test machine.',
    search: (s) => `https://www.tirerack.com/tires/tires.jsp?searchTerm=${q(s)}`,
  },
  {
    id: 'simpletire',
    name: 'SimpleTire',
    enabled: false,
    verified: 'NOT verified: 403 Access Denied to curl and headless Chromium.',
    search: (s) => `https://simpletire.com/search?q=${q(s)}`,
  },
  {
    id: 'priority-tire',
    name: 'Priority Tire',
    enabled: false,
    verified: 'NOT usable: /search?q= loads but ignores the query and shows "All products", so it is not a real search link.',
    search: (s) => `https://www.prioritytire.com/search?q=${q(s)}`,
  },
];

// ---- Affiliate wrapper (OFF by default) ----------------------------------------------------------
// TODO(affiliate): once a program is approved, put the deep-link / tracking template per retailer here, e.g.
//   'discount-tire': (url) => `https://www.anrdoezrs.net/click-<PID>-<AID>?url=${encodeURIComponent(url)}`,
// Keep the plain URL as the fallback and keep LINK_REL + the on-page disclosure.
const AFFILIATE: Partial<Record<RetailerId, (plainUrl: string) => string>> = {};
function wrapAffiliate(id: RetailerId, plainUrl: string): string {
  if (!AFFILIATE_ENABLED) return plainUrl;
  return AFFILIATE[id]?.(plainUrl) ?? plainUrl;
}

// NHTSA names are filed by manufacturers and are sometimes spelled differently from the product name
// retailers use (e.g. NHTSA "Defender 2" vs Michelin's "Defender2"). Overrides are only used where the maker's
// own page confirms the spelling. Otherwise the NHTSA name is cleaned generically.
const QUERY_OVERRIDES: Record<string, string> = {
  'michelin/defender-2': 'Michelin Defender2',
  'michelin/defender-ltx-m-s-2': 'Michelin Defender LTX M/S2',
};

export function cleanLineName(line: string): string {
  return line
    .replace(/\([^)]*\)/g, ' ') // "(OE)", "(H-rated)"
    .replace(/"[^"]*"/g, ' ') // '"V" Spd Rtd'
    .replace(/\bSpd Rtd\b/gi, ' ')
    .replace(/\bOE\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function retailerQuery(brand: string, line: string, key?: string): string {
  if (key && QUERY_OVERRIDES[key]) return QUERY_OVERRIDES[key];
  const l = cleanLineName(line);
  return l.toLowerCase().startsWith(brand.toLowerCase()) ? l : `${brand} ${l}`;
}

/** The one function that builds outbound retailer URLs. */
export function buildRetailerUrl(retailer: RetailerId, brand: string, line: string, key?: string): string {
  const r = RETAILERS.find((x) => x.id === retailer);
  if (!r) throw new Error(`unknown retailer ${retailer}`);
  return wrapAffiliate(retailer, r.search(retailerQuery(brand, line, key)));
}

export const enabledRetailers = () => RETAILERS.filter((r) => r.enabled);
