import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl text-paper">{t("title")}</h1>
      <p className="mt-3 text-paper-dim">{t("body")}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-tape px-5 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
