import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "submitPage" });

  return {
    title: t("title"),
    description: t("body"),
    alternates: {
      canonical: `/${locale}/submit`,
      languages: { hi: "/hi/submit", en: "/en/submit" },
    },
    openGraph: {
      title: t("title"),
      description: t("body"),
      url: `/${locale}/submit`,
    },
  };
}

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SubmitContent />;
}

function SubmitContent() {
  const t = useTranslations("submitPage");
  const steps = t.raw("steps") as string[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-tape">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-3xl text-paper sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-base leading-relaxed text-paper-dim">{t("body")}</p>

      <ol className="mt-8 space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tape text-sm font-medium text-ink">
              {i + 1}
            </span>
            <span className="pt-0.5 text-paper-dim">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
