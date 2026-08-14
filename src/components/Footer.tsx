import { useTranslations } from "next-intl";
import GithubIcon from "./GithubIcon";
import XIcon from "./XIcon";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-line pb-16 pt-12">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="font-display text-xl text-paper">{t("storyTitle")}</p>
        <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t("storyBody")}</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-paper-faint">
          {t("curated")}
        </p>
        <p className="mt-2 text-xs text-paper-faint">{t("sourceNote")}</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a
            href="https://github.com/wandering-phantom-0/Goonj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-tape hover:underline"
          >
            <GithubIcon size={13} />
            {tNav("viewOnGithub")}
          </a>
          <a
            href="https://x.com/wandering_phant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-tape hover:underline"
          >
            <XIcon size={13} />
            {tNav("followOnX")}
          </a>
        </div>
      </div>
    </footer>
  );
}
