import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../../feature/store";
import { displayUsers, followUserApi, unFollowUserApi } from "../../../feature/reducers/userSlice";
import { setIsFollowComponentActive, setIsFollowersComponentActive } from "../../../feature/reducers/appSlice";
import { NotificationService } from "../../../services/notificationServices";

interface IFollowListProps {
  mode: "followers" | "following";
}

const FollowList = ({ mode }: IFollowListProps) => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => displayUsers(state));
  const loginId = localStorage.getItem("userId");

  const profile = users.find((u) => u._id === userId);
  const viewer = users.find((u) => u._id === loginId);
  const ids: string[] = ((mode === "followers" ? profile?.followers : profile?.following) ?? []) as string[];
  const list = users.filter((u) => ids.includes(u._id as string));

  const close = () =>
    dispatch(mode === "followers" ? setIsFollowersComponentActive(false) : setIsFollowComponentActive(false));

  const toggle = async (id: string, isFollowing: boolean) => {
    try {
      const action = isFollowing ? unFollowUserApi : followUserApi;
      const response = await dispatch(action({ targetUserId: id })).unwrap();
      NotificationService.success(response.message);
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={t(mode === "followers" ? "profile.followers" : "profile.following")}
      onClick={close}
    >
      <div
        className="w-full max-w-md max-h-[80vh] flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-head !mb-0 px-5 py-4">
          <h3>{t(mode === "followers" ? "profile.followers" : "profile.following")}</h3>
          <button type="button" onClick={close} className="text-sm muted hover:text-PRIMARY_ORANGE">
            {t("profile.close")}
          </button>
        </div>
        <ul className="overflow-y-auto px-5 pb-3">
          {list.length === 0 && (
            <li className="muted text-sm py-6">{t(mode === "followers" ? "profile.noFollowers" : "profile.noFollowing")}</li>
          )}
          {list.map((u) => {
            const isFollowing = !!viewer?.following?.includes(u._id as never);
            return (
              <li key={u._id} className="row-line flex items-center justify-between gap-3 py-3">
                <button
                  type="button"
                  className="flex items-center gap-3 min-w-0 text-left hover:text-PRIMARY_ORANGE"
                  onClick={() => {
                    navigate(`/profile/${u._id}`);
                    close();
                  }}
                >
                  <img className="w-10 h-10 rounded-full object-cover flex-none" src={u.profile_photo} alt="" />
                  <span className="truncate">{u.firstName} {u.lastName}</span>
                </button>
                {u._id !== loginId && (
                  <button
                    type="button"
                    className={isFollowing ? "btn !px-3 !py-1 text-sm" : "btn btn-primary !px-3 !py-1 text-sm"}
                    onClick={() => toggle(u._id as string, isFollowing)}
                  >
                    {isFollowing ? t("profile.unfollow") : t("profile.follow")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FollowList;
