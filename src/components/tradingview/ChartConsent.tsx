import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TradingViewWidget from "./TradingView";

const KEY = "tv-consent";

const readConsent = () => {
  try {
    return localStorage.getItem(KEY) === "yes";
  } catch {
    return false;
  }
};

// Lädt den TradingView-Chart erst nach ausdrücklicher Zustimmung (IP-Übertragung an Dritte).
const ChartConsent = () => {
  const { t } = useTranslation();
  const [ok, setOk] = useState(readConsent);

  // Auswahl im Cookie-Hinweis übernehmen
  useEffect(() => {
    const sync = () => setOk(readConsent());
    window.addEventListener("cookie-choice-changed", sync);
    return () => window.removeEventListener("cookie-choice-changed", sync);
  }, []);

  const set = (value: boolean) => {
    try {
      if (value) localStorage.setItem(KEY, "yes");
      else localStorage.removeItem(KEY);
    } catch {
      /* Speicher nicht verfügbar: Auswahl gilt nur für diese Sitzung */
    }
    setOk(value);
    if (!value) window.location.reload(); // bereits geladenes Skript entfernen
  };

  if (!ok) {
    return (
      <div className="flex flex-col items-start gap-4 p-6 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <h3>{t("chartConsent.title")}</h3>
        <p className="muted leading-7 max-w-[60ch]">{t("chartConsent.text")}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button type="button" className="btn btn-primary" onClick={() => set(true)}>
            {t("chartConsent.load")}
          </button>
          <Link to="/privacy" className="underline underline-offset-4 muted hover:text-PRIMARY_ORANGE">
            {t("chartConsent.privacy")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TradingViewWidget />
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm muted">
        <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-PRIMARY_ORANGE">
          {t("chartConsent.credit")}
        </a>
        <button type="button" className="underline underline-offset-4 hover:text-PRIMARY_ORANGE" onClick={() => set(false)}>
          {t("chartConsent.revoke")}
        </button>
      </div>
    </div>
  );
};

export default ChartConsent;
