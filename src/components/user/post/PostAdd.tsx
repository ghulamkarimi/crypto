import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../feature/store";
import { displayUser } from "../../../feature/reducers/userSlice";
import { setIsPostComponentActive, setIsSpinnerActive } from "../../../feature/reducers/appSlice";

const PostAdd = () => {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => displayUser(state, userId!));

  return (
    <button
      type="button"
      className="w-full my-6 flex items-center gap-4 p-4 text-left rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--hover)]"
      onClick={() => {
        dispatch(setIsPostComponentActive(true));
        dispatch(setIsSpinnerActive(false));
      }}
    >
      <img className="w-11 h-11 rounded-full object-cover flex-none" src={user?.profile_photo} alt="" />
      <span className="muted">{t("profile.composer", { name: user?.firstName ?? "" })}</span>
    </button>
  );
};

export default PostAdd;
