/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../feature/store";
import {
  displayAnalyze,
  displayanalysis,
  toggleDisikeAnalyzeApi,
  toggleLikeAnalyzeApi,
} from "../../feature/reducers/analyzeSlice";
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

const Analyze = () => {
  const { t } = useTranslation();
  const { analyzeId } = useSelector((state: RootState) => state.analysis);
  const analyse = useSelector((state: RootState) => displayAnalyze(state, analyzeId));
  const analyses = useSelector(displayanalysis);
  const users = useSelector(displayUsers);
  const comments = useSelector(displayComments);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  if (!analyse) {
    return (
      <div className="py-16 flex flex-col items-start gap-4">
        <p className="text-lg muted">{t("article.notFound")}</p>
        <button type="button" className="btn" onClick={() => navigate("/analyze")}>{t("article.back")}</button>
      </div>
    );
  }

  const user = users.find((u) => u?._id === analyse.user);
  const viewer = users.find((u) => u._id === userId);
  const canEdit = !!viewer && (viewer.isAdmin || (viewer.canAnalyze && analyse.user === userId));
  const popular = analyses.filter((a) => a.likes.length).sort((a, b) => b.likes.length - a.likes.length);

  const react = async (kind: "like" | "dislike") => {
    if (!userId) return NotificationService.error(t("access.loginToReact"));
    try {
      await dispatch(
        kind === "like"
          ? toggleLikeAnalyzeApi({ postIdPublic: analyse._id })
          : toggleDisikeAnalyzeApi({ postIdPublic: analyse._id })
      ).unwrap();
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  return (
    <ArticleView
      article={analyse}
      author={user}
      liked={!!analyse.likes.toLocaleString().includes(userId!)}
      disliked={!!analyse.disLikes.toLocaleString().includes(userId!)}
      commentCount={comments.filter((c) => c?.post === analyse._id).length}
      canEdit={canEdit}
      onEdit={() => {
        dispatch(setPostIdPublic(analyse._id));
        dispatch(setIsEditComponentActive(true));
        dispatch(setIsSpinnerActive(false));
      }}
      onDelete={() => {
        dispatch(setPostIdPublic(analyse._id));
        dispatch(setIsDeleteComponentActive(true));
        dispatch(setIsSpinnerActive(false));
      }}
      onLike={() => react("like")}
      onDislike={() => react("dislike")}
      backTo="/analyze"
      comments={
        <section className="flex flex-col gap-6">
          <div className="section-head"><h3>{t("article.commentsTitle")}</h3></div>
          <CreateComment components="analyze" postIdPublic={analyse._id} />
          <ShowComments components="analyze" postIdPublic={analyse._id} />
        </section>
      }
      aside={
        <>
          <NavLeft component="analyze" user={user} post={popular.slice(0, 6) as any} />
          <NavRight component="analyze" user={user} post={analyses as any} />
        </>
      }
    />
  );
};

export default Analyze;
