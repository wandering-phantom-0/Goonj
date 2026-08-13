import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus, Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Hero from "@/components/Hero";
import FeaturedEntry from "@/components/FeaturedEntry";
import CategoryChips from "@/components/CategoryChips";
import EntryCard from "@/components/EntryCard";
import JsonLd from "@/components/JsonLd";
import { getFeaturedEntry, getGridEntries, getEntryDisplayName } from "@/lib/data";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { hi: "/hi", en: "/en" },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const featured = getFeaturedEntry();
  const entries = getGridEntries();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("site.name"),
    description: t("site.description"),
    url: `${siteUrl}/${locale}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: entries.map((entry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/${locale}/playlist/${entry.slug}`,
        name: getEntryDisplayName(entry),
      })),
    },
  };

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <Hero />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 2xl:max-w-7xl">
        {featured && <FeaturedEntry entry={featured} />}

        <section id="directory" className="scroll-mt-24 pb-10">
          <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
            <Radio size={16} className="text-tape" aria-hidden="true" />
            <h2 className="font-display text-xl text-paper sm:text-2xl">
              {t("home.gridTitle")}
            </h2>
            <span className="text-xs text-paper-dim">
              {t("home.countLabel", { count: entries.length, total: entries.length })}
            </span>
            <Link
              href="/submit"
              className="chip ml-auto flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm"
              style={{ borderColor: "var(--color-tape)", color: "var(--color-tape)" }}
            >
              <Plus size={14} aria-hidden="true" />
              {t("home.submitCta")}
              <span className="ml-0.5 text-[11px] opacity-70">{t("home.submitCtaSub")}</span>
            </Link>
          </div>

          <CategoryChips activeSlug={null} />
        </section>

        <section className="grid grid-cols-1 gap-x-6 gap-y-10 pb-20 sm:grid-cols-2 sm:gap-y-14 sm:pb-28 lg:grid-cols-3 lg:gap-x-8 2xl:grid-cols-4">
          {entries.map((entry) => (
            <EntryCard key={entry.slug} entry={entry} />
          ))}
        </section>
      </div>
    </div>
  );
}
