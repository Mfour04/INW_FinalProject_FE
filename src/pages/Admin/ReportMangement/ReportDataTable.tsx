// ReportDataTable.tsx
import React from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  center?: boolean;
  width?: string;
  nowrap?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  pageSize: number;
  emptyLabel?: string;
  dense?: boolean;
  isBusy?: boolean;
  className?: string;
}

export const ReportDataTable = <T extends { id: string }>({
  data,
  columns,
  pageSize,
  emptyLabel = "Không có dữ liệu",
  dense = true,
  isBusy = false,
  className = "",
}: DataTableProps<T>) => {
  const rowH = dense ? 48 : 56;      // px cho h-12 / h-14
  const headerH = 48;                // px cho h-12 header
  const minHeightPx = headerH + rowH * pageSize;

  return (
    <div
      className={[
        "relative rounded-2xl border border-zinc-200/80 bg-white/90 text-zinc-900 shadow-sm",
        "dark:border-white/10 dark:bg-[#0e1116]/80 dark:text-zinc-100 backdrop-blur",
        className,
      ].join(" ")}
    >
      <div
        className="overflow-y-auto max-h-[70vh] [scrollbar-gutter:stable]"
        style={{ minHeight: `${minHeightPx}px` }}
      >
        <table className="w-full table-fixed text-sm">
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width ?? "auto" }} />
            ))}
          </colgroup>

        <thead className="sticky top-0 z-10 backdrop-blur bg-zinc-50/85 dark:bg-[#0a0d12]/75">
          <tr className="h-12 text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            {columns.map((column) => (
              <th
                key={column.key}
                className={[
                  "px-4 font-semibold border-b border-zinc-200 dark:border-white/10 align-middle",
                  column.center ? "text-center" : "text-left",
                  column.nowrap ? "whitespace-nowrap" : "",
                ].join(" ")}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={isBusy ? "opacity-75 transition-opacity" : "opacity-100"}>
          {data.length === 0 ? (
            <tr style={{ height: rowH }}>
              <td className="px-4 text-center text-zinc-500 dark:text-zinc-400 align-middle" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                style={{ height: rowH }}
                className={[
                  "border-b border-zinc-200/70 even:bg-zinc-50/60 hover:bg-zinc-100/60",
                  "dark:border-white/10 dark:even:bg-white/[0.03] dark:hover:bg-white/[0.06]",
                  "transition-colors",
                ].join(" ")}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      "px-4 align-middle",
                      column.center ? "text-center" : "",
                      column.nowrap ? "whitespace-nowrap" : "",
                    ].join(" ")}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};
