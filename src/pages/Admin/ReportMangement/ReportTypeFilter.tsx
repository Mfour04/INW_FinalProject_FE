import React from "react";
import {
  ChevronDown,
  User,
  BookOpen,
  FileText,
  MessageSquare,
  Megaphone,
  MessageCircle,
  Grid2X2,
} from "lucide-react";
import { ReportTypeStatus } from "../../../api/Admin/Report/report.type";

interface ReportTypeFilterProps {
  activeFilter: ReportTypeStatus | "All";
  onFilter: (value: ReportTypeStatus | "All") => void;
}

type Opt = { value: ReportTypeStatus | "All"; label: string; icon: React.ReactNode };

const OPTIONS: Opt[] = [
  { value: "All", label: "Tất cả", icon: <Grid2X2 className="w-4 h-4" /> },
  { value: 5, label: "Người dùng", icon: <User className="w-4 h-4" /> },
  { value: 0, label: "Tiểu thuyết", icon: <BookOpen className="w-4 h-4" /> },
  { value: 1, label: "Chương", icon: <FileText className="w-4 h-4" /> },
  { value: 2, label: "Bình luận", icon: <MessageSquare className="w-4 h-4" /> },
  { value: 3, label: "Bài viết diễn đàn", icon: <Megaphone className="w-4 h-4" /> },
  { value: 4, label: "Bình luận diễn đàn", icon: <MessageCircle className="w-4 h-4" /> },
];

const ReportTypeFilter = ({ activeFilter, onFilter }: ReportTypeFilterProps) => {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const active = React.useMemo(
    () => OPTIONS.find((o) => o.value === activeFilter) ?? OPTIONS[0],
    [activeFilter]
  );

  // Đóng khi click ra ngoài
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !listRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Keyboard navigation cơ bản
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (open && e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  const handleSelect = (v: ReportTypeStatus | "All") => {
    onFilter(v);
    setOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div className="relative w-full sm:w-56 max-w-full" onKeyDown={handleKeyDown}>
      {/* Button */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-10 px-3.5 rounded-2xl inline-flex items-center justify-between gap-2
                   bg-white/90 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                   ring-1 ring-zinc-200 dark:ring-zinc-700
                   hover:bg-white dark:hover:bg-zinc-800/90
                   focus:outline-none focus:ring-2 focus:ring-zinc-400 text-sm
                   shadow-sm"
        onClick={() => setOpen((s) => !s)}
      >
        <span className="inline-flex items-center gap-2 truncate">
          <span className="text-zinc-500">{active.icon}</span>
          <span className="truncate">{active.label}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Chọn loại báo cáo"
          className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden text-sm
                     bg-white/95 dark:bg-[#0f1319]/95 backdrop-blur 
                     ring-1 ring-zinc-200/80 dark:ring-white/10 shadow-xl"
        >
          <div className="max-h-64 overflow-auto py-1
            scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent
            dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-transparent">
            {OPTIONS.map((o) => {
              const selected = o.value === activeFilter;
              return (
                <button
                  key={String(o.value)}
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(o.value)}
                  className={`w-full px-3 py-2.5 text-left flex items-center gap-2
                              transition group
                              ${selected
                                ? "bg-zinc-100/80 dark:bg-white/10 text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-white/5"
                              }`}
                >
                  <span className={`text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300`}>
                    {o.icon}
                  </span>
                  <span className="truncate">{o.label}</span>
                  {selected && (
                    <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-md
                                     bg-zinc-200/70 text-zinc-800
                                     dark:bg-white/10 dark:text-zinc-200">
                      Đang chọn
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTypeFilter;
