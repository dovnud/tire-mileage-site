import { LEGAL_LINKS } from '../lib/site';
import { COMPARE_PATH, REPLACE_PATH } from '../lib/paths';
import { GUIDES, guideUrl } from '../lib/all-guides';
import { BANDS, TYPES, RIMS, bandUrl, typeUrl, rimUrl } from '../lib/taxonomy';
import { siteLines, siteSizes, siteBrands, UPDATED, lineUrl, sizeUrl } from '../lib/data';
export const getStaticPaths = () => ['pages', 'guides', 'tags', 'brands', 'tires', 'sizes'].map((type) => ({ params: { type } }));
export const GET = ({ site, params }: { site: URL; params: { type: string } }) => {
  const paths: Record<string, string[]> = {
    pages: ['/', '/tires/', '/sizes/', '/where-to-buy/', '/methodology/', '/about/', ...LEGAL_LINKS.map((l) => l.href), '/data/', '/sitemap/', COMPARE_PATH, REPLACE_PATH],
    guides: ['/guides/', ...GUIDES.map(guideUrl)],
    tags: ['/treadwear/', ...BANDS.map(bandUrl), '/type/', ...TYPES.map(typeUrl), '/rim/', ...RIMS.map(rimUrl)],
    brands: siteBrands.map((b) => `/tires/${b.slug}/`),
    tires: siteLines.map(lineUrl),
    sizes: siteSizes.map((s) => sizeUrl(s.key)),
  };
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths[params.type].map((p) => `<url><loc>${new URL(p, site).href}</loc><lastmod>${(params.type === 'guides' && GUIDES.find((g) => guideUrl(g) === p)?.updated) || UPDATED}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
