import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X, Coins, Info, CheckCircle2 } from "lucide-react";

type Tone = "default" | "danger" | "purchase" | "info" | "success" | "warning";

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  tone?: Tone;
  icon?: React.ReactNode;
  showClose?: boolean;
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
      case "warning":
        return {
          iconWrap: "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400",
          confirmBtn:
            "bg-yellow-500/80 hover:bg-yellow-500 text-white " +
            "focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-500",
          defaultIcon: <AlertTriangle className="w-5 h-5" />,
        };
      default:
        return {
          iconWrap: "bg-[#ff6740]/15 text-[#ff6740]",
          confirmBtn:
            "bg-[#ff6740] hover:brightness-95 text-white " +
            "dark:bg-[#ff6740] dark:hover:brightness-110",
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
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm"
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
            "bg-white text-zinc-900 ring-zinc-200",
            "dark:bg-zinc-900 dark:text-zinc-100 dark:ring-white/10",
          ].join(" ")}
        >
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
              className={[
                "h-9 px-4 rounded-lg text-sm font-semibold",
                toneStyles.confirmBtn,
              ].join(" ")}
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
