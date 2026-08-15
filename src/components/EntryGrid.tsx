"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpDown } from "lucide-react";
import type { Entry } from "@/lib/data";
import EntryCard from "./EntryCard";

type SortKey = "default" | "views" | "likes";
const SORT_KEYS: SortKey[] = ["default", "views", "likes"];

interface CountsResponse {
  views: Record<string, number>;
  likes: Record<string, number>;
  likedSlugs: string[];
}

export default function EntryGrid({ entries }: { entries: Entry[] }) {
  const t = useTranslations("home");
  const [counts, setCounts] = useState<CountsResponse | null>(null);
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("default");

  useEffect(() => {
    // One request for the entire grid, regardless of entry count.
    fetch("/api/entries/counts")
      .then((r) => r.json())
      .then((data: CountsResponse) => {
        setCounts(data);
        setLikedSlugs(new Set(data.likedSlugs));
      })
      .catch(() => {});
  }, []);

  const getViews = (entry: Entry) => counts?.views[entry.slug] ?? entry.views ?? 0;
  const getLikes = (slug: string) => counts?.likes[slug] ?? 0;

  const sortedEntries = useMemo(() => {
    if (sortKey === "default") return entries;
    const copy = [...entries];
    copy.sort((a, b) =>
      sortKey === "views" ? getViews(b) - getViews(a) : getLikes(b.slug) - getLikes(a.slug)
    );
    return copy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, sortKey, counts]);

  async function toggleLike(slug: string) {
    const wasLiked = likedSlugs.has(slug);
    const delta = wasLiked ? -1 : 1;

    applyLikeState(slug, !wasLiked, delta);

    try {
      const res = await fetch(`/api/entries/${slug}/likes`, {
        method: wasLiked ? "DELETE" : "POST",
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { likes: number; liked: boolean };
      setCounts((prev) =>
        prev ? { ...prev, likes: { ...prev.likes, [slug]: data.likes } } : prev
      );
      setLikedSlugs((prev) => {
        const next = new Set(prev);
        if (data.liked) next.add(slug);
        else next.delete(slug);
        return next;
      });
    } catch {
      applyLikeState(slug, wasLiked, -delta); // revert
    }
  }

  function applyLikeState(slug: string, liked: boolean, delta: number) {
    setLikedSlugs((prev) => {
      const next = new Set(prev);
      if (liked) next.add(slug);
      else next.delete(slug);
      return next;
    });
    setCounts((prev) =>
      prev
        ? { ...prev, likes: { ...prev.likes, [slug]: (prev.likes[slug] ?? 0) + delta } }
        : prev
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-end gap-2 text-xs">
        <ArrowUpDown size={13} className="text-paper-faint" aria-hidden="true" />
        <span className="text-paper-faint">{t("sortLabel")}</span>
        {SORT_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSortKey(key)}
            disabled={key !== "default" && !counts}
            data-active={sortKey === key}
            className="chip rounded-full px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t(`sort.${key}`)}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-x-6 gap-y-10 pb-20 sm:grid-cols-2 sm:gap-y-14 sm:pb-28 lg:grid-cols-3 lg:gap-x-8 2xl:grid-cols-4">
        {sortedEntries.map((entry) => (
          <EntryCard
            key={entry.slug}
            entry={entry}
            views={getViews(entry)}
            likes={getLikes(entry.slug)}
            liked={likedSlugs.has(entry.slug)}
            onToggleLike={toggleLike}
          />
        ))}
      </section>
    </div>
  );
}
