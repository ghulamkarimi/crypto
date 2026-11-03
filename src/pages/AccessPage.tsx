import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MaxWithWrapper from "../components/MaxWithWrapper";

// Wird statt eines geschützten Bereichs gezeigt, wenn niemand angemeldet ist, und erklärt den Grund.
const AccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const reason = pathname.startsWith("/journal") || pathname.startsWith("/positions")
    ? "journal"
    : pathname.startsWith("/calc")
    ? "calc"
    : pathname.startsWith("/quiz")
    ? "quiz"
    : pathname.startsWith("/profile") || pathname.startsWith("/edit-profile")
    ? "profile"
    : "generic";

  return (
    <MaxWithWrapper className="py-20 min-h-[70vh]">
      <div className="max-w-xl flex flex-col gap-5">
        <h1 className="text-5xl">{t("access.title")}</h1>
        <p className="text-lg leading-8 muted">{t(`access.${reason}`)}</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-2">
          <button type="button" className="btn btn-primary !px-6 !py-3" onClick={() => navigate("/auth")}>
            {t("access.login")}
          </button>
          <button type="button" className="underline underline-offset-[5px] hover:text-PRIMARY_ORANGE" onClick={() => navigate("/home")}>
            {t("access.home")}
          </button>
        </div>
      </div>
    </MaxWithWrapper>
  );
};

export const VerifyNotice = () => {
  const { t } = useTranslation();
  return (
    <MaxWithWrapper className="pt-10">
      <div className="max-w-xl flex flex-col gap-2">
        <h2 className="text-3xl">{t("access.verifyTitle")}</h2>
        <p className="muted leading-7">{t("access.verifyText")}</p>
      </div>
    </MaxWithWrapper>
  );
};

export default AccessPage;
