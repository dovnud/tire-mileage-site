import type { APIRoute } from 'astro';
import { GUIDES, guideUrl } from '../../lib/all-guides';
import { SITE_NAME } from '../../lib/site';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const GET: APIRoute = ({ site }) => {
  const o = site!.origin; const upd = [...GUIDES].map((g) => g.updated).sort().pop()!;
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"><title>${esc(SITE_NAME)} guides</title><subtitle>Tire guides backed by NHTSA data and cited sources</subtitle>
<link href="${o}/guides/feed.xml" rel="self" type="application/atom+xml"/><link href="${o}/guides/" rel="alternate" type="text/html"/><id>${o}/guides/</id><updated>${upd}T00:00:00Z</updated>
<author><name>${esc(SITE_NAME)}</name></author>
${GUIDES.map((g) => `<entry><title>${esc(g.h1)}</title><link href="${o}${guideUrl(g)}"/><id>${o}${guideUrl(g)}</id><updated>${g.updated}T00:00:00Z</updated><summary>${esc(g.description)}</summary></entry>`).join('\n')}
</feed>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
