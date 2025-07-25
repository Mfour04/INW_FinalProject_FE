import { motion, AnimatePresence } from "framer-motion";
import Button from "../ButtonComponent";
interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title = "Xác nhận",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#1e1e21] text-white rounded-lg shadow-lg p-6 w-[350px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Xác nhận hành động"
          >
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <p className="text-sm mb-6">{message}</p>
            <div className="flex justify-end gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  isLoading={false}
                  onClick={onConfirm}
                  className="px-4 py-2 rounded text-white bg-[#ff6740] hover:bg-orange-600 text-sm border-none"
                >
                  Xác nhận
                </Button>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm transition-colors duration-200"
              >
                Hủy
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
