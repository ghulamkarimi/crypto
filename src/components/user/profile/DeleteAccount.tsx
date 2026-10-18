import { AppDispatch, RootState } from "../../../feature/store";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteAccountApi, displayUser } from "../../../feature/reducers/userSlice";
import { NotificationService } from "../../../services/notificationServices";
import { useNavigate, useParams } from "react-router-dom";

const DeleteAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem("userId");
  const { targetUserId } = useParams();
  const user = useSelector((state: RootState) => displayUser(state, userId || ""));
  const navigate = useNavigate();
  const [sure, setSure] = useState(false);

  const remove = async () => {
    try {
      const response = await dispatch(deleteAccountApi(targetUserId!)).unwrap();
      localStorage.clear();
      NotificationService.success(response.message);
      navigate("/");
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  return (
    <section className="flex flex-col gap-8 max-w-xl">
      <div className="section-head">
        <h2 className="text-SECONDARY_RED">{t("profile.deleteTitle")}</h2>
      </div>
      <div className="flex items-center gap-4">
        <img className="w-16 h-16 rounded-full object-cover" src={user?.profile_photo} alt="" />
        <div className="min-w-0">
          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="muted text-sm break-all">{user?.email}</p>
        </div>
      </div>
      <p className="leading-7">{t("profile.deleteWarn")}</p>
      <div className="flex flex-wrap gap-3">
        {!sure ? (
          <button type="button" className="btn-delete" onClick={() => setSure(true)}>{t("profile.deleteAsk")}</button>
        ) : (
          <>
            <button type="button" className="btn-delete" onClick={remove}>{t("profile.deleteConfirm")}</button>
            <button type="button" className="btn" onClick={() => setSure(false)}>{t("profile.cancel")}</button>
          </>
        )}
      </div>
    </section>
  );
};

export default DeleteAccount;
