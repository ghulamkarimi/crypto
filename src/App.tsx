import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, cssTransition } from "react-toastify";

// Kurzes, ruhiges Einblenden statt Hüpfen
const Fade = cssTransition({ enter: "toast-fade-in", exit: "toast-fade-out", collapse: false });

import {
  setInputValueSearchBox,
  setIsDarkMode,
  setIsSearchBoxActive,
  setIsSidebarMenuOpen,
  setIsUserPanelJournalOpen,
  setIsUserPanelOpen,
} from "./feature/reducers/appSlice";
import { AppDispatch, RootState } from "./feature/store";
import SidebarMenu from "./components/navbar/menu/SidebarMenu";
import { useEffect, useRef } from "react";
import { checkTokenApi, setUserId } from "./feature/reducers/userSlice";
import Footer from "./components/footer/Footer";
import ButtonTop from "./components/scrollTopButton/ScrollTopButton";
import CookieNotice from "./components/footer/CookieNotice";

const App = () => {
  const goTopRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    isUserPanelOpen,
    isSidebarMenuOpen,
    isDarkMode,
    isSearchBoxActive,
    inputValueSearchBox,
    isUserPanelJournalOpen,
  } = useSelector((state: RootState) => state.app);
  const { userId } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    const checkUserIsLogin = async () => {
      try {
        await dispatch(checkTokenApi()).unwrap();
        dispatch(setUserId(localStorage.getItem("userId")));
      } catch (error: any) {
        localStorage.clear();
        dispatch(setUserId(""));
      }
    };

    checkUserIsLogin();
  }, [userId]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme !== "false") {
      dispatch(setIsDarkMode(true));
    } else {
      dispatch(setIsDarkMode(false));
    }
  }, [dispatch, isDarkMode]);

  return (
    // <PersistGate loading={null} persistor={persistor}>
    <div
      className={`w-full min-h-screen relative ${
        isDarkMode ? "dark-theme" : " light-theme"
      }`}
      ref={goTopRef}
    >
      <div
        className={`${
          isDarkMode
            ? " bg-SECONDARY_BLACK text-PRIMARY_WHITE"
            : " bg-SECONDARY_WHITE text-PRIMARY_BLACK"
        }`}
      >
        <SidebarMenu />
      </div>

      <div
        className={`z-40 ${
          isSidebarMenuOpen
            ? "fixed inset-0 lg:hidden bg-black/60"
            : "hidden"
        }`}
        onClick={() =>
          isSidebarMenuOpen && dispatch(setIsSidebarMenuOpen(false))
        }
      ></div>

      <div
        className={`min-h-screen z-10`}
        onClick={() => {
          isUserPanelOpen && dispatch(setIsUserPanelOpen(false));
          isSearchBoxActive && dispatch(setIsSearchBoxActive(false));
          inputValueSearchBox && dispatch(setInputValueSearchBox(""));
          isUserPanelJournalOpen && dispatch(setIsUserPanelJournalOpen(false));
        }}
      >
        <header
          className={`py-3 border-b border-[var(--line)] ${
            isDarkMode
              ? " bg-SECONDARY_BLACK text-PRIMARY_WHITE"
              : " bg-SECONDARY_WHITE text-PRIMARY_BLACK"
          }`}
        >
          <Navbar />
        </header>
        <main className="min-h-screen w-full">
          <Outlet />
        </main>
        <footer>
          <Footer />
          {/* <UpAndDown goTopRef={goTopRef} /> */}
          <ButtonTop goTopRef={goTopRef} />
        </footer>
      </div>
      <CookieNotice />
      <ToastContainer position="top-right" transition={Fade} hideProgressBar newestOnTop limit={3} closeButton theme="dark" />
    </div>
    // </PersistGate>
  );
};
export default App;
