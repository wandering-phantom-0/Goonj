import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import EntryCard from "@/components/EntryCard";
import JsonLd from "@/components/JsonLd";
import {
  getAllEntries,
  getCategoryLabel,
  getEntryBySlug,
  getEntryDisplayName,
  getSimilarEntries,
} from "@/lib/data";

export function generateStaticParams() {
  const entries = getAllEntries();
  return routing.locales.flatMap((locale) =>
    entries.map((e) => ({ locale, slug: e.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};

  const name = entry.title_en ?? entry.title;
  const categoryLabel = getCategoryLabel(entry.category, locale as Locale);
  const description = `${entry.desc}${categoryLabel ? ` - ${categoryLabel}` : ""}. ${entry.owner}`;

  return {
    title: name,
    description,
    alternates: {
      canonical: `/${locale}/playlist/${slug}`,
      languages: { hi: `/hi/playlist/${slug}`, en: `/en/playlist/${slug}` },
    },
    openGraph: {
      title: name,
      description,
      url: `/${locale}/playlist/${slug}`,
      type: "article",
      images: entry.image
        ? [{ url: entry.image, width: 800, height: 450, alt: `${name} website screenshot` }]
        : undefined,
    },
  };
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  return <PlaylistContent slug={slug} />;
}

function PlaylistContent({ slug }: { slug: string }) {
  const t = useTranslations("playlist");
  const tCard = useTranslations("card");
  const locale = useLocale() as Locale;
  const entry = getEntryBySlug(slug)!;
  const name = getEntryDisplayName(entry);
  const categoryLabel = getCategoryLabel(entry.category, locale);
  const similar = getSimilarEntries(entry, 4);
  const isOffline = entry.status === "offline";
  const showImage = !isOffline && Boolean(entry.image);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description: entry.desc,
    url: entry.url,
    image: entry.image ? `${siteUrl}${entry.image}` : undefined,
    genre: categoryLabel || undefined,
    creator: { "@type": "Person", name: entry.owner.replace("@", "") },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
        ...(entry.category
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: categoryLabel,
                item: `${siteUrl}/${locale}/category/${entry.category}`,
              },
            ]
          : []),
        { "@type": "ListItem", position: entry.category ? 3 : 2, name },
      ],
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <JsonLd data={jsonLd} />

      <nav className="flex flex-wrap items-center gap-2 text-sm text-paper-dim">
        <Link href="/" className="text-tape hover:underline">
          {t("backLink")}
        </Link>
        {entry.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/category/${entry.category}`} className="text-tape hover:underline">
              {categoryLabel}
            </Link>
          </>
        )}
      </nav>

      <div className="tape-card mt-6 p-6">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-ink-3">
          {showImage ? (
            <>
              <Image
                src={entry.image as string}
                alt={`${name} website screenshot`}
                fill
                sizes="(min-width: 640px) 48rem, 90vw"
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-2 pt-6">
                <span className="font-display text-sm text-white/90">{entry.domain}</span>
              </div>
            </>
          ) : (
            <div
              className={`flex h-full items-center justify-between px-8 ${
                isOffline ? "no-signal-stripes" : ""
              }`}
            >
              <span className="tape-reel h-12 w-12 shrink-0" aria-hidden="true" />
              <span className="flex-1 px-4 text-center font-display text-lg text-tape">
                {isOffline ? tCard("offlineShort") : entry.domain}
              </span>
              <span className="tape-reel h-12 w-12 shrink-0" aria-hidden="true" />
            </div>
          )}
        </div>

        <h1 className="mt-6 font-display text-3xl text-paper sm:text-4xl">{name}</h1>
        <p className="mt-3 text-base leading-relaxed text-paper-dim">{entry.desc}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-3">
          {entry.category && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-paper-faint">
                {t("categoryLabel")}
              </dt>
              <dd className="mt-1 text-paper">{categoryLabel}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-paper-faint">
              {t("submittedByLabel")}
            </dt>
            <dd className="mt-1">
              <a
                href={`https://x.com/${entry.owner.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-tape hover:underline"
              >
                {entry.owner}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-paper-faint">
              {t("statusLabel")}
            </dt>
            <dd className="mt-1 text-paper">
              {isOffline ? t("statusOffline") : t("statusLive")}
            </dd>
          </div>
        </dl>

        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-tape px-5 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
        >
          {t("visitSite")}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl text-paper">{t("similarTitle")}</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
            {similar.map((s) => (
              <EntryCard key={s.slug} entry={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
