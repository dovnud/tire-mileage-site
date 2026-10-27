import { UPDATED } from './data';

export const SITEMAP_PARTS = ['pages', 'guides', 'tags', 'brands', 'tires', 'sizes'] as const;

/** Sitemap index body. Served at both /sitemap-index.xml and /sitemap.xml. */
export function sitemapIndexXml(site: URL): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SITEMAP_PARTS.map((n) => `<sitemap><loc>${new URL(`/sitemap-${n}.xml`, site).href}</loc><lastmod>${UPDATED}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`;
}
