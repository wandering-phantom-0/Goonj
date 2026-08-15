"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ViewsAndLikes({ slug }: { slug: string }) {
  const t = useTranslations("playlist");
  const [views, setViews] = useState<number | null>(null);
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const hasCountedView = useRef(false);

  useEffect(() => {
    if (hasCountedView.current) return;
    hasCountedView.current = true;

    fetch(`/api/entries/${slug}/views`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setViews(data.views))
      .catch(() => {});

    fetch(`/api/entries/${slug}/likes`)
      .then((r) => r.json())
      .then((data) => {
        setLikes(data.likes);
        setLiked(data.liked);
      })
      .catch(() => {});
  }, [slug]);

  async function toggleLike() {
    if (pending) return;
    setPending(true);
    const nextLiked = !liked;

    // Optimistic update - snap back on failure.
    setLiked(nextLiked);
    setLikes((prev) => (prev ?? 0) + (nextLiked ? 1 : -1));

    try {
      const res = await fetch(`/api/entries/${slug}/likes`, {
        method: nextLiked ? "POST" : "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setLiked(data.liked);
      } else {
        setLiked(!nextLiked);
        setLikes((prev) => (prev ?? 0) - (nextLiked ? 1 : -1));
      }
    } catch {
      setLiked(!nextLiked);
      setLikes((prev) => (prev ?? 0) - (nextLiked ? 1 : -1));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm text-paper-dim">
      <span className="inline-flex items-center gap-1.5" aria-live="polite">
        <Eye size={15} aria-hidden="true" />
        {views === null ? "-" : views.toLocaleString()} {t("viewsLabel")}
      </span>

      <button
        type="button"
        onClick={toggleLike}
        disabled={pending}
        aria-pressed={liked}
        aria-label={liked ? t("likedAction") : t("likeAction")}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 transition-colors hover:border-tape-dim disabled:opacity-60"
      >
        <Heart
          size={15}
          aria-hidden="true"
          className={liked ? "fill-tape text-tape" : "text-paper-dim"}
        />
        {likes === null ? "-" : likes.toLocaleString()}
      </button>
    </div>
  );
}
