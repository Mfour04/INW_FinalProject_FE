import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetUserHistory } from "../../api/Transaction/transaction.api";
import type { GetUserHistoryParams, TransactionItem } from "../../api/Transaction/transaction.type";
import { TransactionCard } from "./TransactionCard";
import { Loader2, ChevronLeft } from "lucide-react";

const TYPE_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Nạp coin", value: 0 },
  { label: "Rút coin", value: 1 },
  { label: "Mua tiểu thuyết", value: 2 },
  { label: "Mua chương", value: 3 },
];

const SORT_SIMPLE = [
  { label: "Mới nhất", value: "created_at:desc" },
  { label: "Cũ nhất", value: "created_at:asc" },
];

/* ---------------------------
   CustomSelect (no deps)
----------------------------*/
type Opt = { label: string; value: any };
function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Chọn...",
}: {
  value: any;
  onChange: (v: any) => void;
  options: Opt[];
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(() => Math.max(0, options.findIndex(o => o.value === value)));
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function commit(i: number) {
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive(i => Math.min(options.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setActive(i => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (!open) setOpen(true); else commit(active); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        className={[
          "h-9 min-w-[160px] px-3 rounded-md text-sm flex items-center justify-between",
          "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
          "dark:bg-white/5 dark:text-white/90 dark:ring-white/10 dark:hover:bg-white/10",
          "focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-white/20",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <span className="ml-2 text-slate-500 dark:text-white/60 text-xs">▾</span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={[
            "absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md shadow-lg",
            "bg-white ring-1 ring-slate-200",
            "dark:bg-[#0f1318] dark:ring-white/10",
          ].join(" ")}
        >
          {options.map((o, i) => {
            const isActive = i === active;
            const isSelected = o.value === value;
            return (
              <div
                key={String(o.value)}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(i)}
                className={[
                  "px-3 py-2 text-sm cursor-pointer",
                  isActive
                    ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                    : "text-slate-700 dark:text-white/80",
                  isSelected ? "font-semibold" : "font-normal",
                ].join(" ")}
              >
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   TransactionHistory
----------------------------*/
export const TransactionHistory = () => {
  const [params, setParams] = useState<GetUserHistoryParams>({
    page: 0,
    limit: 12,
    type: undefined,
    sortBy: "created_at:desc",
  });
  const [items, setItems] = useState<TransactionItem[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["userHistory_customSelect", params],
    queryFn: () =>
      GetUserHistory({
        page: params.page,
        limit: params.limit,
        ...(params.type !== undefined ? { type: params.type } : {}),
        sortBy: params.sortBy,
      }).then((res) => res.data.data),
    keepPreviousData: true,
  });

  const totalPage = data?.totalPage ?? 1;
  const currentPage = params.page ?? 0;
  const canLoadMore = currentPage < totalPage - 1;

  useEffect(() => {
    if (!data?.items) return;
    if (currentPage === 0) setItems(data.items);
    else {
      const seen = new Set(items.map((i) => i.id));
      setItems((prev) => [...prev, ...data.items.filter((x) => !seen.has(x.id))]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.items, currentPage]);

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
           <div className="py-3 px-1 flex items-center gap-10">
              <button
                onClick={() => navigate(-1)}
                className="h-9 w-9 grid place-items-center rounded-lg 
                            bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                            dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/[0.12]"
                title="Quay lại"
                aria-label="Quay lại"
              >
                <ChevronLeft size={16} />
              </button>
            <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
              Lịch sử giao dịch
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CustomSelect
              value={params.type}
              onChange={(v) =>
                setParams((old) => ({
                  ...old,
                  page: 0,
                  type: v === "" ? undefined : Number(v),
                }))
              }
              options={TYPE_OPTIONS}
              className="w-[180px]"
            />
            <CustomSelect
              value={params.sortBy}
              onChange={(v) =>
                setParams((old) => ({
                  ...old,
                  page: 0,
                  sortBy: v,
                }))
              }
              options={SORT_SIMPLE}
              className="w-[160px]"
            />
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin text-slate-500 dark:text-white/60" /> : null}
          </div>
        </div>

        <div className={["rounded-2xl p-4 md:p-5",
          "bg-white ring-1 ring-slate-200",
          "dark:bg-[#0a0f16]/60 dark:ring-white/10"].join(" ")}>
          {isLoading && items.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-white/60">
              <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
              Đang tải...
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-white/60">Chưa có giao dịch nào.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((t) => (
                <TransactionCard key={t.id} transaction={t} />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-4 grid place-items-center">
              <button
                onClick={() => setParams((old) => ({ ...old, page: (old.page ?? 0) + 1 }))}
                disabled={!canLoadMore || isFetching}
                className={["h-9 px-4 rounded-md text-sm transition",
                  "bg-slate-100 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200 disabled:opacity-60",
                  "dark:bg-white/5 dark:text-white/90 dark:ring-white/10 dark:hover:bg-white/10"].join(" ")}
              >
                {isFetching ? "Đang tải..." : canLoadMore ? "Xem thêm" : "Hết dữ liệu"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
