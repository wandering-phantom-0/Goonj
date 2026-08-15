import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Hind, Yatra_One } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

const yatra = Yatra_One({
  subsets: ["latin", "devanagari"],
  weight: "400",
  variable: "--font-yatra",
  display: "swap",
});

const hind = Hind({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-hind",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("name"),
      template: `%s - ${t("shortName")}`,
    },
    description: t("description"),
    alternates: {
      languages: { hi: "/hi", en: "/en" },
    },
    verification: {
      google: "Ab8kt-9IGTQQ3sggjFVs6_0mCezHV0KwrpSRO5Go_cA",
    },
    openGraph: {
      siteName: t("name"),
      title: t("name"),
      description: t("description"),
      url: `${siteUrl}/${locale}`,
      locale: locale === "hi" ? "hi_IN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@wandering_phant",
      creator: "@wandering_phant",
      title: t("name"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${yatra.variable} ${hind.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink font-body text-paper antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="grain-overlay" aria-hidden="true" />
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
