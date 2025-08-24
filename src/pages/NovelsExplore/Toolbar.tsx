import ViewList from "@mui/icons-material/ViewList";
import Dashboard from "@mui/icons-material/Dashboard";
import Refresh from "@mui/icons-material/Refresh";
import type { ViewMode } from "../types";

type Props = {
  view: ViewMode;
  onChangeView: (v: ViewMode) => void;
  onRefresh?: () => void;
  badgeText?: string;
};

export const Toolbar = ({
  view,
  onChangeView,
  onRefresh,
  badgeText,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      {badgeText && (
        <div className="hidden md:inline-block text-[12.5px] text-white/85 px-2.5 py-1 rounded-md ring-1 ring-white/10 bg-white/[0.06]">
          {badgeText}
        </div>
      )}

      <div className="inline-flex items-center gap-2 p-[2px] rounded-lg bg-white/[0.06] ring-1 ring-white/10 shadow-[0_10px_26px_-18px_rgba(0,0,0,0.6)]">
        <button
          onClick={onRefresh}
          className="h-9 w-9 grid place-items-center rounded-md text-white hover:bg-white/10"
          title="Làm mới"
        >
          <Refresh sx={{ width: 18, height: 18 }} />
        </button>

        <button
          onClick={() => onChangeView("List")}
          className={[
            "h-9 w-9 grid place-items-center rounded-md transition",
            view === "List"
              ? "bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)] text-black"
              : "text-white hover:bg-white/10",
          ].join(" ")}
          title="Danh sách"
        >
          <ViewList sx={{ width: 18, height: 18 }} />
        </button>

        <button
          onClick={() => onChangeView("Grid")}
          className={[
            "h-9 w-9 grid place-items-center rounded-md transition",
            view === "Grid"
              ? "bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)] text-black"
              : "text-white hover:bg-white/10",
          ].join(" ")}
          title="Lưới"
        >
          <Dashboard sx={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
};
