import type { MetadataRoute } from "next";

const SITE = "https://sambaram.events";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/planner`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
