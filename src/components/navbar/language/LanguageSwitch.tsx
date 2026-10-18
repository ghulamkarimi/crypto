import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.language.startsWith("de") ? "de" : "en";
  return (
    <div className="flex items-center text-xs min-[400px]:text-sm font-FONT_VIGA" role="group" aria-label={t("lang.label")}>
      {(["de", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => i18n.changeLanguage(l)}
          aria-pressed={current === l}
          className={`px-1 min-[400px]:px-1.5 py-0.5 rounded uppercase ${current === l ? "font-bold underline" : "opacity-60 hover:opacity-100"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
export default LanguageSwitch;
