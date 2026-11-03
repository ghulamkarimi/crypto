import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { displayUser } from "../../../feature/reducers/userSlice";
import { RootState } from "../../../feature/store";
import { useNavigate } from "react-router-dom";

const VerifyAccount = () => {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => displayUser(state, userId || ""));
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6 max-w-xl">
      <div className="section-head">
        <h2>{t("profile.verifyTitle")}</h2>
      </div>
      {user?.isAccountVerified ? (
        <p className="leading-7">{t("profile.verifiedText", { name: `${user.firstName} ${user.lastName}` })}</p>
      ) : (
        <>
          <p className="leading-7">{t("profile.verifyIntro")}</p>
          <div>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/authentication")}>
              {t("profile.verifySend")}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default VerifyAccount;
