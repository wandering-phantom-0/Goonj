import Image from "next/image";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import type { Entry } from "@/lib/data";

export default function FeaturedEntry({ entry }: { entry: Entry }) {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-2xl pb-14 sm:pb-20">
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-line" aria-hidden="true" />
        <span className="font-body text-[11px] uppercase tracking-[0.3em] text-tape">
          {t("originLabel")}
        </span>
        <span className="h-px w-12 bg-line" aria-hidden="true" />
      </div>

      <div className="tape-card p-6 shadow-glow">
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block"
          aria-label={entry.title}
        >
          <div className="relative aspect-video overflow-hidden rounded-lg bg-ink-3">
            {entry.image ? (
              <>
                <Image
                  src={entry.image}
                  alt={`${entry.title} website screenshot`}
                  fill
                  sizes="(min-width: 640px) 42rem, 90vw"
                  priority
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-2 pt-6">
                  <span className="font-display text-sm text-white/90">{entry.domain}</span>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-between px-8">
                <span className="tape-reel h-14 w-14 shrink-0" aria-hidden="true" />
                <span className="flex-1 px-4 text-center font-display text-lg text-tape">
                  {entry.domain}
                </span>
                <span className="tape-reel h-14 w-14 shrink-0" aria-hidden="true" />
              </div>
            )}
          </div>
        </a>

        <div className="pt-5 text-center">
          <h2 className="font-display text-2xl text-paper sm:text-3xl">{entry.title}</h2>
          <p className="mt-2 text-sm text-paper-dim">{entry.desc}</p>
          <a
            href={`https://x.com/${entry.owner.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-2 inline-flex items-center gap-1 text-xs text-tape hover:underline"
          >
            {entry.owner}
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
