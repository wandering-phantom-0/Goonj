import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return {
    title: t("title"),
    description: t("body1"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { hi: "/hi/about", en: "/en/about" },
    },
    openGraph: {
      title: t("title"),
      description: t("body1"),
      url: `/${locale}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("aboutPage");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-tape">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-3xl text-paper sm:text-4xl">{t("title")}</h1>
      <p className="mt-6 text-base leading-relaxed text-paper-dim">{t("body1")}</p>
      <p className="mt-4 text-base leading-relaxed text-paper-dim">{t("body2")}</p>
    </div>
  );
}
