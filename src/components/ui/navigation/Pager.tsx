import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const Pager = ({ page, totalPages, onPrev, onNext }: Props) => {
  const canPrev = page > 0;
  const canNext = page < Math.max(totalPages - 1, 0);

  return (
    <nav aria-label="Pagination" className="mt-12 mb-3 flex justify-center">
      <div
        className="
          inline-flex w-[280px] h-[45px] items-center justify-between rounded-xl
          bg-white ring-1 ring-gray-200 px-3 py-2 backdrop-blur-sm
          dark:bg-white/[0.03] dark:ring-white/10
        "
      >
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={[
            "h-8 w-8 grid place-items-center rounded-lg transition outline-none",
            canPrev
              ? "bg-gray-100 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-300"
              : "bg-gray-50 text-gray-400 cursor-not-allowed",
            "dark:enabled:bg-white/[0.04] dark:enabled:hover:bg-white/[0.08] dark:enabled:focus-visible:ring-2 dark:enabled:focus-visible:ring-white/30 dark:disabled:bg-white/[0.02] dark:disabled:text-white/40"
          ].join(" ")}
          title="Trang trước"
          aria-label="Trang trước"
          type="button"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-sm font-medium text-gray-800 flex items-center gap-2 dark:text-white">
          Trang
          <span className="inline-block rounded-md bg-gradient-to-tr from-[#ff512f] to-[#ff9966] px-2 py-0.5 text-white font-semibold shadow-sm">
            {Math.min(page + 1, Math.max(totalPages, 1))}
          </span>
          /<span>{Math.max(totalPages, 1)}</span>
        </div>

        <button
          onClick={onNext}
          disabled={!canNext}
          className={[
            "h-8 w-8 grid place-items-center rounded-lg transition outline-none",
            canNext
              ? "bg-gray-100 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-300"
              : "bg-gray-50 text-gray-400 cursor-not-allowed",
            "dark:enabled:bg-white/[0.04] dark:enabled:hover:bg-white/[0.08] dark:enabled:focus-visible:ring-2 dark:enabled:focus-visible:ring-white/30 dark:disabled:bg-white/[0.02] dark:disabled:text-white/40"
          ].join(" ")}
          title="Trang sau"
          aria-label="Trang sau"
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};
