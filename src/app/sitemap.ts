import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllCategories, getAllEntries } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function alternatesFor(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getAllCategories();
  const entries = getAllEntries();
  const now = new Date();

  const staticPaths = ["", "/submit", "/about"];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "monthly",
      priority: path === "" ? 1 : 0.5,
      alternates: alternatesFor(path),
    }))
  );

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((c) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: alternatesFor(`/category/${c.slug}`),
    }))
  );

  const playlistEntries: MetadataRoute.Sitemap = entries.flatMap((e) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}/playlist/${e.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: alternatesFor(`/playlist/${e.slug}`),
    }))
  );

  return [...staticEntries, ...categoryEntries, ...playlistEntries];
}
