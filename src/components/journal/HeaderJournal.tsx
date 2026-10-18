import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import { displayUser } from "../../feature/reducers/userSlice";
import { useTranslation } from "react-i18next";
import {
  displayJournals,
  setNavPositionType,
  setPositionsCalenderType,
  setPositionsType,
} from "../../feature/reducers/journalSlice";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Chart from "chart.js/auto";

Chart.register(ChartDataLabels);

interface IHeaderJournalProps {
  month: number;
  setMonth: (month: number) => void;
  years: number;
  setYears: (years: number) => void;
  expJournal: string;
}

const HeaderJournal = ({
  month,
  setMonth,
  years,
  setYears,
  expJournal,
}: IHeaderJournalProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => displayUser(state, userId!));
  const journals = useSelector(displayJournals);
  const userJournals = journals.filter((journal) => journal.user === userId!);
  const userOpenPositions = userJournals.filter((journal) => !journal.isClose);
  const userJournalProfit = userJournals.filter((journal) => journal.results);
  const dispatch = useDispatch();

  const lossCount =
    userJournals.length - (userJournalProfit.length + userOpenPositions.length);

  const OPEN = "#f2b01e";
  const PROFIT = "#7ccf9e";
  const LOSS = "#f27d68";

  const chartData = {
    labels: [t("journalHeader.open"), t("journalHeader.profit"), t("journalHeader.loss")],
    datasets: [
      {
        data: [userOpenPositions.length, userJournalProfit.length, lossCount],
        backgroundColor: [OPEN, PROFIT, LOSS],
        borderWidth: 0,
      },
    ],
  };

  // Prozentwerte direkt in die Stücke zeichnen (eigenes Mini-Plugin, ohne Fremd-Plugin)
  const percentPlugin = {
    id: "percentLabels",
    afterDatasetsDraw(chart: any) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const values = chart.data.datasets[0].data as number[];
      const sum = values.reduce((a, b) => a + b, 0);
      if (!sum) return;
      ctx.save();
      ctx.font = "bold 13px 'IBM Plex Sans', sans-serif";
      ctx.fillStyle = "#1b1a18";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      meta.data.forEach((arc: any, i: number) => {
        if (!values[i]) return;
        const pos = values[i] === sum ? { x: arc.x, y: arc.y } : arc.tooltipPosition();
        ctx.fillText(`${Math.round((values[i] / sum) * 100)} %`, pos.x, pos.y);
      });
      ctx.restore();
    },
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw}`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  } as any;

  const monthLabel = new Date(years, month - 1, 1).toLocaleDateString(
    i18n.language.startsWith("de") ? "de-DE" : "en-US",
    { month: "long", year: "numeric" }
  );

  const openPositions = (type: "open" | "profit" | "loss" | "all") => {
    dispatch(setPositionsType(type));
    dispatch(setPositionsCalenderType("fake"));
    dispatch(setNavPositionType("fake"));
    navigate("/positions");
  };

  const legend: { type: "open" | "profit" | "loss" | "all"; label: string; hint: string; color: string; count: number }[] = [
    { type: "open", label: t("journalHeader.open"), hint: t("journalHeader.openHint"), color: OPEN, count: userOpenPositions.length },
    { type: "profit", label: t("journalHeader.profit"), hint: t("journalHeader.profitHint"), color: PROFIT, count: userJournalProfit.length },
    { type: "loss", label: t("journalHeader.loss"), hint: t("journalHeader.lossHint"), color: LOSS, count: lossCount },
    { type: "all", label: t("journalHeader.all"), hint: t("journalHeader.allHint"), color: "#3fc5dc", count: userJournals.length },
  ];

  const handleNextArrow = () => {
    if (month < 12) setMonth(month + 1);
    else {
      setMonth(1);
      setYears(years + 1);
    }
  };
  const handlePrevArrow = () => {
    if (month > 1) setMonth(month - 1);
    else {
      setMonth(12);
      setYears(years - 1);
    }
  };
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-5 border-b border-[var(--line)]">
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-center gap-4">
          <img className="rounded-full w-12 h-12 object-cover" src={user?.profile_photo} alt="" />
          <div>
            <h1 className="text-3xl sm:text-4xl leading-none">{t("journalPage.title")}</h1>
            <p className="muted text-sm">
              {user?.firstName} {user?.lastName} · {new Date().toLocaleDateString(i18n.language.startsWith("de") ? "de-DE" : "en-GB")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <button type="button" className="w-8 h-8 rounded hover:bg-[var(--hover)] text-lg" onClick={handlePrevArrow} aria-label={t("journalHeader.prev")}>‹</button>
            <p className="min-w-36 text-center text-lg font-medium capitalize">{monthLabel}</p>
            <button type="button" className="w-8 h-8 rounded hover:bg-[var(--hover)] text-lg" onClick={handleNextArrow} aria-label={t("journalHeader.next")}>›</button>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setMonth(new Date().getMonth() + 1);
              setYears(new Date().getFullYear());
            }}
          >
            {t("journalHeader.today")}
          </button>
        </div>

        {expJournal.slice(1) && <p className="muted">{expJournal.slice(1)}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="w-24 h-24 flex-none">
          {userJournals.length > 0 ? (
            <Pie data={chartData} options={chartOptions} plugins={[percentPlugin]} />
          ) : (
            <div className="w-full h-full rounded-full border border-[var(--line)]" aria-hidden="true" />
          )}
        </div>
        <ul className="flex flex-col min-w-[220px]">
          {legend.map((item) => (
            <li key={item.type}>
              <button
                type="button"
                onClick={() => openPositions(item.type)}
                className="row-line w-full flex items-center gap-3 py-1.5 text-left hover:text-PRIMARY_ORANGE"
              >
                <span className="w-3 h-3 rounded-sm flex-none" style={{ background: item.color }} aria-hidden="true" />
                <span className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="block text-xs muted">{item.hint}</span>
                </span>
                <span className="font-FONT_SALSA font-bold text-xl tabular-nums">{item.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeaderJournal;
