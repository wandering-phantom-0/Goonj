import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations();

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-light.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover dark:hidden"
        />
        <Image
          src="/images/hero-dark.jpg"
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover dark:block"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 75% at 50% 42%, color-mix(in srgb, var(--color-ink) var(--hero-overlay), transparent) 0%, transparent 70%), linear-gradient(180deg, var(--color-ink) 0%, transparent 20%, transparent 65%, var(--color-ink) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-tape">
          {t("home.eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-paper [text-shadow:0_2px_16px_var(--color-ink)] sm:text-6xl">
          {t("site.shortName")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper-dim sm:text-lg">
          {t("site.tagline")}
        </p>
      </div>
    </header>
  );
}
