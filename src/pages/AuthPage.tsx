import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import MaxWithWrapper from "../components/MaxWithWrapper";
import { RootState } from "../feature/store";

const AuthPage = () => {
  const { t } = useTranslation();
  const { isLoginFormOpen } = useSelector((state: RootState) => state.users);

  return (
    <MaxWithWrapper>
      <div className="flex flex-wrap items-start justify-center gap-x-24 gap-y-12 py-16 md:py-24">
        <section className="flex-[1_1_320px] max-w-[460px] flex flex-col gap-5">
          <h1 className="text-[clamp(48px,6vw,72px)]">
            {isLoginFormOpen ? t("authPage.loginTitle") : t("authPage.registerTitle")}
          </h1>
          <p className="max-w-[40ch] text-lg leading-7 muted">
            {isLoginFormOpen ? t("authPage.loginText") : t("authPage.registerText")}
          </p>
          <ul className="flex flex-col gap-2 pt-2 muted">
            <li>{t("authPage.point1")}</li>
            <li>{t("authPage.point2")}</li>
            <li>{t("authPage.point3")}</li>
          </ul>
        </section>

        <section className="flex-[1_1_360px] max-w-[460px] w-full">
          {isLoginFormOpen ? <Login /> : <Register />}
        </section>
      </div>
    </MaxWithWrapper>
  );
};

export default AuthPage;
