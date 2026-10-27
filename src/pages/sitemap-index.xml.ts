import { sitemapIndexXml } from '../lib/sitemap-xml';
export const GET = ({ site }: { site: URL }) => new Response(sitemapIndexXml(site), { headers: { 'Content-Type': 'application/xml' } });
