import { Search } from "lucide-react";
import type { SortKey, StatusFilter } from "../types";
import type { Dispatch, SetStateAction } from "react";
import { MenuSelect } from "../../../components/ui/filter/MenuSelect";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  status: StatusFilter;
  setStatus: Dispatch<SetStateAction<StatusFilter>>;
  sortBy: SortKey;
  setSortBy: Dispatch<SetStateAction<SortKey>>;
};

export const ControlsBar = ({
  query,
  setQuery,
  status,
  setStatus,
  sortBy,
  setSortBy,
}: Props) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-3 ring-1 ring-white/10 bg-white/[0.02] backdrop-blur-md shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)]"
      style={{
        background:
          "radial-gradient(900px 600px at 0% -20%, rgba(255,103,64,0.08), transparent 45%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
        <div>
          <div className="relative flex items-center gap-2 h-10 rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-3 focus-within:ring-2 focus-within:ring-white/25">
            <Search className="h-4 w-4 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm truyện…"
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-white/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="ml-1 h-6 w-6 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                aria-label="Xoá tìm kiếm"
              >
                <span className="text-xs text-white/80">×</span>
              </button>
            )}
          </div>
        </div>

        <MenuSelect<StatusFilter>
          value={status}
          onChange={setStatus}
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Đang diễn ra", value: "ongoing" },
            { label: "Hoàn thành", value: "finished" },
          ]}
          buttonClassName="min-w-[150px] text-left"
          width={150}
        />

        <MenuSelect<SortKey>
          value={sortBy}
          onChange={setSortBy}
          options={[
            { label: "Mới cập nhật", value: "updated" },
            { label: "Lượt xem", value: "views" },
            { label: "Theo dõi", value: "followers" },
            { label: "Tiêu đề (A→Z)", value: "title" },
          ]}
          align="right"
          buttonClassName="min-w-[200px] text-left"
          width={200}
        />
      </div>
    </div>
  );
};
