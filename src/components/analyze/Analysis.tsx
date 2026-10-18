/* eslint-disable @typescript-eslint/no-explicit-any */
import { BiCommentDetail } from "react-icons/bi";
import { RiFireLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoEyeOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../../feature/store";
import {
  setIsDeleteComponentActive,
  setIsEditComponentActive,
  setIsPostComponentActive,
  setIsSpinnerActive,
  setPostIdPublic,
} from "../../feature/reducers/appSlice";
import {
  displayanalysis,
  incrementAnalyzeViewsApi,
  toggleDisikeAnalyzeApi,
  toggleLikeAnalyzeApi,
} from "../../feature/reducers/analyzeSlice";
import { displayUsers } from "../../feature/reducers/userSlice";
import { displayComments } from "../../feature/reducers/commentSlice";
import ShowTime from "../showTime/ShowTime";
import { NotificationService } from "../../services/notificationServices";
import { authorName } from "../../utils/author";

const Analysis = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const users = useSelector(displayUsers);
  const analyses = useSelector(displayanalysis);
  const comments = useSelector(displayComments);

  const viewer = users.find((u) => u._id === userId);
  const canPublish = !!viewer?.canAnalyze;

  const react = async (kind: "like" | "dislike", id: string) => {
    if (!userId) return NotificationService.error(t("access.loginToReact"));
    try {
      await dispatch(
        kind === "like"
          ? toggleLikeAnalyzeApi({ postIdPublic: id })
          : toggleDisikeAnalyzeApi({ postIdPublic: id })
      ).unwrap();
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  const open = async (id: string) => {
    await dispatch(incrementAnalyzeViewsApi({ postIdPublic: id }));
    navigate(`/analyze/${id}`);
  };

  return (
    <section className="flex flex-col gap-8 py-6">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h1 className="text-[clamp(36px,5vw,56px)] max-w-[22ch]">{t("analysisPage.title")}</h1>
        {canPublish && (
          <button type="button" className="btn btn-primary" onClick={() => dispatch(setIsPostComponentActive(true))}>
            + {t("analysisPage.new")}
          </button>
        )}
      </div>

      {/* Hinweis, warum "Neue Analyse" fehlt */}
      {!canPublish && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
          <p className="muted max-w-[60ch]">{userId ? t("analysisPage.noRight") : t("analysisPage.loginFirst")}</p>
          <button type="button" className="btn" onClick={() => navigate(userId ? "/quiz" : "/auth")}>
            {userId ? t("analysisPage.toExam") : t("analysisPage.toLogin")}
          </button>
        </div>
      )}

      {analyses.length === 0 && <p className="muted">{t("analysisPage.empty")}</p>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {analyses.map((analyze) => {
          const user = users.find((u) => u._id === analyze.user);
          const liked = analyze.likes.toLocaleString().includes(userId!);
          const disliked = analyze.disLikes.toLocaleString().includes(userId!);
          const commentCount = comments.filter((c) => c?.post === analyze?._id).length;
          // Bearbeiten und Löschen: nur eigene Analysen (mit Berechtigung) oder Admin
          const canEdit = !!viewer && (viewer.isAdmin || (viewer.canAnalyze && analyze.user === userId));
          return (
            <article key={analyze._id} className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
              <div className="flex items-center justify-between gap-3 p-4">
                <button type="button" className="flex items-center gap-3 min-w-0 text-left hover:text-PRIMARY_ORANGE" onClick={() => navigate(`/profile/${user?._id}`)}>
                  <img src={user?.profile_photo} className="w-8 h-8 rounded-full object-cover flex-none" alt="" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{authorName(user)}</span>
                    <span className="block text-xs muted"><ShowTime timestamp={analyze?.createdAt} /></span>
                  </span>
                </button>
                {canEdit && (
                  <div className="flex items-center gap-2 text-xl flex-none">
                    <button
                      type="button"
                      aria-label={t("common.edit")}
                      className="hover:text-PRIMARY_ORANGE"
                      onClick={() => {
                        dispatch(setPostIdPublic(analyze._id));
                        dispatch(setIsEditComponentActive(true));
                        dispatch(setIsSpinnerActive(false));
                      }}
                    >
                      <CiEdit />
                    </button>
                    <button
                      type="button"
                      aria-label={t("common.delete")}
                      className="hover:text-SECONDARY_RED"
                      onClick={() => {
                        dispatch(setPostIdPublic(analyze._id));
                        dispatch(setIsDeleteComponentActive(true));
                        dispatch(setIsSpinnerActive(false));
                      }}
                    >
                      <IoMdClose />
                    </button>
                  </div>
                )}
              </div>

              <button type="button" className="block aspect-[16/9] bg-[var(--hover)]" onClick={() => open(analyze._id)} aria-label={analyze?.title}>
                <img className="w-full h-full object-cover" src={String(analyze?.image)} alt="" />
              </button>

              <div className="flex flex-col gap-2 p-4 flex-1">
                <h3 className="text-2xl leading-tight line-clamp-2">{analyze?.title}</h3>
                <p className="muted text-sm leading-6 line-clamp-3">{analyze?.description}</p>
              </div>

              <div className="flex items-center gap-5 px-4 py-3 border-t border-[var(--line)] text-sm tabular-nums">
                <button type="button" className={`flex items-center gap-1.5 ${liked ? "text-PRIMARY_ORANGE" : "hover:text-PRIMARY_ORANGE"}`} onClick={() => react("like", analyze._id)}>
                  <RiFireLine className="text-xl" /> {analyze?.likes.length}
                </button>
                <button type="button" className={`flex items-center gap-1.5 ${disliked ? "text-SECONDARY_RED" : "hover:text-PRIMARY_ORANGE"}`} onClick={() => react("dislike", analyze._id)}>
                  <IoHeartDislikeOutline className="text-xl" /> {analyze?.disLikes.length}
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-PRIMARY_ORANGE" onClick={() => navigate(`/analyze/${analyze._id}`)}>
                  <BiCommentDetail className="text-xl" /> {commentCount}
                </button>
                <span className="flex items-center gap-1.5 muted ml-auto">
                  <IoEyeOutline className="text-xl" /> {analyze?.numViews}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Analysis;
