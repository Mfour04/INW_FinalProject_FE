import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { UpdateActionRequest } from "../../../api/Admin/Report/report.type";

const ReportStatus = {
  0: "Đang chờ xử lý",
  1: "Đã xử lý",
  2: "Từ chối báo cáo",
  3: "Bỏ qua",
} as const;

const ModerationAction = {
  0: "Không làm gì",
  1: "Ẩn tài nguyên",
  2: "Xóa tài nguyên",
  3: "Cảnh cáo tác giả",
  4: "Tạm khóa tài khoản tác giả",
  5: "Cấm vĩnh viễn tài khoản tác giả",
} as const;

export interface ReportActionPopupProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportId: string, data: UpdateActionRequest) => void;
}

const initialActionRequest: UpdateActionRequest = {
  action: 0,
  status: 0,
  moderatorNote: "",
};

export const ReportActionModal = ({
  reportId,
  isOpen,
  onClose,
  onSubmit,
}: ReportActionPopupProps) => {
  const [actionRequest, setActionRequest] =
    useState<UpdateActionRequest>(initialActionRequest);

  const handleSubmit = () => {
    onSubmit(reportId, actionRequest);
    setActionRequest(initialActionRequest);
    onClose();
  };

  const handleCloseClick = () => {
    setActionRequest(initialActionRequest);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-[#1a1a1c] p-6 rounded-xl shadow-lg w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Xử lý báo cáo
            </h2>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Trạng thái
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 mb-4 bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white"
              value={actionRequest.status}
              onChange={(e) =>
                setActionRequest((prev) => ({
                  ...prev,
                  status: Number(e.target.value),
                }))
              }
            >
              {Object.entries(ReportStatus).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Hành động
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 mb-4 bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white"
              value={actionRequest.action}
              onChange={(e) =>
                setActionRequest((prev) => ({
                  ...prev,
                  action: Number(e.target.value),
                }))
              }
            >
              {Object.entries(ModerationAction).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Ghi chú
            </label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white mb-4"
              rows={3}
              value={actionRequest.moderatorNote}
              onChange={(e) =>
                setActionRequest((prev) => ({
                  ...prev,
                  moderatorNote: e.target.value,
                }))
              }
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                onClick={handleCloseClick}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                onClick={handleSubmit}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
