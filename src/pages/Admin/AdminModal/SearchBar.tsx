import { useRef, useEffect } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearch }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Duy trì focus sau re-render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative w-full max-w-[300px]">
      <input
        ref={inputRef}
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-2 pl-8 text-sm rounded-md bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-[#ff4d4f]"
      />
      <svg
        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
