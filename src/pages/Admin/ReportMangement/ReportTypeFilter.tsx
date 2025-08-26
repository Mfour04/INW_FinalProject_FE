import { ReportTypeStatus } from "../../../api/Admin/Report/report.type";

interface ReportTypeFilterProps {
  activeFilter: ReportTypeStatus | "All";
  onFilter: (value: ReportTypeStatus | "All") => void;
}

const ReportTypeFilter = ({
  activeFilter,
  onFilter,
}: ReportTypeFilterProps) => {
  const options = [
    { value: "All" as const, label: "Tất cả" },
    { value: 5, label: "Người dùng" },
    { value: 0, label: "Tiểu thuyết" },
    { value: 1, label: "Chương" },
    { value: 2, label: "Bình luận" },
    { value: 3, label: "Bài viết diễn đàn" },
    { value: 4, label: "Bình luận diễn đàn" },
  ];

  return (
    <div className="relative w-full sm:w-40 max-w-full">
      <select
        value={activeFilter}
        onChange={(e) =>
          onFilter(
            e.target.value === "All"
              ? "All"
              : (parseInt(e.target.value) as ReportTypeStatus)
          )
        }
        className="w-full max-w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] appearance-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default ReportTypeFilter;
