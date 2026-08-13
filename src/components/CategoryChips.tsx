import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllCategories } from "@/lib/data";
import type { Locale } from "@/i18n/routing";

export default function CategoryChips({ activeSlug }: { activeSlug: string | null }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");
  const categories = getAllCategories();

  return (
    <div className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
      <Link
        href="/"
        data-active={!activeSlug}
        className="chip shrink-0 rounded-full px-4 py-1.5 text-sm"
      >
        {t("allCategory")}
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          data-active={activeSlug === c.slug}
          className="chip shrink-0 rounded-full px-4 py-1.5 text-sm"
        >
          {locale === "hi" ? c.hi : c.en}
        </Link>
      ))}
    </div>
  );
}
