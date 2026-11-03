import { BiDislike, BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../../../feature/store";
import { displayUsers } from "../../../feature/reducers/userSlice";
import { IPost } from "../../../interface";
import ShowTime from "../../showTime/ShowTime";
import {
  setIsDeleteComponentActive,
  setIsEditComponentActive,
  setIsSpinnerActive,
  setPostIdPublic,
} from "../../../feature/reducers/appSlice";
import {
  incrementPostsViewsApi,
  setPostId,
  toggleDisikePostApi,
  toggleLikePostApi,
} from "../../../feature/reducers/postSlice";
import { NotificationService } from "../../../services/notificationServices";
import { displayComments } from "../../../feature/reducers/commentSlice";

interface IPostProps {
  posts: IPost[];
}

const TemplatePosts = ({ posts }: IPostProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId");
  const users = useSelector(displayUsers);
  const navigate = useNavigate();
  const comments = useSelector(displayComments);

  const react = async (kind: "like" | "dislike", id: string) => {
    try {
      const action = kind === "like" ? toggleLikePostApi : toggleDisikePostApi;
      await dispatch(action({ postIdPublic: id })).unwrap();
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  const openPost = async (id: string) => {
    await dispatch(incrementPostsViewsApi({ postIdPublic: id }));
    dispatch(setPostId(id));
    navigate(`/post/${id}`);
  };

  if (!posts.length) return <p className="muted py-10">{t("profile.noPosts")}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => {
        const user = users.find((u) => u._id === post.user);
        const liked = post.likes.toLocaleString().includes(userId!);
        const disliked = post.disLikes.toLocaleString().includes(userId!);
        const commentCount = comments.filter((c) => c.post === post?._id).length;
        const own = post.user === userId;
        return (
          <article key={post._id} className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4">
              <button type="button" className="flex items-center gap-3 min-w-0 text-left" onClick={() => navigate(`/profile/${post.user}`)}>
                <img className="w-10 h-10 rounded-full object-cover flex-none" src={user?.profile_photo} alt="" />
                <span className="min-w-0">
                  <span className="block font-medium truncate">{user?.firstName}</span>
                  <span className="block muted text-xs"><ShowTime timestamp={post?.updatedAt} /></span>
                </span>
              </button>
              {own && (
                <div className="flex gap-1 text-sm flex-none">
                  <button
                    type="button"
                    className="px-2 py-1 rounded hover:bg-[var(--hover)]"
                    onClick={() => {
                      dispatch(setPostIdPublic(post._id));
                      dispatch(setIsEditComponentActive(true));
                      dispatch(setIsSpinnerActive(false));
                    }}
                  >
                    {t("profile.edit")}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded hover:bg-[var(--hover)] text-SECONDARY_RED"
                    onClick={() => {
                      dispatch(setPostIdPublic(post._id));
                      dispatch(setIsDeleteComponentActive(true));
                      dispatch(setIsSpinnerActive(false));
                    }}
                  >
                    {t("profile.delete")}
                  </button>
                </div>
              )}
            </div>

            <button type="button" className="block aspect-[16/9] bg-[var(--hover)]" onClick={() => openPost(post._id)} aria-label={t("profile.openPost")}>
              <img className="w-full h-full object-cover" src={String(post?.image) || ""} alt="" />
            </button>

            <div className="flex flex-col gap-2 p-4 flex-1">
              <h3 className="text-2xl leading-tight line-clamp-2">{post?.title}</h3>
              <p className="muted text-sm leading-6 line-clamp-3">{post.description}</p>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--line)] text-sm">
              <div className="flex items-center gap-5">
                <button type="button" className={`flex items-center gap-1.5 ${liked ? "text-PRIMARY_BLUE" : "hover:text-PRIMARY_ORANGE"}`} onClick={() => react("like", post._id)} aria-label={t("profile.like")}>
                  <BiLike className="text-xl" /> {post.likes.length}
                </button>
                <button type="button" className={`flex items-center gap-1.5 ${disliked ? "text-SECONDARY_RED" : "hover:text-PRIMARY_ORANGE"}`} onClick={() => react("dislike", post._id)} aria-label={t("profile.dislike")}>
                  <BiDislike className="text-xl" /> {post.disLikes.length}
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-PRIMARY_ORANGE" onClick={() => navigate(`/post/${post?._id}`)} aria-label={t("profile.comments")}>
                  <FaRegComment className="text-lg" /> {commentCount}
                </button>
              </div>
              <span className="flex items-center gap-1.5 muted" title={t("profile.views")}>
                <IoEyeOutline className="text-lg" /> {post.numViews}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TemplatePosts;
