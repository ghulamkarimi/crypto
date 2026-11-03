/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../feature/store";
import { displayUser } from "../../feature/reducers/userSlice";
import { createCommentApi } from "../../feature/reducers/commentSlice";
import { NotificationService } from "../../services/notificationServices";

interface ICreateCommentProps {
  components: "post" | "analyze" | "news";
  postIdPublic: string;
}

const CreateComment = ({ postIdPublic }: ICreateCommentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => displayUser(state, userId!));
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  if (!userId) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <p className="muted">{t("article.loginToComment")}</p>
        <button type="button" className="btn" onClick={() => navigate("/auth")}>{t("access.login")}</button>
      </div>
    );
  }

  const send = async () => {
    const comment = value.trim();
    if (!comment || busy) return;
    setBusy(true);
    try {
      await dispatch(createCommentApi({ postIdPublic, post: postIdPublic, comment })).unwrap();
      setValue("");
    } catch (error: any) {
      NotificationService.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <img className="w-10 h-10 rounded-full object-cover flex-none" src={user?.profile_photo} alt="" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <textarea
          className="field"
          rows={2}
          value={value}
          placeholder={t("article.commentPlaceholder")}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <div>
          <button type="button" className="btn btn-primary !py-1.5 !px-5 text-sm" onClick={send} disabled={busy || !value.trim()}>
            {t("article.send")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
