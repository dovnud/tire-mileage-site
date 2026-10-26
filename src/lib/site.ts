export const SITE_NAME = 'TireMileage';
// Ads are OFF. When switched on, each <AdSlot> reserves a fixed height (CSS min-height) so there is no layout shift.
export const ADS_ENABLED = false;

// Google Analytics 4 measurement ID. EMPTY BY DEFAULT = analytics is completely off: no script, no request, nothing in the HTML.
// To enable, set GA4_ID at build time (e.g. GA4_ID=G-XXXXXXXXXX npm run build:launch). Only a well-formed "G-XXXXXXXXXX" value is accepted;
// anything else is treated as empty so a typo can never inject markup.
const rawGa4 = (typeof process !== 'undefined' && process.env?.GA4_ID ? process.env.GA4_ID : '').trim();
export const GA4_ID: string = /^G-[A-Z0-9]{4,20}$/.test(rawGa4) ? rawGa4 : '';
// Date the privacy page text was last revised (update whenever its wording changes).
export const PRIVACY_REVISED = '2026-10-26';

// Public contact email (a role address on the site's own domain; no personal address belongs here).
// Default is contact@tiremileage.com so every rebuild keeps /contact/. Override at build time with CONTACT_EMAIL=other@domain; set CONTACT_EMAIL= (empty)
// to turn contact OFF: the /contact/ page is then not generated and no link, sitemap or llms.txt entry exists. Malformed values are treated as empty.
export const DEFAULT_CONTACT_EMAIL = 'contact@tiremileage.com';
const rawContact = (typeof process !== 'undefined' && process.env?.CONTACT_EMAIL !== undefined ? process.env.CONTACT_EMAIL : DEFAULT_CONTACT_EMAIL).trim();
export const CONTACT_EMAIL: string = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(rawContact) ? rawContact : '';
export const CONTACT_ENABLED = CONTACT_EMAIL !== '';
// Date the legal pages (terms, affiliate disclosure, disclaimer, contact) were last revised. Update whenever their wording changes.
export const LEGAL_REVISED = '2026-10-26';
// Footer / sitemap / llms.txt legal pages, in one place. Contact appears only when CONTACT_EMAIL is set.
export const LEGAL_LINKS: { name: string; href: string; desc: string }[] = [
  { name: 'Privacy', href: '/privacy/', desc: 'what the site collects, analytics, cookies, Amazon affiliate links' },
  { name: 'Terms', href: '/terms/', desc: 'terms of use for this informational website' },
  { name: 'Affiliate disclosure', href: '/affiliate-disclosure/', desc: 'how the site earns commissions and what they do not influence' },
  { name: 'Disclaimer', href: '/disclaimer/', desc: 'tire data is informational, not safety advice' },
  ...(CONTACT_ENABLED ? [{ name: 'Contact', href: '/contact/', desc: 'corrections, data issues and affiliate questions' }] : []),
];
