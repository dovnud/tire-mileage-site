import { defineConfig } from 'astro/config';
// SITE_URL: absolute origin used for canonicals/sitemaps. Preview build uses the *.pages.dev URL.
// No custom domain is attached; tiremileage.com is NOT purchased.
export default defineConfig({
  site: process.env.SITE_URL || 'https://tiremileage.pages.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
