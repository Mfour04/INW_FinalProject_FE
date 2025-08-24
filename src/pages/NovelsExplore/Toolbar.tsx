import { List, LayoutGrid, RotateCcw } from "lucide-react";
import type { ViewMode } from "./types";

type Props = {
  view: ViewMode;
  onChangeView: (v: ViewMode) => void;
  onRefresh?: () => void;
  badgeText?: string;
};

const ACTIVE_GRAD =
  "bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)]";

export const Toolbar = ({
  view,
  onChangeView,
  onRefresh,
  badgeText,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      {badgeText && (
        <div
          className="
            hidden md:inline-block text-[12.5px] px-2.5 py-1 rounded-md
            bg-gray-100 text-gray-800 ring-1 ring-gray-200
            dark:bg-white/[0.06] dark:text-white/85 dark:ring-white/10
          "
        >
          {badgeText}
        </div>
      )}

      <div
        className="
          inline-flex items-center gap-2 p-[2px] rounded-lg
          bg-gray-100 ring-1 ring-gray-200 shadow-[0_10px_26px_-18px_rgba(0,0,0,0.18)]
          dark:bg-white/[0.06] dark:ring-white/10 dark:shadow-[0_10px_26px_-18px_rgba(0,0,0,0.6)]
        "
      >
        <button
          onClick={onRefresh}
          className="
            h-9 w-9 grid place-items-center rounded-md
            text-gray-700 hover:bg-gray-200
            dark:text-white dark:hover:bg-white/10
            transition
          "
          title="Làm mới"
          aria-label="Làm mới"
          type="button"
        >
          <RotateCcw className="w-[18px] h-[18px]" />
        </button>

        <button
          onClick={() => onChangeView("List")}
          className={[
            "h-9 w-9 grid place-items-center rounded-md transition",
            view === "List"
              ? `${ACTIVE_GRAD} text-black`
              : "text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-white/10",
          ].join(" ")}
          title="Danh sách"
          aria-label="Danh sách"
          type="button"
        >
          <List className="w-[18px] h-[18px]" />
        </button>

        <button
          onClick={() => onChangeView("Grid")}
          className={[
            "h-9 w-9 grid place-items-center rounded-md transition",
            view === "Grid"
              ? `${ACTIVE_GRAD} text-black`
              : "text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-white/10",
          ].join(" ")}
          title="Lưới"
          aria-label="Lưới"
          type="button"
        >
          <LayoutGrid className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
};
