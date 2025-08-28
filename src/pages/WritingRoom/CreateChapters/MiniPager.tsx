import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type MiniPagerProps = {
  totalPages: number;
  currentPage: number;
  onChange: (p1: number) => void;
};

export const MiniPager = ({ totalPages, currentPage, onChange }: MiniPagerProps) => {
  const [valStr, setValStr] = useState(String(currentPage));

  const commit = () => {
    const onlyDigits = valStr.replace(/\D+/g, "");
    const asNum = onlyDigits === "" ? currentPage : parseInt(onlyDigits, 10);
    const next = clamp(asNum, 1, totalPages);
    if (next !== currentPage) onChange(next);
    setValStr(String(next));
  };

  useEffect(() => setValStr(String(currentPage)), [currentPage]);

  return (
    <div className="flex justify-center">
      <div
        className={[
          "inline-flex items-center gap-2 rounded-full px-2.5 py-2",
          "border border-zinc-200 bg-white backdrop-blur-xl shadow-sm",
          "dark:border-white/12 dark:bg-[#141517]/85 dark:shadow-[0_16px_44px_-22px_rgba(0,0,0,0.75)]",
        ].join(" ")}
        role="group"
        aria-label="Phân trang"
      >
        {/* Prev */}
        <button
          onClick={() => onChange(clamp(currentPage - 1, 1, totalPages))}
          disabled={currentPage === 1}
          className={[
            "h-8 w-8 grid place-items-center rounded-full transition",
            "border border-zinc-200 bg-zinc-100 hover:bg-zinc-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "dark:border-white/14 dark:bg-white/[0.06] dark:hover:bg-white/10",
          ].join(" ")}
          title="Trang trước"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Input */}
        <div className="inline-flex items-center gap-1.5 text-[12px] text-zinc-700 dark:text-white/85">
          <span className="hidden sm:inline">Trang</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={valStr}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              setValStr(v);
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className={[
              "w-12 h-8 text-center rounded-md tabular-nums appearance-none",
              "bg-white border border-zinc-200 text-zinc-900",
              "focus:outline-none focus:ring-2 focus:ring-[#ff784f]/30",
              "dark:bg-black/25 dark:border-white/12 dark:text-white",
            ].join(" ")}
            aria-label="Đi tới trang"
          />
          <span className="text-zinc-600 dark:text-white/60">/ {totalPages}</span>
        </div>

        {/* Next */}
        <button
          onClick={() => onChange(clamp(currentPage + 1, 1, totalPages))}
          disabled={currentPage === totalPages}
          className={[
            "h-8 w-8 grid place-items-center rounded-full transition",
            "border border-zinc-200 bg-zinc-100 hover:bg-zinc-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "dark:border-white/14 dark:bg-white/[0.06] dark:hover:bg-white/10",
          ].join(" ")}
          title="Trang sau"
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
