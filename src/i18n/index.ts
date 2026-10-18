import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";

const saved = (() => {
  try { return localStorage.getItem("lang"); } catch { return null; }
})();
const initial =
  saved === "de" || saved === "en"
    ? saved
    : navigator.language?.toLowerCase().startsWith("de") ? "de" : "en";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, de: { translation: de } },
  lng: initial,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  try { localStorage.setItem("lang", lng); } catch { /* ignore */ }
});
document.documentElement.lang = initial;

export default i18n;
