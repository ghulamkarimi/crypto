import { ReactNode } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ShowTime from "../showTime/ShowTime";
import { authorName } from "../../utils/author";

interface IArticleViewProps {
  article: { title: string; description: string; image?: unknown; createdAt: string; likes: unknown[]; disLikes: unknown[]; numViews: number };
  author?: { _id?: string; profile_photo?: string; firstName?: string; lastName?: string };
  liked: boolean;
  disliked: boolean;
  commentCount: number;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLike: () => void;
  onDislike: () => void;
  backTo: string;
  comments: ReactNode; // Kommentarfeld und Liste
  aside: ReactNode; // weitere Beiträge
}

// Gemeinsame Ansicht für eine einzelne Nachricht oder Analyse
const ArticleView = ({ article, author, liked, disliked, commentCount, canEdit, onEdit, onDelete, onLike, onDislike, backTo, comments, aside }: IArticleViewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="grid gap-x-14 gap-y-12 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article className="min-w-0 flex flex-col gap-6">
        <button type="button" className="self-start text-sm muted hover:text-PRIMARY_ORANGE" onClick={() => navigate(backTo)}>
          ← {t("article.back")}
        </button>

        <h1 className="text-[clamp(34px,5vw,56px)] leading-[1.05] break-words">{article.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button type="button" className="flex items-center gap-3 text-left hover:text-PRIMARY_ORANGE" onClick={() => navigate(`/profile/${author?._id}`)}>
            <img className="w-10 h-10 rounded-full object-cover" src={author?.profile_photo} alt="" />
            <span>
              <span className="block font-medium">{authorName(author as never)}</span>
              <span className="block text-xs muted"><ShowTime timestamp={article.createdAt} /></span>
            </span>
          </button>
          {canEdit && (
            <div className="flex items-center gap-3 text-2xl">
              <button type="button" aria-label={t("common.edit")} className="hover:text-PRIMARY_ORANGE" onClick={onEdit}><CiEdit /></button>
              <button type="button" aria-label={t("common.delete")} className="hover:text-SECONDARY_RED" onClick={onDelete}><IoMdClose /></button>
            </div>
          )}
        </div>

        {article.image ? (
          <img className="w-full max-h-[480px] object-cover rounded-lg bg-[var(--hover)]" src={String(article.image)} alt="" />
        ) : null}

        <p className="text-lg leading-8 whitespace-pre-line max-w-[70ch]">{article.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[var(--line)]">
          <div className="flex items-center gap-6">
            <button type="button" onClick={onLike} aria-pressed={liked} className={`flex items-center gap-2 ${liked ? "text-PRIMARY_ORANGE" : "hover:text-PRIMARY_ORANGE"}`}>
              <BiLike className="text-2xl" /> <span className="tabular-nums">{article.likes.length}</span>
              <span className="sr-only">{t("article.like")}</span>
            </button>
            <button type="button" onClick={onDislike} aria-pressed={disliked} className={`flex items-center gap-2 ${disliked ? "text-SECONDARY_RED" : "hover:text-PRIMARY_ORANGE"}`}>
              <BiDislike className="text-2xl" /> <span className="tabular-nums">{article.disLikes.length}</span>
              <span className="sr-only">{t("article.dislike")}</span>
            </button>
            <span className="flex items-center gap-2 muted">
              <FaRegComment className="text-xl" /> <span className="tabular-nums">{commentCount}</span>
            </span>
          </div>
          <span className="flex items-center gap-2 muted" title={t("article.views")}>
            <IoEyeOutline className="text-xl" /> <span className="tabular-nums">{article.numViews}</span>
          </span>
        </div>

        {comments}
      </article>

      <aside className="min-w-0 flex flex-col gap-10">{aside}</aside>
    </div>
  );
};

export default ArticleView;
