import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MaxWithWrapper from "../MaxWithWrapper";
import Branding from "../navbar/branding/Branding";
import { OPEN_COOKIE_SETTINGS } from "./CookieNotice";

const Footer = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("footer.markets"),
      links: [
        { to: "/coin", label: t("nav.coins") },
        { to: "/news", label: t("nav.news") },
        { to: "/analyze", label: t("nav.analyze") },
      ],
    },
    {
      title: t("footer.tools"),
      links: [
        { to: "/journal", label: t("footer.journal") },
        { to: "/calc", label: t("footer.calculator") },
        { to: "/quiz", label: t("footer.quiz") },
      ],
    },
  ];

  return (
    <div className="mt-8 border-t border-[var(--line)]">
      <MaxWithWrapper className="pt-10 pb-10">
        <div className="flex flex-wrap justify-between gap-x-14 gap-y-10">
          <div className="flex flex-col gap-3 max-w-xs">
            <Branding />
            <p className="muted leading-6">{t("footer.tagline")}</p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {columns.map((col) => (
              <nav key={col.title} className="flex flex-col gap-2.5" aria-label={col.title}>
                <h4 className="text-xl">{col.title}</h4>
                {col.links.map((link) => (
                  <NavLink key={link.to} to={link.to} className="muted hover:text-PRIMARY_ORANGE">
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-[var(--line)] flex flex-wrap justify-between gap-2 text-sm muted">
          <span>{t("footer.rights")}</span>
          <span>{t("footer.disclaimer")}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm muted">
          <span>
            {t("footer.dataBy")}{" "}
            <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-PRIMARY_ORANGE">
              CoinGecko
            </a>
          </span>
          <span className="flex gap-5">
            <NavLink to="/imprint" className="hover:text-PRIMARY_ORANGE">{t("footer.imprint")}</NavLink>
            <NavLink to="/privacy" className="hover:text-PRIMARY_ORANGE">{t("footer.privacy")}</NavLink>
            <button type="button" className="hover:text-PRIMARY_ORANGE" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}>
              {t("cookies.settings")}
            </button>
          </span>
        </div>
        <p className="mt-3 text-center text-sm muted">{t("footer.powered")}</p>
      </MaxWithWrapper>
    </div>
  );
};

export default Footer;
