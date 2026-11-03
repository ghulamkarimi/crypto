import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow, parseISO } from "date-fns";
import { de as deLocale } from "date-fns/locale";
import { displayanalysis } from "../../feature/reducers/analyzeSlice";
import { displayNews } from "../../feature/reducers/newsSlice";
import { displayUsers } from "../../feature/reducers/userSlice";

const ago = (iso: string, lang: string) => {
  try {
    return formatDistanceToNow(parseISO(iso), {
      addSuffix: true,
      locale: lang.startsWith("de") ? deLocale : undefined,
    });
  } catch {
    return "";
  }
};

const HomeAnalysisNews = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const analysis = useSelector(displayanalysis);
  const users = useSelector(displayUsers);
  const news = useSelector(displayNews);

  const topAnalysis = analysis
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 4);
  const topNews = news
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 5);

  return (
    <div className="flex flex-wrap gap-x-[72px] gap-y-14 py-[72px]">
      <section className="flex-[999_1_520px] min-w-0" id="analysis">
        <div className="section-head">
          <h2>{t("home.analysisTitle")}</h2>
          <button className="text-[15px] muted hover:text-PRIMARY_ORANGE" onClick={() => navigate("/analyze")}>
            {t("home.allAnalysis")}
          </button>
        </div>
        {topAnalysis.length === 0 && <p className="py-6 muted">{t("home.empty")}</p>}
        {topAnalysis.map((a) => {
          const user = users.find((u) => u._id === a.user);
          return (
            <div key={a._id} className="row-line flex flex-wrap items-start gap-x-5 gap-y-3 py-[22px]">
              <div className="flex-[1_1_240px] min-w-0 flex flex-col gap-1.5">
                <button
                  className="text-left text-xl leading-7 font-semibold hover:text-PRIMARY_ORANGE"
                  onClick={() => navigate(`/analyze/${a._id}`)}
                >
                  {a.title}
                </button>
                <div className="flex flex-wrap gap-x-[18px] text-sm muted">
                  {user && <span>{user.firstName} {user.lastName}</span>}
                  <span>{ago(a.createdAt, i18n.language)}</span>
                </div>
              </div>
              <div className="flex gap-6 text-right">
                <div className="flex flex-col gap-0.5">
                  <span className="font-FONT_SALSA font-bold text-3xl leading-none tabular-nums">{a.likes?.length ?? 0}</span>
                  <span className="text-xs muted">{t("home.likes")}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-FONT_SALSA font-bold text-3xl leading-none tabular-nums muted">{a.disLikes?.length ?? 0}</span>
                  <span className="text-xs muted">{t("home.dislikes")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex-[1_1_320px] min-w-0" id="news">
        <div className="section-head">
          <h2>{t("nav.news")}</h2>
          <button className="text-[15px] muted hover:text-PRIMARY_ORANGE" onClick={() => navigate("/news")}>
            {t("home.allNews")}
          </button>
        </div>
        {topNews.length === 0 && <p className="py-6 muted">{t("home.empty")}</p>}
        {topNews.map((n) => (
          <div key={n._id} className="row-line flex flex-col gap-1.5 py-[18px]">
            <span className="text-[13px] muted">{ago(n.createdAt, i18n.language)}</span>
            <button
              className="text-left text-lg leading-[26px] font-medium hover:text-PRIMARY_ORANGE"
              onClick={() => navigate(`/news/${n._id}`)}
            >
              {n.title}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomeAnalysisNews;
