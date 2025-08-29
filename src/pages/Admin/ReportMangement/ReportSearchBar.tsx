import { useState } from "react";
import { Search, X } from "lucide-react";

interface ReportSearchBarProps {
  onSearch: (term: string) => void;
}

const ReportSearchBar = ({ onSearch }: ReportSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full sm:w-full max-w-full text-sm">
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4.5 h-4.5 text-zinc-400 group-focus-within:text-zinc-500 transition-colors" />
        </span>

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Tìm kiếm báo cáo..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl
                     bg-white/90 dark:bg-zinc-800
                     text-zinc-900 dark:text-zinc-100 placeholder-zinc-400
                     ring-1 ring-zinc-200 dark:ring-zinc-700
                     focus:outline-none focus:ring-2 focus:ring-zinc-400
                     shadow-sm"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full
                       text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200
                       hover:bg-zinc-200/40 dark:hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportSearchBar;
