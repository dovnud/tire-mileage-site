import { sitemapIndexXml } from '../lib/sitemap-xml';
// Conventional URL. Same index as /sitemap-index.xml so clients that request /sitemap.xml do not get a 404.
export const GET = ({ site }: { site: URL }) => new Response(sitemapIndexXml(site), { headers: { 'Content-Type': 'application/xml' } });
