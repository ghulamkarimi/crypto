import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chart from "chart.js/auto";
import { displayCoin } from "../../feature/reducers/coinSlice";
import { RootState } from "../../feature/store";
import { ICoin } from "../../interface";
import { useEffect, useRef } from "react";
import Spinner from "../Spinner";

const num = (v: number | null | undefined, max = 4) =>
  typeof v === "number" ? v.toLocaleString(undefined, { maximumFractionDigits: max }) : "–";

const Coin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { coinId, status } = useSelector((state: RootState) => state.coins);
  const coin = useSelector((state: RootState) => displayCoin(state, coinId));
  const chartRef = useRef<HTMLCanvasElement>(null);

  const renderChart = (canvas: HTMLCanvasElement, item: ICoin) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (Chart.getChart(canvas)) Chart.getChart(canvas)!.destroy();

    const sparklineData = item.sparkline_in_7d?.price ?? [];
    if (sparklineData.length === 0) return;

    new Chart(ctx, {
      type: "line",
      data: {
        labels: sparklineData.map((_, index) => index + 1),
        datasets: [
          {
            label: "7d",
            data: sparklineData,
            borderColor: "#f2b01e",
            backgroundColor: "rgba(242, 176, 30, 0.12)",
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false }, datalabels: { display: false } } as any,
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { display: false }, y: { ticks: { color: "#a29c90" }, grid: { color: "rgba(162,156,144,0.15)" } } },
      },
    });
  };

  useEffect(() => {
    if (coin && chartRef.current) renderChart(chartRef.current, coin);
  }, [coin]);

  if (!coin) {
    if (status === "success" || status === "failed") {
      return (
        <div className="py-20 flex flex-col items-start gap-4">
          <h2>{t("coinPage.notFound")}</h2>
          <p className="muted max-w-[50ch]">{t("coinPage.notFoundText")}</p>
          <button className="btn btn-primary" onClick={() => navigate("/coin")}>
            {t("coinPage.back")}
          </button>
        </div>
      );
    }
    return <Spinner />;
  }

  const change = coin.price_change_percentage_24h ?? 0;
  const rows: [string, string][] = [
    [t("coinPage.marketCap"), `$ ${num(coin.market_cap, 0)}`],
    [t("coinPage.volume"), `$ ${num(coin.total_volume, 0)}`],
    [t("coinPage.high"), `$ ${num(coin.high_24h)}`],
    [t("coinPage.low"), `$ ${num(coin.low_24h)}`],
    [t("coinPage.change"), `$ ${num(coin.price_change_24h)}`],
    [t("coinPage.changePct"), `${num(coin.price_change_percentage_24h, 2)} %`],
    [t("coinPage.capChange"), `$ ${num(coin.market_cap_change_24h, 0)}`],
    [t("coinPage.capChangePct"), `${num(coin.market_cap_change_percentage_24h, 2)} %`],
    [t("coinPage.circulating"), num(coin.circulating_supply, 0)],
    [t("coinPage.totalSupply"), num(coin.total_supply, 0)],
    [t("coinPage.maxSupply"), num(coin.max_supply, 0)],
  ];

  return (
    <div className="py-10 flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-6 border-b border-current">
        <div className="flex items-center gap-5">
          <img src={coin.image} alt="" className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="text-5xl">{coin.name}</h1>
            <p className="muted uppercase">
              {coin.symbol} · {t("coinPage.rank")} {coin.market_cap_rank}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-FONT_SALSA font-bold text-5xl tabular-nums text-PRIMARY_ORANGE">
            $ {num(coin.current_price)}
          </p>
          <p className={`tabular-nums ${change >= 0 ? "text-SECONDARY_GREEN" : "text-SECONDARY_RED"}`}>
            {change >= 0 ? "+" : ""}
            {num(change, 2)} % · 24 h
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-14 gap-y-10">
        <div className="flex-[1_1_420px] min-w-0">
          <h3 className="mb-4">{t("coinPage.chart")}</h3>
          <div className="h-72 board !p-4">
            <canvas ref={chartRef} id={`chart-${coin.id}`} />
          </div>
        </div>
        <dl className="flex-[1_1_360px] min-w-0">
          <h3 className="mb-4">{t("coinPage.facts")}</h3>
          {rows.map(([label, value]) => (
            <div key={label} className="row-line flex justify-between gap-4 py-3">
              <dt className="muted">{label}</dt>
              <dd className="font-medium tabular-nums text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default Coin;
