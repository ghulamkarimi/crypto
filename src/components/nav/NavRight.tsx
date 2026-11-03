import { useTranslation } from "react-i18next";
import { IPost, IUser } from "../../interface/index";
import SideList from "./SideList";

interface INavRightProps {
  component?: "post" | "news" | "analyze";
  post: IPost[];
  user?: IUser;
}

// "Neueste": zuletzt veröffentlichte Beiträge
const NavRight = ({ component, post }: INavRightProps) => {
  const { t } = useTranslation();
  const latest = [...post].sort((a, b) => +new Date(b?.createdAt) - +new Date(a?.createdAt));
  return <SideList component={component} post={latest} title={t("article.latest")} limit={5} />;
};

export default NavRight;
