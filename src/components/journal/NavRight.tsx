import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  displayJournals,
  setDate,
  setNavPositionType,
  setPositionsCalenderType,
  setPositionsType,
} from "../../feature/reducers/journalSlice";

const NavRight = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const journals = useSelector(displayJournals);

  const userJournals = journals
    .filter((journal) => journal.user === userId)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const journalCounts = userJournals.reduce((counts, journal) => {
    counts[journal.startDate] = (counts[journal.startDate] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const openDate = (startDate: string) => {
    dispatch(setNavPositionType("right"));
    dispatch(setPositionsType("fake"));
    dispatch(setPositionsCalenderType("fake"));
    dispatch(setDate(startDate));
    localStorage.setItem("date", startDate);
    navigate("/positions");
  };

  return (
    <section>
      <div className="section-head">
        <h3>{t("journalPage.allDays")}</h3>
        <span className="text-sm muted">{t("journalPage.positionsCol")}</span>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {Object.keys(journalCounts).length === 0 && (
          <p className="py-4 muted">{t("journalPage.noPositions")}</p>
        )}
        {Object.entries(journalCounts).map(([startDate, count]) => (
          <button
            key={startDate}
            type="button"
            onClick={() => openDate(startDate)}
            className="row-line w-full flex justify-between items-center py-3 text-left tabular-nums hover:text-PRIMARY_ORANGE"
          >
            <span>{startDate}</span>
            <span className="muted">{count}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default NavRight;
