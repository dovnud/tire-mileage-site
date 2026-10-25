import { UPDATED } from '../lib/data';
export const GET = ({ site }: { site: URL }) => {
  const names = ['pages', 'guides', 'tags', 'brands', 'tires', 'sizes'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `<sitemap><loc>${new URL(`/sitemap-${n}.xml`, site).href}</loc><lastmod>${UPDATED}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
