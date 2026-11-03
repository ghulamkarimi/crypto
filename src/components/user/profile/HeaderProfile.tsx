import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../../feature/store";
import {
  displayUser,
  followUserApi,
  setFile,
  unFollowUserApi,
} from "../../../feature/reducers/userSlice";
import { Image } from "../../image/Image";
import { NotificationService } from "../../../services/notificationServices";
import { selectPostsByUser } from "../../../feature/reducers/postSlice";
import {
  setIsFollowComponentActive,
  setIsFollowersComponentActive,
} from "../../../feature/reducers/appSlice";

const HeaderProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams();
  const userLoginId = localStorage.getItem("userId");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const userPosts = useSelector((state: RootState) => selectPostsByUser(userId!)(state));
  const [image, setImage] = useState(false);
  const user = useSelector((state: RootState) => displayUser(state, userId!));

  const isOwn = userId === userLoginId;
  const isFollow = !!user?.followers?.find((f) => f === userLoginId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // dieselbe Datei darf erneut gewählt werden
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return NotificationService.error(t("profile.imgBadType"));
    if (picked.size > 8_000_000) return NotificationService.error(t("profile.imgTooBig"));
    dispatch(setFile(picked));
    setImage(true);
  };

  const toggleFollow = async () => {
    try {
      const action = isFollow ? unFollowUserApi : followUserApi;
      const response = await dispatch(action({ targetUserId: userId })).unwrap();
      NotificationService.success(response.message);
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  const stats = [
    { label: t("profile.posts"), value: userPosts?.length ?? 0, onClick: undefined as undefined | (() => void) },
    { label: t("profile.followers"), value: user?.followers?.length ?? 0, onClick: () => dispatch(setIsFollowersComponentActive(true)) },
    { label: t("profile.following"), value: user?.following?.length ?? 0, onClick: () => dispatch(setIsFollowComponentActive(true)) },
  ];

  return (
    <div className="py-10 border-b border-[var(--line)] flex flex-wrap items-start gap-x-10 gap-y-6">
      <div className="flex flex-col items-center gap-3 flex-none">
        <img className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover" src={user?.profile_photo} alt="" />
        {isOwn && (
          <>
            <button type="button" className="btn !py-1.5 !px-3 text-sm" onClick={() => inputRef.current?.click()}>
              {t("profile.changePhoto")}
            </button>
            <input name="file" type="file" hidden ref={inputRef} onChange={handleChange} />
          </>
        )}
      </div>

      <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-4xl sm:text-5xl leading-none break-words">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</h1>
            {isOwn && <p className="muted text-sm mt-2 break-all">{user?.email}</p>}
          </div>
          {isOwn ? (
            <button type="button" className="btn" onClick={() => navigate(`/edit-profile/${userId}`)}>
              {t("profile.settings")}
            </button>
          ) : (
            <button type="button" className={isFollow ? "btn" : "btn btn-primary"} onClick={toggleFollow}>
              {isFollow ? t("profile.unfollow") : t("profile.follow")}
            </button>
          )}
        </div>

        {user?.bio && <p className="max-w-[60ch] leading-7">{user.bio}</p>}

        <ul className="flex flex-wrap gap-x-10 gap-y-3 pt-2">
          {stats.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                disabled={!s.onClick}
                onClick={s.onClick}
                className={`flex items-baseline gap-2 text-left ${s.onClick ? "hover:text-PRIMARY_ORANGE" : "cursor-default"}`}
              >
                <span className="font-FONT_SALSA font-bold text-3xl tabular-nums">{s.value}</span>
                <span className="muted text-sm">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${image ? "flex" : "hidden"}`}>
        <Image image={image} setImage={setImage} />
      </div>
    </div>
  );
};

export default HeaderProfile;
