import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import CategoryChips from "@/components/CategoryChips";
import EntryCard from "@/components/EntryCard";
import JsonLd from "@/components/JsonLd";
import {
  getAllCategories,
  getCategoryBySlug,
  getCategoryLabel,
  getEntriesByCategory,
  getEntryDisplayName,
} from "@/lib/data";

export function generateStaticParams() {
  const categories = getAllCategories();
  return routing.locales.flatMap((locale) =>
    categories.map((c) => ({ locale, categorySlug: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  const t = await getTranslations({ locale, namespace: "category" });
  const label = getCategoryLabel(categorySlug, locale as Locale);
  const count = getEntriesByCategory(categorySlug).length;

  return {
    title: label,
    description: t("description", { category: label, count }),
    alternates: {
      canonical: `/${locale}/category/${categorySlug}`,
      languages: { hi: `/hi/category/${categorySlug}`, en: `/en/category/${categorySlug}` },
    },
    openGraph: {
      title: label,
      description: t("description", { category: label, count }),
      url: `/${locale}/category/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  setRequestLocale(locale);

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  return <CategoryContent categorySlug={categorySlug} />;
}

function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const t = useTranslations("category");
  const locale = useLocale() as Locale;
  const label = getCategoryLabel(categorySlug, locale);
  const entries = getEntriesByCategory(categorySlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: label,
    url: `${siteUrl}/${locale}/category/${categorySlug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("backToAll"), item: `${siteUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: label },
      ],
    },
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
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 2xl:max-w-7xl">
      <JsonLd data={jsonLd} />

      <Link href="/" className="text-sm text-tape hover:underline">
        &larr; {t("backToAll")}
      </Link>

      <h1 className="mt-3 font-display text-3xl text-paper sm:text-4xl">{label}</h1>
      <p className="mt-2 text-sm text-paper-dim">{t("description", { category: label, count: entries.length })}</p>

      <div className="mt-8">
        <CategoryChips activeSlug={categorySlug} />
      </div>

      {entries.length === 0 ? (
        <p className="py-16 text-center text-paper-dim">{t("empty")}</p>
      ) : (
        <section className="grid grid-cols-1 gap-x-6 gap-y-10 py-14 sm:grid-cols-2 sm:gap-y-14 sm:pb-28 lg:grid-cols-3 lg:gap-x-8 2xl:grid-cols-4">
          {entries.map((entry) => (
            <EntryCard key={entry.slug} entry={entry} />
          ))}
        </section>
      )}
    </div>
  );
}
