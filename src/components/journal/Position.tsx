import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import {
  displayJournal,
  setIsClosePositionJournalActive,
  setIsDeleteJournalPositionActive,
  setIsJournalPositionOpenEditActive,
} from "../../feature/reducers/journalSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EditInitiateTrade from "./sidebar/EditInitiateTrade";


import DeletePositionJournal from "./sidebar/DeletePositionJournal";
import EditClosePositionJournal from "./EditClosePositionJournal";

const Position = () => {
 
  const {
    journalId,
    isJournalPositionOpenEditActive,
    isDeleteJournalPositionActive,
  } = useSelector((state: RootState) => state.journals);
  const { isDarkMode } = useSelector((state: RootState) => state.app);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const journal = useSelector((state: RootState) =>
    displayJournal(state, journalId)
  );

  const rows: [string, string][] = [
    [t("journalPage.pair"), `${journal?.baseCoin}/${journal?.quoteCoin}`],
    [t("journalPage.type"), String(journal?.tradeType ?? "")],
    [t("journalPage.startTime"), String(journal?.startTime ?? "")],
    [t("journalPage.startDate"), String(journal?.startDate ?? "")],
    [t("journalPage.price"), `$ ${journal?.price}`],
    [t("journalPage.takeProfit"), `$ ${journal?.takeProfit}`],
    [t("journalPage.stopLoss"), `$ ${journal?.stopLoss}`],
    [t("journalPage.riskReward"), String(journal?.riskReward ?? "")],
  ];

  return (
    <div className="w-full flex flex-col relative">
      <div className="section-head">
        <h2>
          {journal?.baseCoin}/{journal?.quoteCoin}
        </h2>
        <button
          type="button"
          className="text-[15px] muted hover:text-PRIMARY_ORANGE"
          onClick={() => navigate("/positions")}
        >
          {t("journalPage.back")}
        </button>
      </div>

      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className="row-line flex justify-between gap-4 py-3">
            <dt className="muted">{label}</dt>
            <dd className="font-medium tabular-nums text-right capitalize">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="py-6 max-w-[65ch]">
        <h4 className="mb-2">{t("journalPage.reasons")}</h4>
        <p className="muted leading-7">{journal?.reasonsforEntry}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary" onClick={() => dispatch(setIsClosePositionJournalActive(true))}>
          {t("journalPage.closePosition")}
        </button>
        <button className="btn" onClick={() => dispatch(setIsJournalPositionOpenEditActive(true))}>
          {t("journalPage.edit")}
        </button>
        <button className="btn-delete" onClick={() => dispatch(setIsDeleteJournalPositionActive(true))}>
          {t("journalPage.delete")}
        </button>
      </div>
      <div
        className={`sm:bg-DARK_BLUE/80 backdrop-blur-sm w-full h-screen fixed inset-0 z-50 ${
          isDarkMode ? " bg-SECONDARY_BLACK" : " bg-SECONDARY_WHITE"
        }  ${!isJournalPositionOpenEditActive && "hidden"}`}
      >
        <EditInitiateTrade />
      </div>
      <div className={`${!isDeleteJournalPositionActive && "hidden"}`}>
        <DeletePositionJournal />
      </div>
      <div
        className={` sm:bg-DARK_BLUE/80 backdrop-blur-sm w-full h-screen fixed inset-0 z-50 ${
          isDarkMode ? " bg-SECONDARY_BLACK" : " bg-SECONDARY_WHITE"
        } ${!isJournalPositionOpenEditActive && "hidden"}`}
      >
        <EditClosePositionJournal />
      </div>
    </div>
  );
};

export default Position;
