import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Generated rather than a static file so the sitemap URL always matches the
 * deployed origin -- a hardcoded domain in robots.txt is wrong on every
 * preview deploy and easy to forget when the domain changes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to crawl here, and it accepts POSTs.
      disallow: ["/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
