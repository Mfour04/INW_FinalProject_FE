import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, ChevronDown, Search as SearchIcon } from "lucide-react";
import type { ReactNode, RefObject } from "react";

type SortOption = { value: string; label: string };

type SearchProps = {
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  onSubmit: () => void;

  sortOptions?: SortOption[];

  searchIcon: string;   
  clearIcon: string;
  filterIcon: string;

  onApplyFilters?: (filters: { sort: string; tags: string[] }) => void;

  initialSort?: string;
  initialTags?: string[];
};

const MOCK_TAG_OPTIONS: { value: string; label: string }[] = [
  { value: "romance", label: "Lãng mạn" },
  { value: "action", label: "Hành động" },
  { value: "fantasy", label: "Giả tưởng" },
  { value: "comedy", label: "Hài hước" },
  { value: "school", label: "Học đường" },
  { value: "isekai", label: "Isekai" },
  { value: "drama", label: "Drama" },
];

function useOnClickOutside(refs: RefObject<HTMLElement>[], handler: () => void, when = true) {
  useEffect(() => {
    if (!when) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (refs.every((r) => r.current && !r.current.contains(t))) handler();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [refs, handler, when]);
}

function useElementWidth(ref: RefObject<HTMLElement>, maxCap = 720, sidePadding = 24) {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const viewportCap = Math.max(0, window.innerWidth - sidePadding);
      const cap = Math.min(maxCap, viewportCap);
      setWidth(Math.min(rect.width, cap));
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(el);

    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [ref, maxCap, sidePadding]);

  return width;
}

function TagChip({
  active,
  children,
  onClick,
  onRemove,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative overflow-hidden h-8 px-3 rounded-full text-xs font-medium transition",
        active
          ? "text-white bg-gradient-to-r from-[#ff572e] via-[#ff6f45] to-[#ff9966] shadow-[0_10px_26px_rgba(255,111,69,0.35)]"
          : "text-zinc-300 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>
      {active && onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 inline-flex items-center justify-center align-middle rounded-full bg-white/15 hover:bg-white/25 w-4 h-4"
        >
          <X className="w-3 h-3" />
        </span>
      )}
      {active && (
        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
      )}
    </button>
  );
}

/* ===================== ModernSelect (custom, kbd nav) ===================== */
/* Dùng viền gradient -inset-px để không bị “mất khúc” */
function ModernSelect({
  value,
  onChange,
  options,
  placeholder = "Không sắp xếp",
}: {
  value: string;
  onChange: (v: string) => void;
  options: SortOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const fullOptions = [{ value: "", label: placeholder }, ...options];
  const selected = fullOptions.find((o) => o.value === value);

  useOnClickOutside([btnRef as any, popRef as any], () => setOpen(false), open);

  useEffect(() => {
    if (!open) return;
    setFocusIndex(Math.max(0, fullOptions.findIndex((o) => o.value === value)));
  }, [open, value]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIndex((i) => (i + 1) % fullOptions.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIndex((i) => (i - 1 + fullOptions.length) % fullOptions.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = fullOptions[focusIndex];
      if (item) {
        onChange(item.value);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl
                   bg-[linear-gradient(135deg,rgba(255,87,46,.7),rgba(255,153,102,.3))]"
      />
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative w-full h-12 rounded-2xl bg-[#111114]/90 backdrop-blur-md
                   ring-1 ring-white/10 px-4 pr-10 flex items-center justify-between text-sm text-white
                   hover:bg-[#151518]/90 transition"
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <span className="absolute right-2 inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 ring-1 ring-white/10">
          <ChevronDown className="w-4 h-4 opacity-80" />
        </span>
      </button>

      {open && (
        <div
          ref={popRef}
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden
                     bg-[#111114]/96 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,.65)]"
        >
          <div className="max-h-64 overflow-auto p-1">
            {fullOptions.map((opt, idx) => {
              const active = value === opt.value;
              const focused = focusIndex === idx;
              return (
                <button
                  key={opt.value + idx}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setFocusIndex(idx)}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left rounded-xl px-3 py-2 text-sm transition flex items-center justify-between",
                    active
                      ? "text-white bg-gradient-to-r from-[#ff572e] via-[#ff6f45] to-[#ff9966] shadow-[0_10px_26px_rgba(255,111,69,0.35)]"
                      : focused
                      ? "text-white bg-white/6"
                      : "text-zinc-300 hover:text-white hover:bg-white/6",
                  ].join(" ")}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <Check className="w-4 h-4 opacity-90" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const SearchBar = ({
  searchTerm,
  onSearchTermChange,
  onSubmit,
  sortOptions = [],
  searchIcon,
  clearIcon,
  filterIcon,
  onApplyFilters,
  initialSort = "",
  initialTags = [],
}: SearchProps) => {
  const [selectedSort, setSelectedSort] = useState<string>(initialSort ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags ?? []);

  const [showDropdown, setShowDropdown] = useState(false);
  const [tempSort, setTempSort] = useState<string>(selectedSort);
  const [tempTags, setTempTags] = useState<string[]>(selectedTags);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  // Auto sync temp khi mở
  useEffect(() => {
    if (showDropdown) {
      setTempSort(selectedSort || "");
      setTempTags(selectedTags || []);
    }
  }, [showDropdown, selectedSort, selectedTags]);

  useOnClickOutside([dropdownRef as any, containerRef as any], () => setShowDropdown(false), showDropdown);

  const toggleTempTag = (v: string) =>
    setTempTags((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const activeFilterCount = useMemo(
    () => (selectedSort ? 1 : 0) + selectedTags.length,
    [selectedSort, selectedTags]
  );

  const popupWidth = useElementWidth(containerRef, 720, 24); 

  return (
    <div className="relative w-full max-w-[760px]" ref={containerRef}>
      <div className="h-12 rounded-2xl bg-[#0f1115]/70 backdrop-blur-md ring-1 ring-white/10 flex items-center px-2 gap-1 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_10px_30px_-12px_rgba(0,0,0,.65)]">
        <button
          onClick={onSubmit}
          aria-label="Tìm kiếm"
          className="h-10 w-10 grid place-items-center rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition"
        >
          <SearchIcon className="w-4 h-4 opacity-85" />
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm truyện, tác giả…"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="flex-1 h-full bg-transparent text-white placeholder-zinc-400 outline-none px-1 text-[15px]"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchTermChange("")}
            aria-label="Xóa"
            className="h-10 w-10 grid place-items-center rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition"
            title="Xóa"
          >
            <img src={clearIcon} alt="" className="w-4 h-4 opacity-80" />
          </button>
        )}

        <button
          onClick={() => setShowDropdown((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={showDropdown}
          aria-label="Bộ lọc tìm kiếm"
          className="relative h-10 w-10 grid place-items-center rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition"
          title="Bộ lọc"
        >
          <img src={filterIcon} alt="" className="w-5 h-5 opacity-85" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-[#ff6f45] text-white text-[10px] leading-5 text-center ring-1 ring-white/20">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-[calc(100%+10px)] rounded-3xl
                     bg-[#0f1115]/95 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)] z-50 p-5"
          style={{
            width: popupWidth || undefined,           
            minWidth: Math.min(320, popupWidth || 320), 
          }}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">Sắp xếp theo</span>
              {tempSort && (
                <button
                  onClick={() => setTempSort("")}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                >
                  Bỏ sắp xếp
                </button>
              )}
            </div>
            <ModernSelect
              value={tempSort}
              onChange={setTempSort}
              options={Array.isArray(sortOptions) ? sortOptions : []}
              placeholder="Không sắp xếp"
            />
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">Tag (chọn nhiều)</span>
              {tempTags.length > 0 && (
                <button
                  onClick={() => setTempTags([])}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                >
                  Bỏ chọn tất cả
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {MOCK_TAG_OPTIONS.map((tag) => {
                const active = tempTags.includes(tag.value);
                return (
                  <TagChip
                    key={tag.value}
                    active={active}
                    onClick={() => toggleTempTag(tag.value)}
                    onRemove={active ? () => toggleTempTag(tag.value) : undefined}
                  >
                    {tag.label}
                  </TagChip>
                );
              })}
            </div>

            {tempTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tempTags.map((t) => {
                  const label = MOCK_TAG_OPTIONS.find((x) => x.value === t)?.label || t;
                  return (
                    <TagChip key={`sel-${t}`} active onRemove={() => toggleTempTag(t)}>
                      {label}
                    </TagChip>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setTempSort("");
                setTempTags([]);
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Đặt lại
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDropdown(false)}
                className="h-10 px-4 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onApplyFilters?.({
                    sort: tempSort || "",
                    tags: tempTags || [],
                  });
                  setSelectedSort(tempSort || "");
                  setSelectedTags(tempTags || []);
                  setShowDropdown(false);
                }}
                className="h-10 px-4 rounded-xl text-sm font-semibold text-black
                           bg-gradient-to-r from-white to-white/90 hover:brightness-[.98] transition"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
