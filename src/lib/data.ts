import raw from "../../data/entries.json";
import type { Locale } from "@/i18n/routing";

export interface Entry {
  id: number;
  slug: string;
  title: string;
  title_en: string | null;
  desc: string;
  owner: string;
  ownerUrl?: string | null;
  url: string;
  domain: string;
  category: string | null;
  status: "live" | "offline";
  featured: boolean;
  pinned: boolean;
  views: number | null;
  image: string | null;
}

export interface CategoryMeta {
  slug: string;
  hi: string;
  en: string;
}

interface DataFile {
  entries: Entry[];
  categories: CategoryMeta[];
}

const data = raw as DataFile;

export function getAllEntries(): Entry[] {
  return data.entries;
}

export function getGridEntries(): Entry[] {
  return data.entries.filter((e) => !e.featured);
}

export function getFeaturedEntry(): Entry | undefined {
  return data.entries.find((e) => e.featured);
}

export function getEntryBySlug(slug: string): Entry | undefined {
  return data.entries.find((e) => e.slug === slug);
}

export function getEntriesByCategory(categorySlug: string): Entry[] {
  return data.entries.filter((e) => e.category === categorySlug);
}

export function getAllCategories(): CategoryMeta[] {
  return data.categories;
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return data.categories.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string | null, locale: Locale): string {
  if (!slug) return "";
  const cat = getCategoryBySlug(slug);
  if (!cat) return slug;
  return locale === "hi" ? cat.hi : cat.en;
}

export function getEntryDisplayName(entry: Entry): string {
  return entry.title_en ?? entry.title;
}

// Owner is usually an @handle we can link to x.com/{handle}. A handful of
// entries have no discoverable creator - those get a plain, non-clickable
// "Unknown" string instead of a fake/misleading profile link.
export function hasOwnerHandle(entry: Entry): boolean {
  return entry.owner.startsWith("@");
}

// The link target for an owner credit, when one exists. Prefers an explicit
// ownerUrl - used when the creator's only findable presence is Instagram, a
// personal site, etc., not an X/Twitter @handle - falling back to the x.com
// profile derived from the handle. Returns null when there's nothing to
// link to, so callers render plain text instead.
export function getOwnerUrl(entry: Entry): string | null {
  if (entry.ownerUrl) return entry.ownerUrl;
  if (hasOwnerHandle(entry)) return `https://x.com/${entry.owner.replace("@", "")}`;
  return null;
}

export function getSimilarEntries(entry: Entry, limit = 4): Entry[] {
  if (!entry.category) return [];
  return data.entries
    .filter((e) => e.category === entry.category && e.slug !== entry.slug)
    .slice(0, limit);
}

export function getSiteCounts() {
  return {
    total: data.entries.length,
    live: data.entries.filter((e) => e.status === "live").length,
  };
}
