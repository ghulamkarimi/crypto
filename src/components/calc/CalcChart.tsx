import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { sortedCoinsByMarketCapRank } from "../../feature/reducers/coinSlice";
import { SERVER_URL } from "../../services";
import CandleChart, { Candle } from "./CandleChart";
import TradingViewWidget from "../tradingview/TradingView";

interface ICalcChartProps {
  levels: { entry: number; stop: number; exit: number; long: boolean };
}

// Zeitraum -> Kerzenlänge der Börse, Anzahl Kerzen und Zeitraum für die verzögerte Ersatzquelle
const PERIODS = [
  { key: "live", interval: "1m", limit: 180, days: "1" },
  { key: "d1", interval: "15m", limit: 96, days: "1" },
  { key: "d7", interval: "1h", limit: 168, days: "7" },
  { key: "d30", interval: "4h", limit: 180, days: "30" },
  { key: "d90", interval: "1d", limit: 90, days: "90" },
] as const;

const REST = "https://data-api.binance.vision/api/v3/klines";
const WS = "wss://data-stream.binance.vision/ws";

type Source = "live" | "delayed";

// Eigener Kerzen-Chart mit Live-Kursen über die öffentlichen Marktdaten-Schnittstellen der Börse.
// Fallback: Daten vom eigenen Server (verzögert), danach das TradingView-Widget.
const CalcChart = ({ levels }: ICalcChartProps) => {
  const { t, i18n } = useTranslation();
  const coins = useSelector(sortedCoinsByMarketCapRank);
  const [coinId, setCoinId] = useState("bitcoin");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("live");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [source, setSource] = useState<Source>("live");
  const socketRef = useRef<WebSocket | null>(null);

  const coin = useMemo(() => coins.find((c) => c.id === coinId) ?? coins[0], [coins, coinId]);
  const activeId = coin?.id ?? coinId;
  const symbol = String(coin?.symbol ?? "btc").toUpperCase();
  const cfg = PERIODS.find((p) => p.key === period)!;

  useEffect(() => {
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    setStatus("loading");

    const pair = `${symbol}USDT`;

    const openSocket = () => {
      if (cancelled) return;
      const ws = new WebSocket(`${WS}/${pair.toLowerCase()}@kline_${cfg.interval}`);
      socketRef.current = ws;
      ws.onmessage = (ev) => {
        try {
          const k = JSON.parse(ev.data).k;
          if (!k) return;
          const next: Candle = { t: k.t, o: +k.o, h: +k.h, l: +k.l, c: +k.c };
          setCandles((prev) => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            if (last.t === next.t) return [...prev.slice(0, -1), next];
            if (next.t > last.t) return [...prev.slice(-(cfg.limit - 1)), next];
            return prev;
          });
        } catch {
          /* ignorieren */
        }
      };
      ws.onclose = () => {
        if (!cancelled) retry = setTimeout(openSocket, 3000);
      };
    };

    const loadDelayed = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/coins/${encodeURIComponent(activeId)}/ohlc`, {
          params: { days: cfg.days },
        });
        if (cancelled) return;
        const rows: number[][] = Array.isArray(res.data) ? res.data : [];
        const data = rows.filter((r) => r.length === 5).map(([tm, o, h, l, c]) => ({ t: tm, o, h, l, c }));
        setCandles(data);
        setSource("delayed");
        setStatus(data.length ? "ok" : "error");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    axios
      .get(REST, { params: { symbol: pair, interval: cfg.interval, limit: cfg.limit }, timeout: 10000 })
      .then((res) => {
        if (cancelled) return;
        const rows: (string | number)[][] = Array.isArray(res.data) ? res.data : [];
        const data = rows.map((r) => ({ t: Number(r[0]), o: +r[1], h: +r[2], l: +r[3], c: +r[4] }));
        if (!data.length) throw new Error("empty");
        setCandles(data);
        setSource("live");
        setStatus("ok");
        openSocket();
      })
      .catch(loadDelayed);

    return () => {
      cancelled = true;
      if (retry) clearTimeout(retry);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [symbol, activeId, cfg.interval, cfg.limit, cfg.days]);

  const last = candles[candles.length - 1];
  const first = candles[0];
  const change = last && first ? ((last.c - first.o) / first.o) * 100 : 0;

  const chartLevels = [
    { value: levels.entry, label: t("calcChart.entry"), color: "#3fc5dc" },
    { value: levels.stop, label: t("calcChart.stop"), color: "#f27d68" },
    { value: levels.exit, label: t("calcChart.target"), color: "#7ccf9e" },
  ];

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <div className="section-head">
        <h3>{t("calcChart.title")}</h3>
        <select
          className="field !w-auto !py-1.5"
          value={activeId}
          onChange={(e) => setCoinId(e.target.value)}
          aria-label={t("calcChart.coin")}
        >
          {coins.slice(0, 50).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({String(c.symbol).toUpperCase()})
            </option>
          ))}
          {coins.length === 0 && <option value="bitcoin">Bitcoin (BTC)</option>}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label={t("calcChart.period")}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              aria-pressed={period === p.key}
              className={`px-3 py-1.5 rounded text-sm ${
                period === p.key ? "bg-PRIMARY_ORANGE text-BLACK font-semibold" : "hover:bg-[var(--hover)]"
              }`}
            >
              {t(`calcChart.${p.key}`)}
            </button>
          ))}
        </div>

        {last && status === "ok" && (
          <div className="flex items-baseline gap-3 tabular-nums">
            <span className="font-FONT_SALSA font-bold text-3xl text-PRIMARY_ORANGE">
              $ {last.c.toLocaleString("en-US", { maximumFractionDigits: last.c >= 1 ? 2 : 6 })}
            </span>
            <span className={change >= 0 ? "text-SECONDARY_GREEN" : "text-SECONDARY_RED"}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)} %
            </span>
          </div>
        )}
      </div>

      {status === "error" ? (
        <>
          <p className="muted text-sm">{t("calcChart.fallback")}</p>
          <div className="h-[420px]">
            <TradingViewWidget />
          </div>
        </>
      ) : (
        <div className="board !p-3">
          {status === "loading" ? (
            <div className="h-[380px] flex items-center justify-center text-sm text-[#a29c90]">{t("calcChart.loading")}</div>
          ) : (
            <CandleChart candles={candles} levels={chartLevels} locale={i18n.language.startsWith("de") ? "de-DE" : "en-US"} />
          )}
        </div>
      )}

      {status === "ok" && (
        <p className="text-xs flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${source === "live" ? "bg-SECONDARY_GREEN" : "bg-PRIMARY_ORANGE"}`}
            aria-hidden="true"
          />
          <span className="muted">
            {source === "live" ? t("calcChart.liveNote", { symbol }) : t("calcChart.delayedNote")}
          </span>
        </p>
      )}
      <p className="muted text-xs">{t("calcChart.hint")}</p>
    </section>
  );
};

export default CalcChart;
