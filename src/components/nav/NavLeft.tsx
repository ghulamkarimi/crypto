import { useTranslation } from "react-i18next";
import { IPost, IUser } from "../../interface/index";
import SideList from "./SideList";

interface INavLeftProps {
  component?: "post" | "news" | "analyze";
  post: IPost[];
  user?: IUser;
}

// "Beliebt": Beiträge mit den meisten Likes
const NavLeft = ({ component, post }: INavLeftProps) => {
  const { t } = useTranslation();
  return <SideList component={component} post={post} title={t("article.top")} limit={6} />;
};

export default NavLeft;
