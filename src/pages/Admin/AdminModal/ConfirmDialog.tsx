import { useState } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import Button from "../../../components/ButtonComponent";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (durationType?: string) => void;
  title: string;
  isLockAction: boolean;
  type?: "novel" | "user" | "request";
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLockAction,
  type,
  isLoading,
}: ConfirmDialogProps) => {
  const { darkMode } = useDarkMode();
  const [durationType, setDurationType] = useState<string>("12 tiếng");

  const durationOptions = [
    { label: "12 tiếng", value: "12 tiếng" },
    { label: "1 ngày", value: "1 ngày" },
    { label: "3 ngày", value: "3 ngày" },
    { label: "7 ngày", value: "7 ngày" },
    { label: "15 ngày", value: "15 ngày" },
    { label: "30 ngày", value: "30 ngày" },
    { label: "Vĩnh viễn", value: "Vĩnh viễn" },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className={`rounded-[10px] shadow-lg p-6 max-w-sm w-full border ${
          darkMode
            ? "bg-[#1a1a1c] text-white border-gray-700"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {isLockAction && type === "user" && (
          <div className="mb-4">
            <label
              className={`block text-sm mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Thời hạn
            </label>
            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
              disabled={isLoading}
              className={`w-full p-2 rounded-[10px] border focus:outline-none focus:border-[#ff6740] ${
                darkMode
                  ? "bg-[#2c2c2c] text-white border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-[10px] ${
              darkMode
                ? "bg-[#2c2c2c] text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Hủy
          </button>
          <Button
            isLoading={isLoading}
            onClick={() =>
              onConfirm(
                type === "user" && isLockAction ? durationType : undefined
              )
            }
            className={`px-4 py-2 rounded-[10px] bg-[#ff6740] text-white hover:bg-[#e14b2e] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Xác nhận
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDialog;
