import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CHOICE = "cookie-choice"; // "all" | "necessary"
const TV = "tv-consent";
export const OPEN_COOKIE_SETTINGS = "open-cookie-settings";

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

// Auswahl zu Cookies: Der Hinweis bleibt, bis du "Alle akzeptieren" oder "Nur notwendige" wählst.
const CookieNotice = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(() => read(CHOICE) === null);

  // Über den Footer-Link "Cookie-Einstellungen" erneut öffnen
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, show);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, show);
  }, []);

  if (!open) return null;

  const choose = (all: boolean) => {
    try {
      localStorage.setItem(CHOICE, all ? "all" : "necessary");
      if (all) localStorage.setItem(TV, "yes");
      else localStorage.removeItem(TV);
    } catch {
      /* ohne Speicher gilt die Auswahl nur bis zum Neuladen */
    }
    setOpen(false);
    // Chart-Bereich neu einlesen
    window.dispatchEvent(new Event("cookie-choice-changed"));
  };

  return (
    <div
      role="dialog"
      aria-label={t("cookies.title")}
      className="fixed z-40 left-4 right-4 bottom-4 sm:right-auto sm:max-w-md flex flex-col gap-3 p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-lg"
    >
      <h4 className="text-xl">{t("cookies.title")}</h4>
      <p className="text-sm leading-6">{t("cookies.text")}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary !py-1.5 !px-4 text-sm" onClick={() => choose(true)}>
          {t("cookies.all")}
        </button>
        <button type="button" className="btn !py-1.5 !px-4 text-sm" onClick={() => choose(false)}>
          {t("cookies.necessary")}
        </button>
        <Link to="/privacy" className="text-sm underline underline-offset-4 muted hover:text-PRIMARY_ORANGE">
          {t("cookies.more")}
        </Link>
      </div>
    </div>
  );
};

export default CookieNotice;
