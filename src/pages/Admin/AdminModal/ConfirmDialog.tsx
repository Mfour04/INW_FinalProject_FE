import { useEffect, useRef, useState, forwardRef } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { CheckCircle2, ShieldAlert, AlertTriangle, X, Loader2, Clock, FileText } from "lucide-react";

type Variant = "neutral" | "success" | "danger";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (extra?: { duration?: string; note?: string }) => void;

  title: string;
  subtitle?: string;

  /** success = duyệt, danger = từ chối, neutral = xác nhận chung */
  variant?: Variant;

  /** Hiện dropdown thời hạn (ví dụ khóa user) */
  showDuration?: boolean;

  /** Hiện ô “Ghi chú / Lý do” */
  showNote?: boolean;

  /** Nhãn nút */
  confirmLabel?: string;
  cancelLabel?: string;

  /** Trạng thái tải khi xác nhận */
  loading?: boolean;
}

/* ---------- Buttons (internal) ---------- */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  leftIcon?: React.ReactNode;
};
const BaseBtn = forwardRef<HTMLButtonElement, BtnProps>(
  ({ loading, leftIcon, children, className = "", ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      disabled={loading || rest.disabled}
      aria-busy={loading ? "true" : "false"}
      className={[
        "h-10 px-4 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2",
        "focus-visible:outline-none focus-visible:ring-2",
        loading ? "opacity-70 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      <span className="truncate">{children}</span>
    </button>
  )
);
BaseBtn.displayName = "BaseBtn";

/* ---------- Theming by variant ---------- */
const tone = (v: Variant) => {
  switch (v) {
    case "success":
      return {
        ring: "ring-emerald-500/30",
        chip: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        cta: "bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-emerald-400",
      };
    case "danger":
      return {
        ring: "ring-rose-500/30",
        chip: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
        icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
        cta: "bg-rose-600 hover:bg-rose-500 focus-visible:ring-rose-400",
      };
    default:
      return {
        ring: "ring-[#ff6740]/30",
        chip: "bg-white/10 text-white/80 ring-1 ring-white/15",
        icon: <AlertTriangle className="w-5 h-5 text-white/80" />,
        cta: "bg-[#ff6740] hover:bg-[#e14b2e] focus-visible:ring-[#ff6740]/40",
      };
  }
};

/* ---------- Animations ---------- */
const spring: Transition = { type: "spring", stiffness: 420, damping: 36, mass: 0.65 };

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  variant = "neutral",
  showDuration = false,
  showNote = false,
  confirmLabel,
  cancelLabel,
  loading = false,
}: ConfirmDialogProps) => {
  const t = tone(variant);
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const [duration, setDuration] = useState("12 tiếng");
  const [note, setNote] = useState("");

  // Always call hooks in same order; focus when open:
  useEffect(() => {
    if (isOpen) confirmRef.current?.focus();
  }, [isOpen]);

  const closeOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && !loading) onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter") {
      e.preventDefault();
      if (!loading) onConfirm({ duration: showDuration ? duration : undefined, note: showNote ? note.trim() : undefined });
    }
  };

  const durationOptions = [
    "12 tiếng",
    "1 ngày",
    "3 ngày",
    "7 ngày",
    "15 ngày",
    "30 ngày",
    "Vĩnh viễn",
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        ref={overlayRef}
        onMouseDown={closeOnBackdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        key="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cd-title"
        aria-describedby="cd-subtitle"
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={spring}
        className="fixed inset-0 z-[1001] grid place-items-center px-4"
      >
        <div
          className={[
            "w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden",
            // glass surface
            "bg-white/90 dark:bg-[#0b0e13]/80 backdrop-blur-xl",
            // gradient hairline border
            "border border-white/40 dark:border-white/10",
            // subtle ring by tone
            "ring-1", t.ring,
          ].join(" ")}
        >
          {/* Header */}
          <div className="p-5 pb-4 flex items-start gap-3">
            <div className={`shrink-0 rounded-xl p-2 ${t.chip}`}>
              {t.icon}
            </div>
            <div className="min-w-0">
              <h3 id="cd-title" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p id="cd-subtitle" className="mt-1 text-sm text-zinc-600 dark:text-zinc-300/90">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="ml-auto inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {(showDuration || showNote) && (
            <div className="px-5 pb-1 space-y-4">
              {showDuration && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-200">
                    Thời hạn
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={loading}
                      className={[
                        "w-full h-10 pl-9 pr-3 rounded-xl",
                        "bg-white/80 dark:bg-zinc-900/60",
                        "border border-zinc-200 dark:border-white/10",
                        "text-zinc-900 dark:text-white",
                        "focus:outline-none focus:ring-2 focus:ring-[#ff6740]/40",
                        loading ? "opacity-50 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {durationOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {showNote && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-200">
                    Ghi chú / Lý do
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Nhập ghi chú (tối đa 500 ký tự)…"
                      className={[
                        "w-full rounded-xl pl-9 pr-3 py-2",
                        "bg-white/80 dark:bg-zinc-900/60",
                        "border border-zinc-200 dark:border-white/10",
                        "text-zinc-900 dark:text-white",
                        "placeholder:text-zinc-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#ff6740]/40",
                      ].join(" ")}
                    />
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 text-right">
                      {note.length}/500
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="p-5 pt-3 flex items-center justify-end gap-2">
            <BaseBtn
              onClick={onClose}
              loading={loading}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white"
            >
              {cancelLabel ?? "Hủy"}
            </BaseBtn>

            <BaseBtn
              ref={confirmRef}
              loading={loading}
              onClick={() =>
                onConfirm({
                  duration: showDuration ? duration : undefined,
                  note: showNote ? note.trim() : undefined,
                })
              }
              className={["text-white", t.cta].join(" ")}
            >
              {confirmLabel ??
                (variant === "danger" ? "Xác nhận" : variant === "success" ? "Duyệt" : "Đồng ý")}
            </BaseBtn>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
