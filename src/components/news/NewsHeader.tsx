import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { displayNews } from "../../feature/reducers/newsSlice";

const NewsHeader = () => {
  const { t } = useTranslation();
  const news = useSelector(displayNews);
  return (
    <div className="pt-6 pb-8 flex flex-col gap-3">
      <h1 className="text-[clamp(44px,6vw,64px)]">{t("newsPage.title")}</h1>
      <p className="max-w-[60ch] text-lg leading-7 muted">{t("newsPage.intro")}</p>
      <p className="text-sm muted">{t("newsPage.count", { count: news.length })}</p>
    </div>
  );
};

export default NewsHeader;
