import { useEffect, useMemo, useRef, useState } from "react";

export interface Candle {
  t: number; // Millisekunden
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface Level {
  value: number;
  label: string;
  color: string;
}

interface ICandleChartProps {
  candles: Candle[];
  levels: Level[];
  locale: string;
}

const UP = "#7ccf9e";
const DOWN = "#f27d68";
const HEIGHT = 380;
const M = { top: 12, right: 72, bottom: 26, left: 8 };

const fmt = (v: number) =>
  v.toLocaleString("en-US", { maximumFractionDigits: v >= 100 ? 0 : v >= 1 ? 2 : 4 });

// Kerzen-Chart in reinem SVG: keine Bibliothek, keine fremden Dienste
const CandleChart = ({ candles, levels, locale }: ICandleChartProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.max(280, el.clientWidth)));
    ro.observe(el);
    setWidth(Math.max(280, el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const view = useMemo(() => {
    const validLevels = levels.filter((l) => Number.isFinite(l.value));
    let min = Math.min(...candles.map((c) => c.l), ...validLevels.map((l) => l.value));
    let max = Math.max(...candles.map((c) => c.h), ...validLevels.map((l) => l.value));
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
      min = (min || 0) - 1;
      max = (max || 0) + 1;
    }
    const pad = (max - min) * 0.06;
    return { min: min - pad, max: max + pad, validLevels };
  }, [candles, levels]);

  const plotW = width - M.left - M.right;
  const plotH = HEIGHT - M.top - M.bottom;
  const step = plotW / Math.max(candles.length, 1);
  const bodyW = Math.max(1.5, Math.min(14, step * 0.7));
  const y = (v: number) => M.top + ((view.max - v) / (view.max - view.min)) * plotH;
  const x = (i: number) => M.left + step * i + step / 2;

  const yTicks = Array.from({ length: 6 }, (_, i) => view.min + ((view.max - view.min) * i) / 5);
  const xTicks = candles.length
    ? [0, 0.25, 0.5, 0.75, 1].map((p) => Math.min(candles.length - 1, Math.round((candles.length - 1) * p)))
    : [];

  const dateLabel = (t: number, withTime = false) =>
    new Date(t).toLocaleString(locale, withTime
      ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
      : { day: "2-digit", month: "short" });

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientX - rect.left - M.left) / step);
    setHover(i >= 0 && i < candles.length ? i : null);
  };

  const h = hover !== null ? candles[hover] : null;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        aria-label="Kerzen-Chart"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        className="block"
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} stroke="rgba(162,156,144,0.15)" />
            <text x={width - M.right + 8} y={y(v) + 4} fontSize="11" fill="#a29c90">{fmt(v)}</text>
          </g>
        ))}

        {xTicks.map((i, k) => (
          <text key={k} x={x(i)} y={HEIGHT - 8} fontSize="11" fill="#a29c90" textAnchor={k === 0 ? "start" : k === xTicks.length - 1 ? "end" : "middle"}>
            {dateLabel(candles[i].t)}
          </text>
        ))}

        {candles.map((c, i) => {
          const color = c.c >= c.o ? UP : DOWN;
          const top = y(Math.max(c.o, c.c));
          const bottom = y(Math.min(c.o, c.c));
          return (
            <g key={c.t}>
              <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1" />
              <rect x={x(i) - bodyW / 2} y={top} width={bodyW} height={Math.max(1, bottom - top)} fill={color} />
            </g>
          );
        })}

        {view.validLevels.map((l) => (
          <g key={l.label}>
            <line x1={M.left} x2={width - M.right} y1={y(l.value)} y2={y(l.value)} stroke={l.color} strokeDasharray="6 4" strokeWidth="1.5" />
            <rect x={width - M.right} y={y(l.value) - 9} width={M.right} height={18} fill={l.color} />
            <text x={width - M.right + 6} y={y(l.value) + 4} fontSize="11" fontWeight="600" fill="#0d0c0b">{l.label}</text>
          </g>
        ))}

        {h && hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={HEIGHT - M.bottom} stroke="#a29c90" strokeDasharray="3 3" />
        )}
      </svg>

      {h && (
        <div
          className="pointer-events-none absolute top-2 left-3 rounded border border-[var(--line)] bg-[#121110] px-3 py-2 text-xs tabular-nums text-[#ece7dc]"
        >
          <div className="mb-1 text-[#a29c90]">{dateLabel(h.t, true)}</div>
          <div className="grid grid-cols-[auto_auto] gap-x-3">
            <span className="text-[#a29c90]">O</span><span>{fmt(h.o)}</span>
            <span className="text-[#a29c90]">H</span><span>{fmt(h.h)}</span>
            <span className="text-[#a29c90]">L</span><span>{fmt(h.l)}</span>
            <span className="text-[#a29c90]">C</span><span style={{ color: h.c >= h.o ? UP : DOWN }}>{fmt(h.c)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandleChart;
