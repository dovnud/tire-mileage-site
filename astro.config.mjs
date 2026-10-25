import { defineConfig } from 'astro/config';
// SITE_URL: absolute origin used for canonicals/sitemaps. Preview build uses the *.pages.dev URL.
// Launch: SITE_URL=https://tiremileage.com (npm run build:launch).
export default defineConfig({
  site: process.env.SITE_URL || 'https://tiremileage.pages.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
