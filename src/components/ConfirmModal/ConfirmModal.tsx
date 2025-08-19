import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

type Tone = "default" | "danger";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string; 
  message: string | React.ReactNode; 
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  tone?: Tone;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Xóa bài viết",
  message = "Bạn có chắc chắn muốn xóa mục này không?\nThao tác này không thể hoàn tác.",
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  tone = "danger",
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    cancelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  const isDanger = tone === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            onClick={onCancel}
            aria-label="Đóng hộp thoại"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.70),rgba(0,0,0,0.88))] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ y: 14, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl overflow-hidden bg-[rgba(16,18,24,0.92)] ring-1 ring-white/12 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] text-white">
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "shrink-0 h-10 w-10 grid place-items-center rounded-xl ring-1 ring-white/10",
                      isDanger
                        ? "bg-[conic-gradient(from_220deg,_#ff5544_0%,_#ff9966_40%,_#2b2f3a_100%)]"
                        : "bg-[conic-gradient(from_220deg,_#4f80ff_0%,_#66d1ff_40%,_#2b2f3a_100%)]",
                    ].join(" ")}
                  >
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>

                  <h3 id="confirm-modal-title" className="text-[16px] font-semibold leading-none">
                    {title}
                  </h3>

                  <button
                    onClick={onCancel}
                    className="ml-auto inline-grid place-items-center -mt-4 h-7 w-7 rounded-full bg-white/8 hover:bg-white/12 ring-1 ring-white/15 transition"
                    aria-label="Đóng"
                    title="Đóng"
                  >
                    <X className="h-3.5 w-3.5 text-white/85" />
                  </button>
                </div>

                {typeof message === "string" ? (
                  <p className="mt-3 text-[13px] leading-5 text-white/80 whitespace-pre-line">
                    {message}
                  </p>
                ) : (
                  <div className="mt-3 text-[13px] leading-5 text-white/80">
                    {message}
                  </div>
                )}
              </div>

              <div className="px-5">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <div className="px-5 py-4 flex items-center justify-end gap-2">
                <button
                  ref={cancelRef}
                  onClick={onCancel}
                  className="h-9 px-3.5 rounded-full text-[13px] font-medium
                             bg-white/[0.03] hover:bg-white/[0.07]
                             ring-1 ring-white/12 transition"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  className="h-9 px-4 rounded-full text-[13px] font-semibold text-white
                             shadow-sm shadow-black/30
                             bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]
                             hover:brightness-110 active:brightness-95 transition"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
