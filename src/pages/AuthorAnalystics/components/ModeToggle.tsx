import { Coins, Eye } from "lucide-react";
import type { Mode } from "../AuthorAnalytics";

type Props = {
  mode: Mode;
  onChange: (m: Mode) => void;
};

export const ModeToggle = ({ mode, onChange }: Props) => {
  const baseBtn =
    "px-3 h-9 rounded-xl text-sm inline-flex items-center gap-2 transition-colors";
  const idle =
    "text-zinc-700 hover:bg-zinc-200/70 dark:text-white/80 dark:hover:bg-white/10";
  const active =
    "bg-zinc-100 text-zinc-900 dark:bg-white/20 dark:text-white";

  return (
    <div
      className="inline-flex rounded-2xl p-1 gap-1
                 bg-zinc-50 ring-1 ring-zinc-200
                 dark:bg-white/5 dark:ring-white/10"
      role="tablist"
      aria-label="Chế độ thống kê"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "revenue"}
        onClick={() => onChange("revenue")}
        className={`${baseBtn} ${mode === "revenue" ? active : idle}`}
        title="Xem Doanh thu"
      >
        <Coins className="h-4 w-4" />
        Doanh thu
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === "views"}
        onClick={() => onChange("views")}
        className={`${baseBtn} ${mode === "views" ? active : idle}`}
        title="Xem Lượt xem"
      >
        <Eye className="h-4 w-4" />
        Lượt xem
      </button>
    </div>
  );
};
