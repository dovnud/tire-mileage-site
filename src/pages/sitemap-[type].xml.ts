import { LEGAL_LINKS } from '../lib/site';
import { COST_PATH, COMPARE_PATH, REPLACE_PATH, REBATE_PATH, AFTER_REBATE_PATH, LOOKUP_PATH, LOAD_INDEX_PATH, SPEED_RATING_PATH, loadIndexPath, speedRatingPath } from '../lib/paths';
import { GUIDES, guideUrl } from '../lib/all-guides';
import { BANDS, TYPES, RIMS, bandUrl, typeUrl, rimUrl } from '../lib/taxonomy';
import { siteLines, siteSizes, siteBrands, UPDATED, lineUrl, sizeUrl } from '../lib/data';
import { sizeMeaningPath } from '../lib/paths';
import { isThinLine } from '../lib/thin';
import { querySizes } from '../lib/size-facts';
import { EXACT_DATE, EXACT_PAGES, exactPath } from '../lib/exact-match';
import { LOAD_PAGES, SPEED_PAGES } from '../lib/service-ratings';
export const getStaticPaths = () => ['pages', 'guides', 'tags', 'brands', 'tires', 'sizes'].map((type) => ({ params: { type } }));
export const GET = ({ site, params }: { site: URL; params: { type: string } }) => {
  const paths: Record<string, string[]> = {
    pages: ['/', '/tires/', '/sizes/', '/where-to-buy/', '/methodology/', '/about/', ...LEGAL_LINKS.map((l) => l.href), '/data/', '/sitemap/', COST_PATH, COMPARE_PATH, REPLACE_PATH, REBATE_PATH, AFTER_REBATE_PATH, LOOKUP_PATH, ...EXACT_PAGES.map((p) => exactPath(p.slug)), LOAD_INDEX_PATH, ...LOAD_PAGES.map((p) => loadIndexPath(p.code)), SPEED_RATING_PATH, ...SPEED_PAGES.map((r) => speedRatingPath(r.letter))],
    guides: ['/guides/', ...GUIDES.map(guideUrl)],
    tags: ['/treadwear/', ...BANDS.map(bandUrl), '/type/', ...TYPES.map(typeUrl), '/rim/', ...RIMS.map(rimUrl)],
    brands: siteBrands.map((b) => `/tires/${b.slug}/`),
    tires: siteLines.filter((l) => !isThinLine(l)).map(lineUrl),
    sizes: [...siteSizes.map((s) => sizeUrl(s.key)), ...querySizes.map((s) => sizeMeaningPath(s.key))],
  };
  const exactMod = new Set(EXACT_PAGES.map((p) => exactPath(p.slug)));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths[params.type].map((p) => `<url><loc>${new URL(p, site).href}</loc><lastmod>${(params.type === 'guides' && GUIDES.find((g) => guideUrl(g) === p)?.updated) || (exactMod.has(p) ? EXACT_DATE : UPDATED)}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
