/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  displayNews,
  displaySingleNews,
  toggleDisikeNewsApi,
  toggleLikeNewsApi,
} from "../../feature/reducers/newsSlice";
import { AppDispatch, RootState } from "../../feature/store";
import { displayUsers } from "../../feature/reducers/userSlice";
import { displayComments } from "../../feature/reducers/commentSlice";
import {
  setPostIdPublic,
  setIsEditComponentActive,
  setIsSpinnerActive,
  setIsDeleteComponentActive,
} from "../../feature/reducers/appSlice";
import { NotificationService } from "../../services/notificationServices";
import ArticleView from "../article/ArticleView";
import CreateComment from "../comment/CreateComment";
import ShowComments from "../comment/ShowComments";
import NavLeft from "../nav/NavLeft";
import NavRight from "../nav/NavRight";

const SingleNews = () => {
  const { t } = useTranslation();
  const { newsId } = useSelector((state: RootState) => state.news);
  const singleNews = useSelector((state: RootState) => displaySingleNews(state, newsId || ""));
  const users = useSelector(displayUsers);
  const news = useSelector(displayNews);
  const comments = useSelector(displayComments);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  if (!singleNews) {
    return (
      <div className="py-16 flex flex-col items-start gap-4">
        <p className="text-lg muted">{t("article.notFound")}</p>
        <button type="button" className="btn" onClick={() => navigate("/news")}>{t("article.back")}</button>
      </div>
    );
  }

  const user = users.find((u) => u?._id === singleNews.user);
  const isAdmin = !!users.find((u) => u._id === userId)?.isAdmin;
  const popular = news.filter((n) => n.likes.length).sort((a, b) => b.likes.length - a.likes.length);

  const react = async (kind: "like" | "dislike") => {
    if (!userId) return NotificationService.error(t("access.loginToReact"));
    try {
      await dispatch(
        kind === "like"
          ? toggleLikeNewsApi({ postIdPublic: singleNews._id })
          : toggleDisikeNewsApi({ postIdPublic: singleNews._id })
      ).unwrap();
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  return (
    <ArticleView
      article={singleNews}
      author={user}
      liked={!!singleNews.likes.toLocaleString().includes(userId!)}
      disliked={!!singleNews.disLikes.toLocaleString().includes(userId!)}
      commentCount={comments.filter((c) => c?.post === singleNews._id).length}
      canEdit={isAdmin}
      onEdit={() => {
        dispatch(setPostIdPublic(singleNews._id));
        dispatch(setIsEditComponentActive(true));
        dispatch(setIsSpinnerActive(false));
      }}
      onDelete={() => {
        dispatch(setPostIdPublic(singleNews._id));
        dispatch(setIsDeleteComponentActive(true));
        dispatch(setIsSpinnerActive(false));
      }}
      onLike={() => react("like")}
      onDislike={() => react("dislike")}
      backTo="/news"
      comments={
        <section className="flex flex-col gap-6">
          <div className="section-head"><h3>{t("article.commentsTitle")}</h3></div>
          <CreateComment components="news" postIdPublic={singleNews._id} />
          <ShowComments components="news" postIdPublic={singleNews._id} />
        </section>
      }
      aside={
        <>
          <NavLeft component="news" user={user} post={popular.slice(0, 6) as any} />
          <NavRight component="news" user={user} post={news as any} />
        </>
      }
    />
  );
};

export default SingleNews;
