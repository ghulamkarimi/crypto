import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";

import Branding from "./branding/Branding";
import UserControllPanel from "./userControllPanel/UserControllPanel";
import DarkMode from "./darkMode/DarkMode";
import Menu from "./menu/Menu";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSearchBoxActive,
  setIsSidebarMenuOpen,
} from "../../feature/reducers/appSlice";
import { BiLogInCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import MaxWithWrapper from "../MaxWithWrapper";
import { RootState } from "../../feature/store";
import SearchBox from "../search/SearchBox";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./language/LanguageSwitch";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isSearchBoxActive } = useSelector((state: RootState) => state.app);
  const userId = localStorage.getItem("userId")
    ? localStorage.getItem("userId")
    : "";

  useEffect(() => {}, [userId, localStorage]);
  return (
    <MaxWithWrapper className="">
      <div
        className={`flex gap-2 sm:gap-3 items-center ${
          isSearchBoxActive
            ? "hidden"
            : "bg-transparent flex justify-between items-center"
        }`}
      >
        <HiMiniBars3CenterLeft
          className="w-7 h-7 sm:w-8 sm:h-8 flex-none lg:hidden cursor-pointer"
          onClick={() => dispatch(setIsSidebarMenuOpen(true))}
        />
        <div className="w-full flex items-center justify-between gap-2 min-w-0">
          {/* start nav left */}
          <div className="flex-1 min-w-0 flex justify-start items-center gap-3 sm:gap-4">
            {/* Branding */}

            <Branding />

            {/* End Branding */}

            {/* Start Menu */}
            <Menu />
            {/* End Menu */}
          </div>
          {/* End Nav Left */}

          {/* Start Nav Right */}
          <div className="flex flex-none gap-3 sm:gap-4 justify-end items-center relative">
            {/* Start Search Icon */}
            <button
              className=""
              onClick={() => dispatch(setIsSearchBoxActive(true))}
            >
              <IoSearchSharp className="icon" />
            </button>
            {/* End Search Icon */}

            {/* Sprache und Theme: ab Desktop hier, auf dem Handy im Seitenmenü */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitch />
              <DarkMode />
            </div>
            {/* End Dark Mode */}
            {userId && userId ? (
              <div>
                <UserControllPanel />
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-primary hidden lg:flex !text-[15px]"
                  onClick={() => navigate("/auth")}
                >
                  {t("nav.loginRegister")}
                </button>
                <div
                  className="btn btn-primary lg:hidden"
                  onClick={() => navigate("/auth")}
                >
                  <BiLogInCircle className="icon" />
                </div>
              </div>
              /* End btn Log-Reg */
            )}
          </div>
          {/* End Nav Right */}
        </div>
      </div>
      <div>
        <SearchBox />
      </div>
    </MaxWithWrapper>
  );
};

export default Navbar;
