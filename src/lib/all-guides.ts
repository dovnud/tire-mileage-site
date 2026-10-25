import { GUIDES_A } from './guides-a';
import { GUIDES_B } from './guides-b';
import { GUIDES_C } from './guides-c';
import type { Guide } from './guides';
export { SRC } from './guides';
export const GUIDES: Guide[] = [...GUIDES_A, ...GUIDES_B, ...GUIDES_C];
export const guideBySlug = (s: string) => GUIDES.find((g) => g.slug === s)!;
export const guideUrl = (g: { slug: string }) => `/guides/${g.slug}/`;
