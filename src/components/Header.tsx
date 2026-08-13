import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl text-paper">
          {t("site.shortName")}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-paper-dim sm:flex">
          <Link href="/" className="transition-colors hover:text-paper">
            {t("nav.home")}
          </Link>
          <Link href="/#directory" className="transition-colors hover:text-paper">
            {t("nav.categories")}
          </Link>
          <Link href="/submit" className="transition-colors hover:text-paper">
            {t("nav.submit")}
          </Link>
          <Link href="/about" className="transition-colors hover:text-paper">
            {t("nav.about")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
