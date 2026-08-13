import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations();

  return (
    <header className="relative overflow-hidden border-b border-line/60">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 50% -5%, var(--color-tape-soft), transparent), linear-gradient(180deg, var(--color-ink-2) 0%, var(--color-ink) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-tape">
          {t("home.eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-paper sm:text-6xl">
          {t("site.shortName")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper-dim sm:text-lg">
          {t("site.tagline")}
        </p>
      </div>
    </header>
  );
}
