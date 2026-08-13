import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line pb-16 pt-12">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="font-display text-xl text-paper">{t("storyTitle")}</p>
        <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t("storyBody")}</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-paper-faint">
          {t("curated")}
        </p>
        <p className="mt-2 text-xs text-paper-faint">{t("sourceNote")}</p>
      </div>
    </footer>
  );
}
