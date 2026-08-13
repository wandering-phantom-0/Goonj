"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const handleClick = () => {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending}
      className="chip flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity disabled:cursor-wait disabled:opacity-70"
      aria-label={t("switchLanguage")}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <Languages size={14} aria-hidden="true" />
      )}
      <span>{otherLocale.toUpperCase()}</span>
    </button>
  );
}
