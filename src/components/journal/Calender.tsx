import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import JournalSidebar from "./sidebar/JournalSidebar";
import {
  displayJournals,
  setDate,
  setNavPositionType,
  setPositionsCalenderType,
  setPositionsType,

} from "../../feature/reducers/journalSlice";
import { useNavigate } from "react-router-dom";
import { setIsJournalSideBarActive } from "../../feature/reducers/appSlice";


interface ICalenderProps {
  month: number;
  years: number;
}
//  day is i

const Calender = ({ month, years }: ICalenderProps) => {
  const navigate = useNavigate();
  const journals = useSelector(displayJournals);
  const { isShowPositionHeaderActive } = useSelector(
    (state: RootState) => state.journals
  );
  const userId = localStorage.getItem("userId");
  const userJournals = journals.filter((journal) => journal.user === userId!);

  const firstDayOfMonat = new Date(years, month - 1, 1);
  const lastDayOfMonat = new Date(years, month, 0);
  const dispatch = useDispatch();
  const lastDayOfMonatArray = lastDayOfMonat.toString().split(" ");
  const { isJournalSideBarActive } = useSelector(
    (state: RootState) => state.app
  );
  const lastDay = lastDayOfMonatArray[2];
  const { i18n } = useTranslation();
  // Montag = 0 ... Sonntag = 6, direkt berechnet (kein Flackern beim ersten Rendern)
  const index = (firstDayOfMonat.getDay() + 6) % 7;
  const setIndex = () => {};
  const [isOpenPositionActive, setIsOpenPositionActive] = useState(false);
  const weekdayLabels = Array.from({ length: 7 }, (_, d) =>
    new Date(2024, 0, 1 + d).toLocaleDateString(i18n.language.startsWith("de") ? "de-DE" : "en-US", { weekday: "short" })
  );

  const renderedComponents = () => {
    const components = [];
    for (let i = 0; i < Number(lastDay) + index; i++) {
      if (i < index) {
        components.push(<div className=" " key={i}></div>);
      } else {
        const date = `${years}-${month.toString().padStart(2, "0")}-${(
          i +
          1 -
          index
        )
          .toString()
          .padStart(2, "0")}`;

        const matchingDateOpen = userJournals.filter((item) => {
          return item?.startDate === date && !item.isClose;
        });

        const matchingDateProfit = userJournals.filter((item) => {
          return item?.startDate === date && item.isClose && item.results;
        });

        const matchingDateLoss = userJournals.filter((item) => {
          return item?.startDate === date && item.isClose && !item.results;
        });

        components.push(
          <div className={`calender-space relative`} key={i}>
            <p className=" absolute top-1 left-2 text-md font-FONT_VIGA ">
              {date.slice(8, 10)}
            </p>

            <button
              className="calender-space-btn"
              onClick={() => {
                dispatch(setIsJournalSideBarActive(true));
                dispatch(setDate(date));
              }}
            >
              +
            </button>

            <p
              className=" absolute bottom-1 left-1 text-xs sm:text-sm px-1 sm:px-2 lg:text-lg rounded-lg bg-PRIMARY_ORANGE  w-fit"
              onClick={() => {
                dispatch(setDate(date));
                localStorage.setItem("date", date);
                dispatch(setPositionsCalenderType("open"))
                dispatch(setPositionsType("fake"))
                dispatch(setNavPositionType("fake"))
                navigate("/positions");
              }}
            >
              {matchingDateOpen.length > 0 && matchingDateOpen.length}
            </p>
            <p
              className=" absolute bottom-1 left-auto text-xs sm:text-sm px-1 sm:px-2 lg:text-lg rounded-lg  bg-SECONDARY_GREEN  w-fit"
              onClick={() => {
                dispatch(setDate(date));
                localStorage.setItem("date", date);
                dispatch(setPositionsCalenderType("profit"))
                dispatch(setPositionsType("fake"))
                dispatch(setNavPositionType("fake"))
                navigate("/positions");
              }}
            >
              {matchingDateProfit.length > 0 && matchingDateProfit.length}
            </p>
            <p
              className=" absolute bottom-1 right-1 text-xs sm:text-sm px-1 sm:px-2 lg:text-lg  rounded-lg  bg-SECONDARY_RED w-fit "
              onClick={() => {
                dispatch(setDate(date));
                localStorage.setItem("date", date);
                dispatch(setPositionsCalenderType("loss"))
                dispatch(setPositionsType("fake"))
                dispatch(setNavPositionType("fake"))
                navigate("/positions");
              }}
            >
              {matchingDateLoss.length > 0 && matchingDateLoss.length}
            </p>
          </div>
        );
      }
    }
    return components;
  };

  const { isDarkMode } = useSelector((state: RootState) => state.app);
  return (
    <div
      className={` rounded-lg p-2 ${
        isDarkMode ? " bg-SECONDARY_BLACK" : " bg-SECONDARY_WHITE"
      }  `}
    >
      <div className={`${isOpenPositionActive && "hidden"}`}>
        <div className=" grid grid-cols-7 justify-items-center font-FONT_VIGA uppercase ">
          {weekdayLabels.map((day, index) => (
            <div key={index}>
              <p>{day}</p>
            </div>
          ))}
        </div>

        <div className="">
          <div className="grid grid-cols-7">{renderedComponents()}</div>
        </div>
      </div>
      <div
        className={`${
          !isJournalSideBarActive && "hidden"
        } w-full bg-DARK_BLUE/50 fixed inset-0 backdrop-blur-sm`}
        onClick={() => {
          dispatch(setIsJournalSideBarActive(false));
        }}
      ></div>

      <JournalSidebar index={index} setIndex={setIndex} />
     
      <div className={`${!isShowPositionHeaderActive && "hidden"}`}></div>
    </div>
  );
};

export default Calender;
