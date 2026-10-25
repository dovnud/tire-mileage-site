import type { APIRoute } from 'astro';
import { ogEntries, renderOg } from '../../lib/og';
export function getStaticPaths() { return ogEntries().map((e) => ({ params: { slug: e.slug }, props: { e } })); }
export const GET: APIRoute = async ({ props }) => new Response(await renderOg((props as any).e), { headers: { 'Content-Type': 'image/png' } });
