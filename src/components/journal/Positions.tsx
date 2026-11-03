import { useDispatch, useSelector } from "react-redux";
import {
  displayJournals,
  setDate,
  setJournalId,
} from "../../feature/reducers/journalSlice";
import { RootState } from "../../feature/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Positions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { getDate, navPositionType, positionsType, positionsCalenderType } =
    useSelector((state: RootState) => state.journals);
  const date = localStorage.getItem("date");
  const userId = localStorage.getItem("userId");
  const journals = useSelector(displayJournals);
  const userLoginJournals = journals.filter(
    (journal) => journal.user === userId!
  );

  const openPositions =
    positionsType === "all"
      ? userLoginJournals
      : positionsType === "open"
      ? userLoginJournals.filter((journal) => !journal.isClose)
      : positionsType === "loss"
      ? userLoginJournals.filter(
          (journal) => journal.isClose && !journal.results
        )
      : positionsType === "profit"
      ? userLoginJournals.filter(
          (journal) => journal.isClose && journal.results
        )
      : navPositionType === "right"
      ? userLoginJournals.filter((journal) => journal.startDate === date)
      : navPositionType === "left"
      ? userLoginJournals.filter(
          (journal) => !journal.isClose && journal.startDate === date
        )
      : positionsCalenderType === "open"
      ? userLoginJournals.filter(
          (journal) => !journal.isClose && journal.startDate === date
        )
      : positionsCalenderType === "profit"
      ? userLoginJournals.filter(
          (journal) =>
            journal.isClose && journal.results && journal.startDate === date
        )
      : positionsCalenderType === "loss"
      ? userLoginJournals.filter(
          (journal) =>
            journal.isClose && !journal.results && journal.startDate === date
        )
      : userLoginJournals;

  useEffect(() => {
    const storedDate = localStorage.getItem("date");
    dispatch(setDate(storedDate));
  }, [getDate, dispatch]);
  return (
    <div className="w-full flex flex-col">
      <div className="section-head">
        <h2>{date || t("journalPage.positions")}</h2>
        <button
          type="button"
          className="text-[15px] muted hover:text-PRIMARY_ORANGE"
          onClick={() => {
            localStorage.removeItem("date");
            navigate("/journal");
          }}
        >
          {t("journalPage.backToCalendar")}
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-12 gap-3 py-3 text-sm muted row-line">
        <span className="col-span-4">{t("journalPage.pair")}</span>
        <span className="col-span-2">{t("journalPage.type")}</span>
        <span className="col-span-2">{t("journalPage.time")}</span>
        <span className="col-span-2">{t("journalPage.date")}</span>
        <span className="col-span-2 text-right">{t("journalPage.status")}</span>
      </div>

      {openPositions.length === 0 && (
        <p className="py-8 muted">{t("journalPage.noPositions")}</p>
      )}

      {openPositions.map((position) => {
        const status = position?.isClose
          ? position?.profit > 0
            ? { label: t("journalPage.profit"), cls: "text-SECONDARY_GREEN" }
            : { label: t("journalPage.loss"), cls: "text-SECONDARY_RED" }
          : { label: t("journalPage.open"), cls: "text-PRIMARY_ORANGE" };
        return (
          <button
            type="button"
            key={position?._id}
            className="row-line grid grid-cols-12 gap-x-3 gap-y-1 py-4 text-left hover:bg-[var(--hover)]"
            onClick={() => {
              navigate(`/positions/${position?._id}`);
              dispatch(setJournalId(position?._id));
            }}
          >
            <span className="col-span-8 sm:col-span-4 font-semibold">
              {position?.baseCoin}/{position?.quoteCoin}
            </span>
            <span className={`col-span-4 sm:col-span-2 sm:order-5 sm:text-right font-semibold text-right ${status.cls}`}>
              {status.label}
            </span>
            <span className="col-span-4 sm:col-span-2 capitalize">{position?.tradeType}</span>
            <span className="col-span-4 sm:col-span-2 tabular-nums muted">{position?.startTime}</span>
            <span className="col-span-4 sm:col-span-2 tabular-nums muted">{position?.startDate}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Positions;
