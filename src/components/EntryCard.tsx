import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getEntryDisplayName, type Entry } from "@/lib/data";
import type { Locale } from "@/i18n/routing";

export default function EntryCard({ entry }: { entry: Entry }) {
  const t = useTranslations("card");
  const locale = useLocale() as Locale;
  const name = getEntryDisplayName(entry);
  const isOffline = entry.status === "offline";
  const showImage = !isOffline && Boolean(entry.image);

  return (
    <div className="tape-card flex flex-col p-4">
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block"
        aria-label={t("visit", { name })}
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-ink-3">
          {showImage ? (
            <>
              <Image
                src={entry.image as string}
                alt={`${name} website screenshot`}
                fill
                sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-1.5 pt-5">
                <span className="font-display text-xs text-white/90">{entry.domain}</span>
              </div>
            </>
          ) : (
            <div className="no-signal-stripes flex h-full items-center justify-between px-5">
              <span className="tape-reel h-9 w-9 shrink-0" aria-hidden="true" />
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-paper-faint">
                {t("offlineShort")}
              </span>
              <span className="tape-reel h-9 w-9 shrink-0" aria-hidden="true" />
            </div>
          )}
        </div>
      </a>

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
