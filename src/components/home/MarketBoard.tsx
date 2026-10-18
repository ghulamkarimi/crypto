import { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sortedCoinsByMarketCapRank } from "../../feature/reducers/coinSlice";

const INK = "#ece7dc";
const AMBER = "#f2b01e";
const UP = "#7ccf9e";
const DOWN = "#f27d68";
const PRICE_COLS = 7;
const CHANGE_COLS = 5;

type Cell = { kind: "tile" | "sep"; ch: string; color: string };

// "67,420.50" -> Kachel je Ziffer, Trennzeichen als eigene schmale Zelle
const toCells = (str: string, color: string): Cell[] =>
  str.split("").map((c) => ({
    kind: c === "," || c === "." ? "sep" : "tile",
    ch: c,
    color,
  }));

const digitCount = (str: string) => str.replace(/[^0-9]/g, "").length;

const formatPrice = (price: number): string => {
  let dec = price >= 1 ? 2 : 4;
  let str = price.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  while (digitCount(str) > PRICE_COLS && dec > 0) {
    dec -= 1;
    str = price.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  return str;
};

const blanks = (n: number, color: string): Cell[] =>
  Array.from({ length: Math.max(0, n) }, () => ({ kind: "tile" as const, ch: "", color }));

const MarketBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const all = useSelector(sortedCoinsByMarketCapRank);

  const rows = useMemo(
    () =>
      all
        .filter((c) => typeof c.current_price === "number")
        .slice(0, 8)
        .map((coin) => {
          const change = coin.price_change_percentage_24h ?? coin.market_cap_change_percentage_24h ?? 0;
          const up = change >= 0;
          const color = up ? UP : DOWN;

          const sym = String(coin.symbol || "").toUpperCase().slice(0, 4).padEnd(4, " ");
          const symCells: Cell[] = sym
            .split("")
            .map((c) => ({ kind: "tile" as const, ch: c === " " ? "" : c, color: INK }));

          const priceStr = formatPrice(coin.current_price);
          const priceCells: Cell[] = [...blanks(PRICE_COLS - digitCount(priceStr), AMBER), ...toCells(priceStr, AMBER)];

          const abs = Math.abs(change);
          const absStr = abs.toFixed(abs >= 100 ? 1 : 2);
          const changeCells: Cell[] = [
            ...blanks(CHANGE_COLS - 1 - digitCount(absStr), color),
            { kind: "tile", ch: up ? "+" : "−", color },
            ...toCells(absStr, color),
            { kind: "tile", ch: "%", color },
          ];

          return {
            id: coin.id,
            name: coin.name,
            text: `${coin.name} ${priceStr} US-Dollar, ${up ? "+" : "−"}${absStr} %`,
            groups: [symCells, priceCells, changeCells],
          };
        }),
    [all]
  );

  const groupStyle = [
    { width: "calc(var(--t) * 4 + 9px)", justifyContent: "flex-start" },
    { width: "calc(var(--t) * 8 + 24px)", justifyContent: "flex-end" },
    { width: "calc(var(--t) * 6.5 + 18px)", justifyContent: "flex-end" },
  ] as const;

  return (
    <div className="board-wrap">
      <div className="board" role="group" aria-label={t("board.label")}>
        <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
          <span className="text-[15px] font-semibold">{t("board.title")}</span>
          <span className="text-[13px]" style={{ color: "#a29c90" }}>{t("board.sub")}</span>
        </div>

        <div className="flex gap-[3px] text-xs leading-4" style={{ color: "#a29c90" }} aria-hidden="true">
          <div className="flex-none" style={{ width: groupStyle[0].width }}>{t("board.asset")}</div>
          <div className="flap-gap" />
          <div className="flex-none text-right" style={{ width: groupStyle[1].width }}>{t("board.price")}</div>
          <div className="flap-gap" />
          <div className="flex-none text-right" style={{ width: groupStyle[2].width }}>{t("board.change")}</div>
        </div>

        {rows.length === 0 && (
          <div className="text-sm py-6" style={{ color: "#a29c90" }}>{t("board.loading")}</div>
        )}

        <div className="flex flex-col gap-1">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              className="board-row"
              aria-label={row.text}
              onClick={() => navigate(`/coin/${row.id}`)}
            >
              {row.groups.map((cells, g) => (
                <Fragment key={g}>
                {g > 0 && <span className="flap-gap" />}
                <div className="flex items-center gap-[3px] flex-none" style={groupStyle[g]}>
                  {cells.map((cell, i) =>
                    cell.kind === "sep" ? (
                      <span key={i} className="flap-sep-cell" style={{ color: cell.color }} aria-hidden="true">
                        {cell.ch}
                      </span>
                    ) : (
                      <span key={i} className="flap-tile" aria-hidden="true">
                        {cell.ch !== "" && (
                          <span className="flap-char" style={{ color: cell.color }}>{cell.ch}</span>
                        )}
                      </span>
                    )
                  )}
                </div>
                </Fragment>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketBoard;
