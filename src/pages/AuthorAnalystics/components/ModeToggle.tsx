import { Coins, Eye } from "lucide-react";
import type { Mode } from "../AuthorAnalytics";

type Props = {
  mode: Mode;
  onChange: (m: Mode) => void;
};

export const ModeToggle = ({ mode, onChange }: Props) => {
  const btn =
    "px-3 h-9 rounded-xl text-sm inline-flex items-center gap-2 transition";
  return (
    <div className="inline-flex rounded-2xl bg-white/5 ring-1 ring-white/10 p-1 gap-1">
      <button
        onClick={() => onChange("revenue")}
        className={`${btn} ${
          mode === "revenue" ? "bg-white/20" : "hover:bg-white/10"
        }`}
        title="Xem Doanh thu"
      >
        <Coins className="h-4 w-4" />
        Doanh thu
      </button>
      <button
        onClick={() => onChange("views")}
        className={`${btn} ${
          mode === "views" ? "bg-white/20" : "hover:bg-white/10"
        }`}
        title="Xem Lượt xem"
      >
        <Eye className="h-4 w-4" />
        Lượt xem
      </button>
    </div>
  );
};
