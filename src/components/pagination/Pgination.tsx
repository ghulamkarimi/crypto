import React from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  perPage: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  perPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / perPage);
  if (totalItems <= perPage) return null;

  const go = (page: number) => onPageChange(Math.min(Math.max(page, 1), totalPages));

  const pages: number[] = [];
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  for (let p = start; p <= Math.min(totalPages, start + 4); p++) pages.push(p);

  const base = "min-w-9 h-9 px-2 rounded flex items-center justify-center tabular-nums transition-colors";

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label={t("pagination.label")}>
      <button className={`${base} hover:text-PRIMARY_ORANGE disabled:opacity-40`} onClick={() => go(currentPage - 1)} disabled={currentPage === 1}>
        {t("pagination.prev")}
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`${base} ${p === currentPage ? "bg-PRIMARY_ORANGE text-BLACK font-semibold" : "hover:bg-[var(--hover)]"}`}
        >
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          <span className="muted px-1">…</span>
          <button className={`${base} hover:bg-[var(--hover)]`} onClick={() => go(totalPages)}>{totalPages}</button>
        </>
      )}
      <button className={`${base} hover:text-PRIMARY_ORANGE disabled:opacity-40`} onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages}>
        {t("pagination.next")}
      </button>
    </nav>
  );
};

export default Pagination;
