import { NavLink } from "react-router-dom";
import { menuItem } from "./MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { setIsSidebarMenuOpen } from "../../../feature/reducers/appSlice";
import { RootState } from "../../../feature/store";
import { useTranslation } from "react-i18next";
import Branding from "../branding/Branding";
import LanguageSwitch from "../language/LanguageSwitch";
import DarkMode from "../darkMode/DarkMode";

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const { isSidebarMenuOpen } = useSelector((state: RootState) => state.app);
  const { t } = useTranslation();
  const close = () => dispatch(setIsSidebarMenuOpen(false));

  return (
    <aside
      aria-hidden={!isSidebarMenuOpen}
      className={`fixed top-0 left-0 h-full z-50 lg:hidden w-[min(86vw,320px)] flex flex-col border-r border-[var(--line)] bg-[var(--surface)] text-inherit ${
        isSidebarMenuOpen ? "translate-x-0" : "-translate-x-full invisible"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
        <Branding />
        <button type="button" onClick={close} aria-label={t("profile.close")} className="p-1 -mr-1">
          <IoClose className="w-7 h-7" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuItem.map((item) => (
          <NavLink
            key={item.link}
            to={item.link}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-4 text-lg hover:bg-[var(--hover)] ${isActive ? "text-PRIMARY_ORANGE font-medium" : ""}`
            }
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-[var(--line)]">
        <LanguageSwitch />
        <DarkMode />
      </div>
    </aside>
  );
};

export default SidebarMenu;
