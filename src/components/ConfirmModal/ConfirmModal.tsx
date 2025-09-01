// ConfirmModal.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X, Coins, Info, CheckCircle2 } from "lucide-react";

type Tone = "default" | "danger" | "purchase" | "info" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  tone?: Tone;
  /** Tuỳ chọn icon header (ghi đè icon theo tone). */
  icon?: React.ReactNode;
  /** Ẩn/hiện nút đóng (X) */
  showClose?: boolean;
  /** Cho phép click nền để đóng (mặc định true) */
  dismissOnOverlay?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Xác nhận",
  message = "Bạn có chắc muốn thực hiện hành động này?",
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  tone = "default",
  icon,
  showClose = true,
  dismissOnOverlay = true,
}) => {
  if (!isOpen) return null;

  // Khóa scroll khi mở modal
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const toneStyles = (() => {
    switch (tone) {
      case "danger":
        return {
          iconWrap: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
          confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white",
          defaultIcon: <AlertTriangle className="w-5 h-5" />,
        };
      case "purchase":
        return {
          // dùng brand/coin cho mua
          iconWrap: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
          confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white",
          defaultIcon: <Coins className="w-5 h-5" />,
        };
      case "info":
        return {
          iconWrap: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
          confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
          defaultIcon: <Info className="w-5 h-5" />,
        };
      case "success":
        return {
          iconWrap: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
          confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white",
          defaultIcon: <CheckCircle2 className="w-5 h-5" />,
        };
      default:
        return {
          iconWrap: "bg-zinc-200 text-zinc-700 dark:bg-white/10 dark:text-white",
          confirmBtn: "bg-zinc-900 hover:bg-black text-white dark:bg-white/20 dark:hover:bg-white/30",
          defaultIcon: <Info className="w-5 h-5" />,
        };
    }
  })();

  const overlay = (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={dismissOnOverlay ? onCancel : undefined}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
          className={[
            "w-[420px] max-w-[92vw] rounded-2xl shadow-2xl ring-1 p-5",
            "bg-white text-zinc-900 ring-black/10",
            "dark:bg-[#111318] dark:text-white dark:ring-white/10",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <div className={["p-2 rounded-full", toneStyles.iconWrap].join(" ")}>
                {icon ?? toneStyles.defaultIcon}
              </div>
              <h2 id="confirm-title" className="text-base sm:text-lg font-semibold">
                {title}
              </h2>
            </div>
            {showClose && (
              <button
                onClick={onCancel}
                className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Message */}
          <div className="mb-5">
            {typeof message === "string" ? (
              <p
                id="confirm-desc"
                className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-line"
              >
                {message}
              </p>
            ) : (
              message
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className={[
                "h-9 px-4 rounded-lg text-sm font-medium",
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
                "dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
              ].join(" ")}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={["h-9 px-4 rounded-lg text-sm font-semibold", toneStyles.confirmBtn].join(" ")}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
};

export default ConfirmModal;
