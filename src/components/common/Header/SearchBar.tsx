import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  X as XIcon,
  ChevronDown,
  Search as SearchIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SearchUsers } from "../../../api/User/user-search.api";
import type { UserSearchResult } from "../../../api/User/user-search.type";
import { FollowButton } from "../FollowButton";
import { ClickableUserInfo } from "../ClickableUserInfo";
import type { ReactNode, RefObject } from "react";
import type { TagSelectProps } from "./Header";

type SortOption = { value: string; label: string };

type SearchProps = {
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  onSubmit: () => void;
  sortOptions?: SortOption[];
  tagFilterOptions?: TagSelectProps[];

  searchIcon?: string | ReactNode;
  clearIcon?: string | ReactNode;
  filterIcon?: string | ReactNode;
  onApplyFilters?: (filters: { sort: string; tags: string[] }) => void;
  initialSort?: string;
  setSort: (sortBy: string) => void;
  initialTags?: string[];
  size?: "normal" | "compact";
  setTags: (tags: string[]) => void;
};

function useOnClickOutside(
  refs: RefObject<HTMLElement>[],
  handler: () => void,
  when = true
) {
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

function useElementWidth(
  ref: RefObject<HTMLElement>,
  maxCap = 720,
  sidePadding = 24
) {
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
          : "text-gray-700 bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 hover:text-gray-900 dark:text-zinc-300 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10 dark:hover:text-white",
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>
      {active && onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 inline-flex items-center justify-center align-middle rounded-full bg-white/20 hover:bg-white/30 w-4 h-4"
        >
          <XIcon className="w-3 h-3" />
        </span>
      )}
      {active && (
        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
      )}
    </button>
  );
}

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
    setFocusIndex(
      Math.max(
        0,
        fullOptions.findIndex((o) => o.value === value)
      )
    );
  }, [open, value, fullOptions]);
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
        className="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,.04),rgba(0,0,0,.02))] dark:bg-[linear-gradient(135deg,rgba(255,87,46,.7),rgba(255,153,102,.3))]"
      />
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative w-full h-12 rounded-2xl bg-white/90 ring-1 ring-gray-200 text-sm text-gray-800 px-4 pr-10 flex items-center justify-between hover:bg-white dark:bg-[#111114]/90 dark:ring-white/10 dark:text-white dark:hover:bg-[#151518]/90 transition"
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <span className="absolute right-2 inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
          <ChevronDown className="w-4 h-4 text-gray-600 dark:opacity-80" />
        </span>
      </button>
      {open && (
        <div
          ref={popRef}
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden bg-white ring-1 ring-gray-200 shadow-[0_24px_64px_-24px_rgba(0,0,0,.2)] dark:bg-[#111114]/96 dark:ring-white/10 dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,.65)] backdrop-blur-xl"
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
                        ? "text-gray-900 bg-gray-100 dark:text-white dark:bg-white/6"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/6",
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
  tagFilterOptions,
  initialSort = "",
  initialTags = [],
  size = "normal",
  setSort,
  setTags,
}: SearchProps) => {
  const [selectedSort, setSelectedSort] = useState<string>(initialSort ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags ?? []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempTags, setTempTags] = useState<string[]>(selectedTags);
  const [showUserResults, setShowUserResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  const { data: userSearchResults, isLoading: isSearchingUsers } = useQuery({
    queryKey: ["userSearch", searchTerm],
    queryFn: async () => {
      const result = await SearchUsers(searchTerm);
      return result;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (searchTerm.length >= 2) setShowUserResults(true);
    else setShowUserResults(false);
  }, [searchTerm]);

  useEffect(() => {
    if (showDropdown) {
      setSort(selectedSort || "");
      setTempTags(selectedTags || []);
    }
  }, [showDropdown, selectedSort, selectedTags]);

  useOnClickOutside(
    [dropdownRef as any, containerRef as any],
    () => setShowDropdown(false),
    showDropdown
  );

  const toggleTempTag = (v: string) =>
    setTempTags((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const activeFilterCount = useMemo(
    () => (selectedSort ? 1 : 0) + selectedTags.length,
    [selectedSort, selectedTags]
  );

  const users = userSearchResults?.data?.users || [];

  const hasValidData =
    userSearchResults &&
    typeof userSearchResults === "object" &&
    userSearchResults !== null &&
    "data" in userSearchResults &&
    userSearchResults.data &&
    typeof userSearchResults.data === "object" &&
    "users" in userSearchResults.data;

  const popupWidth = useElementWidth(containerRef, 720, 24);

  useEffect(() => {
    setTags(tempTags);
  }, [tempTags]);

  const H = size === "compact" ? "h-10" : "h-12";
  const BTN = size === "compact" ? "h-9 w-9" : "h-10 w-10";
  const GAP = size === "compact" ? "gap-0.5" : "gap-1";
  const INPUT_TXT = size === "compact" ? "text-[14px]" : "text-[15px]";
  const RIGHT_PAD = size === "compact" ? "pr-20" : "pr-24";
  const RIGHT_INSET = size === "compact" ? "right-1.5" : "right-2";

  return (
    <div className="relative w-full max-w-[760px]" ref={containerRef}>
      <div
        className={[
          `relative bg-white/90 dark:bg-[#232023]/90 ${H} rounded-2xl backdrop-blur-md ring-1 ring-gray-200 dark:ring-white/10`,
          `flex items-center px-2 ${GAP}`,
          "shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_10px_30px_-12px_rgba(0,0,0,.15)]",
          "dark:shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_10px_30px_-12px_rgba(0,0,0,.65)]",
        ].join(" ")}
      >
        <button
          onClick={onSubmit}
          aria-label="Tìm kiếm"
          className={`${BTN} grid place-items-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5`}
        >
          {typeof searchIcon === "string" ? (
            <img src={searchIcon} alt="" className="w-4 h-4 opacity-85" />
          ) : (
            searchIcon ?? <SearchIcon className="w-4 h-4 opacity-85" />
          )}
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm…"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
          className={[
            "flex-1 h-full bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 outline-none px-1",
            INPUT_TXT,
            RIGHT_PAD,
          ].join(" ")}
        />

        <div
          className={`absolute inset-y-0 ${RIGHT_INSET} flex items-center ${GAP}`}
        >
          {searchTerm && (
            <button
              onClick={() => onSearchTermChange("")}
              aria-label="Xóa"
              title="Xóa"
              className={`${BTN} grid place-items-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5`}
            >
              {typeof clearIcon === "string" ? (
                <img src={clearIcon} alt="" className="w-4 h-4 opacity-80" />
              ) : (
                clearIcon ?? <XIcon className="w-4 h-4 opacity-80" />
              )}
            </button>
          )}

          <button
            onClick={() => setShowDropdown((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={showDropdown}
            aria-label="Bộ lọc tìm kiếm"
            title="Bộ lọc"
            className={`relative ${BTN} grid place-items-center rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/5`}
          >
            {typeof filterIcon === "string" ? (
              <img src={filterIcon} alt="" className="w-5 h-5 opacity-85" />
            ) : (
              filterIcon ?? <SearchIcon className="w-5 h-5 opacity-85" />
            )}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-[#ff6f45] text-white text-[10px] leading-5 text-center ring-1 ring-white/20">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showUserResults && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-zinc-800 bg-[#1c1c1f] shadow-xl z-[9999] max-h-96 overflow-y-auto">
          {isSearchingUsers ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto" />
              <p className="text-gray-400 mt-2 text-sm">Đang tìm kiếm...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="p-2">
              {users.map((user: UserSearchResult) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex-1">
                    <ClickableUserInfo
                      userId={user.id}
                      username={user.username}
                      displayName={user.displayName}
                      avatarUrl={user.avatarUrl}
                      size="medium"
                      showUsername={true}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <FollowButton targetUserId={user.id} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.length >= 2 && hasValidData ? (
            <div className="p-4 text-center">
              <p className="text-gray-400 text-sm">Không tìm thấy kết quả</p>
            </div>
          ) : null}
        </div>
      )}

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-[calc(100%+10px)] rounded-3xl bg-white ring-1 ring-gray-200 shadow-[0_40px_120px_-30px_rgba(0,0,0,.2)] dark:bg-[#0f1115]/95 dark:ring-white/10 dark:shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)] backdrop-blur-2xl z-50 p-5 text-gray-800 dark:text-white"
          style={{
            width: popupWidth || undefined,
            minWidth: Math.min(320, popupWidth || 320),
          }}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-zinc-400 uppercase">
                Sắp xếp theo
              </span>
              {initialSort && (
                <button
                  onClick={() => setSort("")}
                  className="text-xs text-gray-500 hover:text-gray-700 transition dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Bỏ sắp xếp
                </button>
              )}
            </div>
            <ModernSelect
              value={initialSort}
              onChange={setSort}
              options={Array.isArray(sortOptions) ? sortOptions : []}
              placeholder="Không sắp xếp"
            />
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text:[11px] font-semibold tracking-wide text-gray-500 dark:text-zinc-400 uppercase">
                Tag (chọn nhiều)
              </span>
              {tempTags.length > 0 && (
                <button
                  onClick={() => setTempTags([])}
                  className="text-xs text-gray-500 hover:text-gray-700 transition dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Bỏ chọn tất cả
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tagFilterOptions
                ?.filter((tag) => !tempTags.includes(tag.value))
                .map((tag) => (
                  <TagChip
                    key={tag.value}
                    onClick={() => toggleTempTag(tag.value)}
                  >
                    {tag.label}
                  </TagChip>
                ))}
            </div>
            {tempTags.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500 dark:text-zinc-400 uppercase">
                  Đã chọn
                </div>
                <div className="flex flex-wrap gap-2">
                  {tempTags.map((t) => {
                    const label =
                      tagFilterOptions?.find((x) => x.value === t)?.label || t;
                    return (
                      <TagChip
                        key={`sel-${t}`}
                        active
                        onRemove={() => toggleTempTag(t)}
                      >
                        {label}
                      </TagChip>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSort("");
                setTempTags([]);
              }}
              className="text-xs px-3 py-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white/90 dark:hover:bg-white/10 transition"
            >
              Đặt lại
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDropdown(false)}
                className="h-8 px-4 rounded-full text-xs text-gray-600 ring-1 ring-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:ring-gray-300 dark:text-zinc-400 dark:ring-white/10 dark:hover:text-white dark:hover:bg-white/10 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onApplyFilters?.({
                    sort: initialSort || "",
                    tags: tempTags || [],
                  });
                  setSelectedSort(initialSort || "");
                  setSelectedTags(tempTags || []);
                  setShowDropdown(false);
                }}
                className="h-8 px-4 rounded-full text-xs font-semibold text-white bg-[#ff6f45] hover:bg-[#e85d37] active:scale-[0.97] transition dark:text-black dark:bg:white dark:hover:bg-white/90"
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
