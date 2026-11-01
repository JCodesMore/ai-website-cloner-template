/**
 * Public origin for absolute URLs (sitemap, robots). Netlify sets URL to the site's main
 * address (custom domain once one is attached) at build and run time; SITE_URL overrides it.
 */
export const siteUrl = (process.env.SITE_URL || process.env.URL || "https://showlanka.com").replace(/\/+$/, "");
