import { BRAND_NAME } from "../../../brand";
import { FaHome } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import { FaArrowRightLong, FaBitcoin } from "react-icons/fa6";
export const menuItem = [
  {
    title: "home",
    key: "nav.home",
    link: "/home",
    icon: <FaHome />,
    arrowIcon: <FaArrowRightLong />,
  },
  {
    title: "Coins",
    key: "nav.coins",
    link: "/coin",
    icon: <FaBitcoin />,
    arrowIcon: <FaArrowRightLong />,
  },
  {
    title: "News",
    key: "nav.news",
    link: "/news",
    icon: <IoNewspaper />,
    arrowIcon: <FaArrowRightLong />,
  },
  {
    title: "Analyze",
    key: "nav.analyze",
    link: "/analyze",
    icon: <SiGoogleanalytics />,
    arrowIcon: <FaArrowRightLong />,
  },
];

const handleMenuItemClick = (title: string) => {
  document.title = `${BRAND_NAME} – ${title}`;
};

export default handleMenuItemClick;
