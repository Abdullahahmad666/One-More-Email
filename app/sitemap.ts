import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Built from a list rather than written by hand, so adding a page is one line
 * and lastModified can never go stale. The tools, templates and guides from
 * the playbook get added here as they ship -- they are the pages that will
 * actually rank; this one exists to convert traffic we send it.
 */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.map((page) => ({
    url: `${SITE.url}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
