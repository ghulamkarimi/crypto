import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../feature/store";
import { IPost } from "../../interface/index";
import ShowTime from "../showTime/ShowTime";
import { incrementAnalyzeViewsApi } from "../../feature/reducers/analyzeSlice";
import { incrementPostsViewsApi } from "../../feature/reducers/postSlice";
import { incrementNewsViewsApi } from "../../feature/reducers/newsSlice";

export interface ISideListProps {
  component?: "post" | "news" | "analyze";
  post: IPost[];
  title: string;
  limit?: number;
}

// Kompakte Liste mit weiteren Beiträgen (Vorschaubild, Titel, Zeit)
const SideList = ({ component, post, title, limit = 5 }: ISideListProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const open = async (id: string) => {
    const arg = { postIdPublic: id };
    if (component === "analyze") await dispatch(incrementAnalyzeViewsApi(arg));
    else if (component === "news") await dispatch(incrementNewsViewsApi(arg));
    else if (component === "post") await dispatch(incrementPostsViewsApi(arg));
    navigate(`/${component}/${id}`);
  };

  if (!post.length) return null;

  return (
    <section className="flex flex-col" aria-label={title}>
      <div className="section-head">
        <h3>{title}</h3>
      </div>
      <ul>
        {post.slice(0, limit).map((item) => (
          <li key={item._id} className="row-line">
            <button type="button" onClick={() => open(item._id)} className="w-full flex items-center gap-3 py-3 text-left group">
              <img className="w-16 h-16 rounded object-cover flex-none bg-[var(--hover)]" src={String(item?.image || "")} alt="" />
              <span className="min-w-0 flex flex-col gap-1">
                <span className="line-clamp-2 leading-snug group-hover:text-PRIMARY_ORANGE">{item?.title}</span>
                <span className="text-xs muted"><ShowTime timestamp={item?.createdAt} /></span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SideList;
