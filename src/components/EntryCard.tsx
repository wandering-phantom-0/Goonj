import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, Eye } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getEntryDisplayName, type Entry } from "@/lib/data";
import type { Locale } from "@/i18n/routing";
import { formatCount } from "@/lib/format";
import LikeButton from "./LikeButton";

interface EntryCardProps {
  entry: Entry;
  views?: number;
  likes?: number;
  liked?: boolean;
  onToggleLike?: (slug: string) => void;
}

export default function EntryCard({ entry, views, likes, liked, onToggleLike }: EntryCardProps) {
  const t = useTranslations("card");
  const tPlaylist = useTranslations("playlist");
  const showStats = views !== undefined;
  const locale = useLocale() as Locale;
  const name = getEntryDisplayName(entry);
  const isOffline = entry.status === "offline";
  const showImage = !isOffline && Boolean(entry.image);

  return (
    <div className="tape-card flex flex-col p-4">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-ink-3">
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="absolute inset-0 block"
          aria-label={t("visit", { name })}
        >
          {showImage ? (
            <Image
              src={entry.image as string}
              alt={`${name} website screenshot`}
              fill
              sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="no-signal-stripes flex h-full items-center justify-between px-5">
              <span className="tape-reel h-9 w-9 shrink-0" aria-hidden="true" />
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-paper-faint">
                {t("offlineShort")}
              </span>
              <span className="tape-reel h-9 w-9 shrink-0" aria-hidden="true" />
            </div>
          )}
        </a>

        {showImage && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pb-1.5 pt-6">
            <span className="min-w-0 flex-1 truncate font-display text-xs text-white/90">
              {entry.domain}
            </span>
            {showStats && (
              <div className="pointer-events-auto flex shrink-0 items-center gap-2 text-[11px] text-white/90">
                <span className="inline-flex items-center gap-1" aria-live="polite">
                  <Eye size={12} aria-hidden="true" />
                  {formatCount(views ?? 0)}
                </span>
                <LikeButton
                  liked={Boolean(liked)}
                  count={likes ?? 0}
                  onToggle={() => onToggleLike?.(entry.slug)}
                  label={liked ? tPlaylist("likedAction") : tPlaylist("likeAction")}
                  size={13}
                  className="text-white/90 transition-colors hover:text-white"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <h3 className="font-display text-lg leading-snug text-paper">{name}</h3>
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={t("visit", { name })}
          className="mt-1 shrink-0 rounded-full border border-line p-1.5 text-tape transition-colors hover:border-tape-dim"
        >
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>

      <p className="mt-1 text-sm text-paper-dim">{entry.desc}</p>

      <div className="mt-3 flex items-center justify-between text-xs">
        <Link href={`/playlist/${entry.slug}`} className="font-medium text-tape hover:underline">
          {locale === "hi" ? "और जानें" : "Learn more"}
        </Link>
        <a
          href={`https://x.com/${entry.owner.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-paper-faint transition-colors hover:text-paper-dim hover:underline"
        >
          {entry.owner}
        </a>
      </div>
    </div>
  );
}
