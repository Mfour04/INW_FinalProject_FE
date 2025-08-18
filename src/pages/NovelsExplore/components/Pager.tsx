import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const Pager: React.FC<Props> = ({ page, totalPages, onPrev, onNext }) => {
  const canPrev = page > 0;
  const canNext = page < Math.max(totalPages - 1, 0);

  return (
    <nav aria-label="Pagination" className="mt-12 mb-3 flex justify-center">
      <div className="inline-flex w-[280px] h-[45px] items-center justify-between rounded-xl bg-white/[0.03] ring-1 ring-white/10 px-3 py-2 backdrop-blur-sm">
        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={[
            "h-8 w-8 grid place-items-center rounded-lg transition outline-none",
            canPrev
              ? "bg-white/[0.04] hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/30"
              : "bg-white/[0.02] text-white/40 cursor-not-allowed",
          ].join(" ")}
          title="Trang trước"
          aria-label="Trang trước"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page indicator với số trang hiện tại gradient cam */}
        <div className="text-sm font-medium text-white flex items-center gap-2">
          Trang
          <span className="inline-block rounded-md bg-gradient-to-tr from-[#ff512f] to-[#ff9966] px-2 py-0.5 text-white font-semibold shadow-sm">
            {Math.min(page + 1, Math.max(totalPages, 1))}
          </span>
          /
          <span>{Math.max(totalPages, 1)}</span>
        </div>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={!canNext}
          className={[
            "h-8 w-8 grid place-items-center rounded-lg transition outline-none",
            canNext
              ? "bg-white/[0.04] hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-white/30"
              : "bg-white/[0.02] text-white/40 cursor-not-allowed",
          ].join(" ")}
          title="Trang sau"
          aria-label="Trang sau"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};
