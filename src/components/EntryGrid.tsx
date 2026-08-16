"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpDown } from "lucide-react";
import type { Entry } from "@/lib/data";
import EntryCard from "./EntryCard";

type SortKey = "default" | "views" | "likes" | "offline";
const SORT_KEYS: SortKey[] = ["default", "views", "likes", "offline"];
const isOffline = (e: Entry) => e.status === "offline";

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
    const copy = [...entries];

    if (sortKey === "offline") {
      // Surface offline/non-working entries first, for review.
      copy.sort((a, b) => Number(isOffline(b)) - Number(isOffline(a)));
      return copy;
    }

    // Every other mode: live entries always before offline ones, then the
    // chosen criterion within each group. Array.sort is stable, so
    // "default" just keeps each group's original relative order.
    copy.sort((a, b) => {
      const offlineDiff = Number(isOffline(a)) - Number(isOffline(b));
      if (offlineDiff !== 0) return offlineDiff;
      if (sortKey === "views") return getViews(b) - getViews(a);
      if (sortKey === "likes") return getLikes(b.slug) - getLikes(a.slug);
      return 0;
    });
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

  // EntryCard tracks the visit itself (dedup lives in trackVisit()); this
  // just reflects the server-confirmed count back into the grid's display
  // once it resolves, rather than guessing at an optimistic delta.
  function handleVisit(slug: string, newViews: number) {
    setCounts((prev) => (prev ? { ...prev, views: { ...prev.views, [slug]: newViews } } : prev));
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
            disabled={(key === "views" || key === "likes") && !counts}
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
            onVisit={handleVisit}
          />
        ))}
      </section>
    </div>
  );
}
