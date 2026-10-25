import { siteLines, siteSizes, siteBrands, UPDATED, lineUrl, sizeUrl } from '../lib/data';
export const getStaticPaths = () => ['pages', 'brands', 'tires', 'sizes'].map((type) => ({ params: { type } }));
export const GET = ({ site, params }: { site: URL; params: { type: string } }) => {
  const paths: Record<string, string[]> = {
    pages: ['/', '/tires/', '/sizes/', '/methodology/', '/about/', '/data/'],
    brands: siteBrands.map((b) => `/tires/${b.slug}/`),
    tires: siteLines.map(lineUrl),
    sizes: siteSizes.map((s) => sizeUrl(s.key)),
  };
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths[params.type].map((p) => `<url><loc>${new URL(p, site).href}</loc><lastmod>${UPDATED}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
