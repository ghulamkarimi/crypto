import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../feature/store";
import { useNavigate } from "react-router-dom";
import { displayUser } from "../../../feature/reducers/userSlice";

const ExamRequest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => displayUser(state, userId!));

  return (
    <section className="flex flex-col gap-6 max-w-xl">
      <div className="section-head">
        <h2>{t("profile.examTitle")}</h2>
      </div>
      {user?.canAnalyze ? (
        <p className="leading-7">{t("profile.examPassed", { name: `${user.firstName} ${user.lastName}` })}</p>
      ) : (
        <>
          <p className="leading-7">{t("profile.examIntro")}</p>
          <div>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/quiz")}>
              {t("profile.examStart")}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ExamRequest;
