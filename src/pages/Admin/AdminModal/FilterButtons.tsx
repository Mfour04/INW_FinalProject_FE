import type { ReportStatus } from "../../../api/Admin/Report/report.type";

interface FilterButtonsProps {
  filters: { label: string; value: ReportStatus | "All" }[];
  activeFilter: ReportStatus | "All";
  onFilter: (value: ReportStatus | "All") => void;
}

const FilterButtons = ({
  filters,
  activeFilter,
  onFilter,
}: FilterButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 max-w-fit">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilter(filter.value)}
          className={`min-w-0 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeFilter === filter.value
              ? "bg-[#ff4d4f] text-white"
              : "bg-gray-200 text-gray-600 dark:bg-[#2a2a2c] dark:text-gray-300"
          } hover:underline`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
