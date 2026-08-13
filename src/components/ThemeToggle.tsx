"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      aria-label={t("switchTheme")}
    >
      {mounted ? (
        isDark ? (
          <Sun size={14} aria-hidden="true" />
        ) : (
          <Moon size={14} aria-hidden="true" />
        )
      ) : (
        <span className="block h-3.5 w-3.5" />
      )}
    </button>
  );
}
