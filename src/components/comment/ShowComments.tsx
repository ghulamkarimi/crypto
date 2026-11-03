/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteCommentApi, displayComments, editCommentApi } from "../../feature/reducers/commentSlice";
import { displayUsers } from "../../feature/reducers/userSlice";
import { AppDispatch } from "../../feature/store";
import { NotificationService } from "../../services/notificationServices";
import { authorName } from "../../utils/author";

interface IShowProps {
  components: "analyze" | "news" | "post";
  postIdPublic: string;
}

const LIMIT = 300;

const ShowComments = ({ postIdPublic }: IShowProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const comments = useSelector(displayComments).filter((c) => c.post === postIdPublic);
  const users = useSelector(displayUsers);
  const userId = localStorage.getItem("userId") || "";
  const isAdmin = !!users.find((u) => u._id === userId)?.isAdmin;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const save = async (comment: any) => {
    try {
      const response = await dispatch(
        editCommentApi({ targetUser: comment.user?._id, commentIdPublic: comment._id, comment: draft })
      ).unwrap();
      NotificationService.success(response.message);
      setEditingId(null);
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  const remove = async (comment: any) => {
    try {
      await dispatch(deleteCommentApi({ targetUser: comment.user?._id, commentIdPublic: comment._id })).unwrap();
    } catch (error: any) {
      NotificationService.error(error.message);
    }
  };

  if (!comments.length) return <p className="muted">{t("article.noComments")}</p>;

  return (
    <ul className="flex flex-col">
      {comments.map((comment: any) => {
        const own = userId === comment?.user?._id;
        const long = comment.comment.length > LIMIT;
        const open = expanded[comment._id];
        return (
          <li key={comment._id} className="row-line flex gap-3 py-4">
            <img className="w-10 h-10 rounded-full object-cover flex-none" src={comment?.user?.profile_photo} alt="" />
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium truncate">{authorName(comment?.user)}</span>
                {(own || isAdmin) && editingId !== comment._id && (
                  <div className="flex gap-3 text-sm flex-none">
                    {own && (
                      <button type="button" className="muted hover:text-PRIMARY_ORANGE" onClick={() => { setDraft(comment.comment); setEditingId(comment._id); }}>
                        {t("common.edit")}
                      </button>
                    )}
                    <button type="button" className="muted hover:text-SECONDARY_RED" onClick={() => remove(comment)}>
                      {t("common.delete")}
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment._id ? (
                <>
                  <textarea className="field" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} />
                  <div className="flex gap-3">
                    <button type="button" className="btn btn-primary !py-1.5 !px-4 text-sm" onClick={() => save(comment)} disabled={!draft.trim()}>
                      {t("article.save")}
                    </button>
                    <button type="button" className="btn !py-1.5 !px-4 text-sm" onClick={() => setEditingId(null)}>
                      {t("article.cancel")}
                    </button>
                  </div>
                </>
              ) : (
                <p className="leading-7 whitespace-pre-line break-words">
                  {long && !open ? `${comment.comment.slice(0, LIMIT)} …` : comment.comment}
                  {long && (
                    <button type="button" className="ml-2 underline underline-offset-4 muted hover:text-PRIMARY_ORANGE" onClick={() => setExpanded({ ...expanded, [comment._id]: !open })}>
                      {open ? t("article.showLess") : t("article.showMore")}
                    </button>
                  )}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ShowComments;
