import { useState } from "react";

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

  return (
    <div className="w-full sm:w-64 max-w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Tìm kiếm báo cáo..."
        className="w-full max-w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1a1c] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]"
      />
    </div>
  );
};

export default ReportSearchBar;
