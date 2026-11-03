import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import handleMenuItemClick, { menuItem } from "./MenuItem";

const Menu = () => {
  const items = menuItem;
  const { t } = useTranslation();

  return (
    <nav className="hidden lg:flex gap-7 font-FONT_VIGA text-[15px] muted">
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          onClick={() => {
            handleMenuItemClick(t(item.key));
          }}
        >
          {t(item.key)}
        </NavLink>
      ))}
    </nav>
  );
};

export default Menu;
