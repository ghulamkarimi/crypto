import MaxWithWrapper from "../components/MaxWithWrapper";
import { useSelector } from "react-redux";
import { RootState } from "../feature/store";
import JournalHome from "../components/journal/JournalHome";
import Coins from "../components/coins/Coins";
import { useNavigate } from "react-router-dom";
import { displayNews } from "../feature/reducers/newsSlice";
import { useTranslation } from "react-i18next";
import MarketBoard from "../components/home/MarketBoard";
import HomeAnalysisNews from "../components/home/HomeAnalysisNews";

const HomePage = () => {
  const { isDarkMode, inputValueSearchBox } = useSelector(
    (state: RootState) => state.app
  );
  const news = useSelector(displayNews);
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <MaxWithWrapper>
      <div>
        <ul
          className={`z-50 ${
            isDarkMode ? " bg-SECONDARY_BLACK" : "bg-SECONDARY_WHITE"
          } ${
            inputValueSearchBox != ""
              ? " sticky  inset-0   h-fit rounded-lg "
              : "hidden"
          }`}
        >
          {news
            .filter(
              (news) =>
                news?.title
                  .toLowerCase()
                  .includes(inputValueSearchBox.toLowerCase()) ||
                news?.description
                  .toLowerCase()
                  .includes(inputValueSearchBox.toLowerCase())
            )
            .map((news) => (
              <li
                key={news?._id}
                className="py-2 px-5 border-b last:border-b-0 cursor-pointer hover:bg-PRIMARY_BLUE text-SECONDARY_GRAY  hover:text-BLACK transition-all duration-200"
                onClick={() => {
                  navigate(`/news/${news?._id}`);
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    className=" rounded-lg"
                    width={40}
                    height={40}
                    src={String(news?.image)}
                    alt={news?.title}
                  />

                  <span className="flex gap-4 font-FONT_VIGA font-bold 
                   ">
                    <p>{`(${news?.title})`}</p>
                    {/* <p>{news?.current_price} $</p> */}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
      {/* Hero + Marktanzeige */}
      <section className="flex flex-wrap items-center gap-x-14 gap-y-12 pt-14 pb-20">
        <div className="flex-[1_1_340px] min-w-0 flex flex-col gap-6">
          <h1 className="text-[clamp(52px,7vw,96px)]">{t("home.heroTitle")}</h1>
          <p className="max-w-[60ch] text-lg leading-7 muted">{t("home.heroText")}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-2">
            <button
              className="btn btn-primary !px-6 !py-3.5"
              onClick={() => navigate(localStorage.getItem("userId") ? "/journal" : "/auth")}
            >
              {localStorage.getItem("userId") ? t("home.openJournal") : t("home.createAccount")}
            </button>
            <button
              className="underline underline-offset-[5px] hover:text-PRIMARY_ORANGE"
              onClick={() => navigate("/analyze")}
            >
              {t("home.seeAnalysis")}
            </button>
          </div>
        </div>
        <div className="flex-[0_1_780px] min-w-0 w-full">
          <MarketBoard />
        </div>
      </section>

      {/* Marktübersicht (Tabelle) */}
      <section className="border-t border-[var(--line)] py-14">
        <Coins hasPagination={false} />
      </section>

      <div className="border-t border-[var(--line)]">
        <HomeAnalysisNews />
      </div>

      <div className="border-t border-[var(--line)] py-20">
        <JournalHome />
      </div>

      <section id="tools" className="border-t border-[var(--line)] py-[72px] flex flex-wrap gap-x-14 gap-y-10">
        <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-3">
          <h3>{t("home.quizTitle")}</h3>
          <p className="max-w-[44ch] muted">{t("home.quizText")}</p>
          <button className="self-start underline underline-offset-[5px] hover:text-PRIMARY_ORANGE" onClick={() => navigate("/quiz")}>
            {t("home.quizCta")}
          </button>
        </div>
        <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-3">
          <h3>{t("home.calcTitle")}</h3>
          <p className="max-w-[44ch] muted">{t("home.calcText")}</p>
          <button className="self-start underline underline-offset-[5px] hover:text-PRIMARY_ORANGE" onClick={() => navigate("/calc")}>
            {t("home.calcCta")}
          </button>
        </div>
      </section>
    </MaxWithWrapper>
  );
};

export default HomePage;
