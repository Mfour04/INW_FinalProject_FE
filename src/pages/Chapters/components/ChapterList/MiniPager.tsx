import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clamp } from "../../utils";

type MiniPagerProps = {
  totalPages: number;
  currentPage: number;
  onChange: (p1: number) => void;
};

export const MiniPager = ({
  totalPages,
  currentPage,
  onChange,
}: MiniPagerProps) => {
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
          // light
          "border bg-gray-50 border-gray-200 shadow-[0_16px_44px_-22px_rgba(0,0,0,0.06)]",
          // dark
          "dark:border-white/12 dark:bg-[#141517]/85 dark:shadow-[0_16px_44px_-22px_rgba(0,0,0,0.75)]",
          "backdrop-blur-xl",
        ].join(" ")}
        role="group"
        aria-label="Phân trang"
      >
        <button
          onClick={() => onChange(clamp(currentPage - 1, 1, totalPages))}
          disabled={currentPage === 1}
          className="
            h-8 w-8 grid place-items-center rounded-full transition
            bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            dark:bg-white/[0.06] dark:border-white/14 dark:hover:bg-white/10 dark:text-white
          "
          title="Trang trước"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 text-[12px] text-gray-800 dark:text-white/85">
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
            className="
              w-12 h-8 text-center rounded-md tabular-nums appearance-none
              bg-white border border-gray-300 text-gray-900 text-[13px]
              focus:outline-none focus:ring-2 focus:ring-[#ff784f]/30 focus:border-[#ff784f]/50
              dark:bg-black/25 dark:border-white/12 dark:text-white
            "
            aria-label="Đi tới trang"
          />
          <span className="text-gray-500 dark:text-white/60">/ {totalPages}</span>
        </div>

        <button
          onClick={() => onChange(clamp(currentPage + 1, 1, totalPages))}
          disabled={currentPage === totalPages}
          className="
            h-8 w-8 grid place-items-center rounded-full transition
            bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            dark:bg-white/[0.06] dark:border-white/14 dark:hover:bg-white/10 dark:text-white
          "
          title="Trang sau"
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
