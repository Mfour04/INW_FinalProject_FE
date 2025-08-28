import { useRef, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const DEBOUNCE_MS = 250;

const SearchBar = ({ searchTerm, onSearch }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(searchTerm);
  const timerRef = useRef<number | null>(null);

  // Sync từ prop -> state
  useEffect(() => {
    setValue(searchTerm);
  }, [searchTerm]);

  // Auto focus khi mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce gọi onSearch
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onSearch(value.trimStart());
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  const handleClear = () => {
    setValue("");
    onSearch(""); // gọi ngay khi clear
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-[260px]">
      <div
        className={[
          "relative rounded-lg border bg-white/80 dark:bg-[#111317]/80 backdrop-blur",
          "border-zinc-200 dark:border-white/10",
          "shadow-sm focus-within:shadow-md transition-all",
          "focus-within:border-[#ff6740]/60 focus-within:ring-2 focus-within:ring-[#ff6740]/30",
        ].join(" ")}
      >
        {/* Icon search */}
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />

        {/* Input nhỏ gọn */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm…"
          aria-label="Tìm kiếm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={[
            "w-full h-9 pr-16 pl-8",
            "bg-transparent outline-none",
            "text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400",
            "rounded-lg",
          ].join(" ")}
        />

        {/* Nút clear */}
        {value && (
          <button
            onClick={handleClear}
            title="Xóa"
            aria-label="Xóa tìm kiếm"
            className={[
              "absolute right-1.5 top-1/2 -translate-y-1/2",
              "h-6 w-6 flex items-center justify-center rounded-md",
              "bg-zinc-100 hover:bg-zinc-200 text-zinc-700",
              "dark:bg-white/10 dark:hover:bg-white/15 dark:text-zinc-200",
              "transition-colors",
            ].join(" ")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
