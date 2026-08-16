"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCount } from "@/lib/format";
import { trackVisit } from "@/lib/trackVisit";
import LikeButton from "./LikeButton";

export default function ViewsAndLikes({ slug }: { slug: string }) {
  const t = useTranslations("playlist");
  const [views, setViews] = useState<number | null>(null);
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    trackVisit(slug).then((newViews) => {
      if (newViews !== null) setViews(newViews);
    });

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
      <span className="inline-flex items-center gap-1.5 leading-none" aria-live="polite">
        <Eye size={15} aria-hidden="true" />
        {views === null ? "-" : formatCount(views)} {t("viewsLabel")}
      </span>

      <LikeButton
        liked={liked}
        count={likes ?? 0}
        onToggle={toggleLike}
        disabled={pending}
        label={liked ? t("likedAction") : t("likeAction")}
        size={15}
        className="rounded-full border border-line px-3 py-1 text-paper-dim transition-colors hover:border-tape-dim disabled:opacity-60"
      />
    </div>
  );
}
