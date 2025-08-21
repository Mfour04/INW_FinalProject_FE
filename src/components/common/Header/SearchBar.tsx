import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchUsers } from "../../../api/User/user-search.api";
import type { UserSearchResult } from "../../../api/User/user-search.type";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "../FollowButton";

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
  const [showUserResults, setShowUserResults] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Query để tìm kiếm user
  const { data: userSearchResults, isLoading: isSearchingUsers } = useQuery({
    queryKey: ["userSearch", searchTerm],
    queryFn: async () => {
      const result = await SearchUsers(searchTerm);
      return result;
    },
    enabled: searchTerm.length >= 2, // Chỉ gọi API khi searchTerm >= 2
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút (thay thế cacheTime)
    refetchOnWindowFocus: false, // Không refetch khi focus window
    refetchOnMount: false, // Không refetch khi mount
  });

  // Hiển thị kết quả tìm kiếm user khi có searchTerm
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setShowUserResults(true);
    } else {
      setShowUserResults(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (showDropdown) {
      setTempSort(selectedSort || "");
      setTempTags(selectedTags || []);
    }
  }, [showDropdown, selectedSort, selectedTags]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        showDropdown &&
        dropdownRef.current &&
        containerRef.current &&
        !dropdownRef.current.contains(t) &&
        !containerRef.current.contains(t)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showDropdown]);

  const toggleTempTag = (v: string) =>
    setTempTags((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const activeFilterCount = useMemo(
    () => (selectedSort ? 1 : 0) + selectedTags.length,
    [selectedSort, selectedTags]
  );

  const handleUserClick = (username: string) => {
    try {
      // Kiểm tra xem navigate có hoạt động không
      if (typeof navigate === 'function') {
        navigate(`/profile/${username}`);
        setShowUserResults(false);
        onSearchTermChange("");
      } else {
        // Fallback: sử dụng window.location
        window.location.href = `/profile/${username}`;
      }
    } catch (error) {
      // Fallback: sử dụng window.location
      window.location.href = `/profile/${username}`;
    }
  };

  const users = userSearchResults?.data?.users || [];

  // Thêm type guard để đảm bảo an toàn
  const hasValidData = userSearchResults &&
    typeof userSearchResults === 'object' &&
    userSearchResults !== null &&
    'data' in userSearchResults &&
    userSearchResults.data &&
    typeof userSearchResults.data === 'object' &&
    'users' in userSearchResults.data;

  return (
    <div className="relative w-full max-w-[650px]" ref={containerRef}>
      <div className="h-11 rounded-full bg-[#1c1c1f] flex items-center px-2 focus-within:ring-2">
        <button
          onClick={onSubmit}
          aria-label="Tìm kiếm"
          className="h-9 w-9 grid place-items-center rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition"
        >
          <img src={searchIcon} alt="" className="w-4 h-4 opacity-80" />
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm truyện, tác giả..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="flex-1 h-full bg-transparent text-white placeholder-zinc-400 outline-none px-2"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchTermChange("")}
            aria-label="Xóa"
            className="h-9 w-9 grid place-items-center rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition"
          >
            <img src={clearIcon} alt="" className="w-4 h-4 opacity-80" />
          </button>
        )}

        <button
          onClick={() => setShowDropdown((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={showDropdown}
          aria-label="Bộ lọc tìm kiếm"
          className="relative h-9 w-9 grid place-items-center rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition"
        >
          <img src={filterIcon} alt="" className="w-5 h-5 opacity-80" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-[#ff6740] text-white text-[10px] leading-4 text-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Dropdown kết quả tìm kiếm user */}
      {showUserResults && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-zinc-800 bg-[#1c1c1f] shadow-xl z-[9999] max-h-96 overflow-y-auto">
          {isSearchingUsers ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-400 mt-2 text-sm">Đang tìm kiếm...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="p-2">
              {users.map((user: UserSearchResult) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800/40 transition-colors"
                >
                  <div
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUserClick(user.username);
                    }}
                  >
                    <img
                      src={user.avatarUrl || ""}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <FollowButton
                      targetUserId={user.id}
                      size="small"
                      variant="outlined"
                    />
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
          className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl border border-zinc-800 bg-[#1c1c1f] shadow-xl z-50 p-4 space-y-4"
        >
          <div>
            <label className="block mb-1 text-[11px] font-semibold text-zinc-300">
              Sắp xếp theo
            </label>
            <div className="relative">
              <select
                value={tempSort ?? ""}
                onChange={(e) => setTempSort(e.target.value)}
                className="w-full h-10 rounded-lg bg-[#121214] text-white text-sm px-3 pr-9
                        ring-1 ring-zinc-800 focus:ring-2 focus:ring-[#ff6740]/70 outline-none transition
                        appearance-none [-webkit-appearance:none] [-moz-appearance:none] bg-none"
              >
                <option value="">Chọn kiểu sắp xếp</option>
                {(Array.isArray(sortOptions) ? sortOptions : []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                ▾
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[11px] font-semibold text-zinc-300">
              Tag (chọn nhiều)
            </label>
            <div className="flex flex-wrap gap-2">
              {MOCK_TAG_OPTIONS.map((tag) => {
                const active = tempTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    aria-pressed={active}
                    onClick={() => toggleTempTag(tag.value)}
                    className={[
                      "px-3 h-8 rounded-full text-xs font-medium transition relative overflow-hidden",
                      active
                        ? [
                          "text-white border-0",
                          "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
                          "hover:brightness-110",
                          "shadow-[0_8px_20px_rgba(255,103,64,0.35)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/60",
                          "before:content-[''] before:absolute before:inset-0",
                          "before:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]",
                          "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                        ].join(" ")
                        : "border border-zinc-700 text-zinc-300 bg-[#121214] hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/40",
                    ].join(" ")}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => {
                setTempSort("");
                setTempTags([]);
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Đặt lại
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDropdown(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSelectedSort(tempSort || "");
                  setSelectedTags(tempTags || []);
                  onApplyFilters?.({
                    sort: tempSort || "",
                    tags: tempTags || [],
                  });
                  setShowDropdown(false);
                }}
                className="rounded-full px-3 py-1.5 text-xs font-semibold bg-[#ffffff] hover:bg-[#f5f5f5] transition"
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
