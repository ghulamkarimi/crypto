/* eslint-disable @typescript-eslint/no-explicit-any */
import { CiHeart } from "react-icons/ci";
import { GoBook } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../feature/store";
import {
  displayNews,
  incrementNewsViewsApi,
  setNewsId,
  toggleDisikeNewsApi,
  toggleLikeNewsApi,
} from "../../feature/reducers/newsSlice";
import { displayUsers } from "../../feature/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {
  setIsDeleteComponentActive,
  setIsEditComponentActive,
  setIsSpinnerActive,
  setPostIdPublic,
} from "../../feature/reducers/appSlice";
import { IoEyeOutline, IoHeartDislikeOutline } from "react-icons/io5";
import ShowTime from "../showTime/ShowTime";
import { NotificationService } from "../../services/notificationServices";
import { useTranslation } from "react-i18next";
import { authorName } from "../../utils/author";
import { displayComments } from "../../feature/reducers/commentSlice";

const News = () => {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const news = useSelector(displayNews);
  const users = useSelector(displayUsers);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const comments = useSelector(displayComments);
  const isAdmin = !!users.find((u) => u._id === userId)?.isAdmin;

  const toggle = async (e: React.MouseEvent, kind: "like" | "dislike", id: string) => {
    e.stopPropagation();
    if (!userId) return NotificationService.error(t("access.loginToReact"));
    try {
      await dispatch(
        kind === "like"
          ? toggleLikeNewsApi({ postIdPublic: id })
          : toggleDisikeNewsApi({ postIdPublic: id })
      ).unwrap();
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  return (
    <div className="flex flex-col">
      {news.map((item) => {
        const user = users.find((u) => u._id === item.user);
        const isLiked = item.likes.toLocaleString().includes(userId!);
        const isDisliked = item.disLikes.toLocaleString().includes(userId!);
        const commentCount = comments.filter((c) => c?.post === item._id).length;
        return (
          <article
            key={item._id}
            className="row-line flex flex-wrap sm:flex-nowrap gap-x-6 gap-y-3 py-6 cursor-pointer group"
            onClick={async () => {
              try {
                await dispatch(incrementNewsViewsApi({ postIdPublic: item._id }));
                dispatch(setNewsId(item._id));
                navigate(`/news/${item._id}`);
              } catch (error: any) {
                NotificationService.error(error.message);
              }
            }}
          >
            <img
              className="w-full sm:w-52 h-36 object-cover rounded-lg flex-none"
              src={String(item.image)}
              alt=""
            />

            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-sm muted">
                <div className="flex items-center gap-2 min-w-0">
                  <img className="w-6 h-6 rounded-full object-cover" src={user?.profile_photo} alt="" />
                  <span className="truncate">{authorName(user)}</span>
                  <span>·</span>
                  <ShowTime timestamp={item?.createdAt} />
                </div>
                {isAdmin && (
                <div className="flex items-center gap-3 text-xl">
                  <button
                    type="button"
                    aria-label={t("common.edit")}
                    className="hover:text-PRIMARY_ORANGE"
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(setPostIdPublic(item._id));
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
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(setPostIdPublic(item._id));
                      dispatch(setIsDeleteComponentActive(true));
                      dispatch(setIsSpinnerActive(false));
                    }}
                  >
                    <IoMdClose />
                  </button>
                </div>
                )}
              </div>

              <h2 className="text-3xl group-hover:text-PRIMARY_ORANGE line-clamp-2">{item.title}</h2>
              <p className="muted line-clamp-2 leading-6">{item.description}</p>

              <div className="flex items-center gap-5 text-sm pt-1 tabular-nums">
                <button type="button" className="flex items-center gap-1.5 hover:text-PRIMARY_ORANGE" onClick={(e) => toggle(e, "like", item._id)}>
                  <CiHeart className={`text-xl ${isLiked ? "text-PRIMARY_ORANGE" : ""}`} />
                  {item?.likes?.length}
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-PRIMARY_ORANGE" onClick={(e) => toggle(e, "dislike", item._id)}>
                  <IoHeartDislikeOutline className={`text-lg ${isDisliked ? "text-SECONDARY_RED" : ""}`} />
                  {item?.disLikes?.length}
                </button>
                <span className="flex items-center gap-1.5 muted"><GoBook className="text-lg" />{commentCount}</span>
                <span className="flex items-center gap-1.5 muted"><IoEyeOutline className="text-lg" />{item.numViews}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default News;
