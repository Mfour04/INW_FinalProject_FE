import { motion, AnimatePresence } from "framer-motion";

interface ReportPopupProps {
  type: "post" | "comment";
  id: string;
  setReportId: (value: string | null) => void;
}

const ReportPopup = ({ type, id, setReportId }: ReportPopupProps) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-60 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center"
      onClick={() => setReportId(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Báo cáo ${type === "post" ? "bài viết" : "bình luận"}`}
      >
        <h3 className="text-lg font-bold mb-4">
          Báo cáo {type === "post" ? "bài viết" : "bình luận"}
        </h3>
        <p className="text-sm text-[#ccc] mb-4">Tính năng đang phát triển.</p>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setReportId(null)}
            className="px-4 py-2 bg-[#ff6740] hover:bg-[#e55a36] rounded text-sm transition-colors duration-200"
          >
            Đóng
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default ReportPopup;