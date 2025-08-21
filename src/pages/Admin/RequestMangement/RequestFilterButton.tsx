import { motion } from "framer-motion";
import { PaymentStatus } from "../../../api/Admin/Request/request.type";

// Định nghĩa props cho component
interface FilterOption {
  label: string;
  value: PaymentStatus | "All";
}

interface RequestFilterButtonsProps {
  filters: FilterOption[];
  activeFilter: PaymentStatus | "All";
  onFilter: (value: PaymentStatus | "All") => void;
}

// Định nghĩa variants cho animation của button
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const RequestFilterButtons = ({ filters, activeFilter, onFilter }: RequestFilterButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilter(filter.value)}
          className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-colors duration-200 ${
            activeFilter === filter.value
              ? "bg-[#ff4d4f] dark:bg-[#ff6740] text-white"
              : "bg-gray-200 dark:bg-[#2c2e2e] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
};

export default RequestFilterButtons;