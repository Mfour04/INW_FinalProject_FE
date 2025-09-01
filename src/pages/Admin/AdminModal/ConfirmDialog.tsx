import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Clock,
  ChevronDown,
  Check,
  FileText,
} from "lucide-react";

export type Variant = "neutral" | "success" | "danger";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (extra?: { duration?: string; note?: string }) => void;
  title: string;
  subtitle?: string;
  variant?: Variant;
  showDuration?: boolean;
  showNote?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  type?: string;
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};
const BaseBtn = forwardRef<HTMLButtonElement, BtnProps>(
  ({ loading, children, className = "", ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      disabled={loading || rest.disabled}
      aria-busy={loading ? "true" : "false"}
      className={[
        "h-8 px-3.5 py-1.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6740]/40",
        "transition-colors",
        loading ? "opacity-70 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      {children}
    </button>
  )
);
BaseBtn.displayName = "BaseBtn";

const spring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 36,
  mass: 0.65,
};
const DURATIONS = [
  "12 tiếng",
  "1 ngày",
  "3 ngày",
  "7 ngày",
  "15 ngày",
  "30 ngày",
  "Vĩnh viễn",
] as const;

const tone = (v: Variant) => {
  switch (v) {
    case "success":
      return {
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
        cta: "bg-emerald-600 hover:bg-emerald-500 text-white",
      };
    case "danger":
      return {
        icon: <ShieldAlert className="w-6 h-6 text-rose-500" />,
        cta: "bg-rose-600 hover:bg-rose-500 text-white",
      };
    default:
      return {
        icon: <AlertTriangle className="w-6 h-6 text-[#ff6740]" />,
        cta: "bg-[#ff6740] hover:bg-[#e14b2e] text-white",
      };
  }
};

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
  type,
}: ConfirmDialogProps) => {
  const t = tone(variant);
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<string>(DURATIONS[0]);
  const [note, setNote] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const selectBtnRef = useRef<HTMLButtonElement>(null);
  const selectListRef = useRef<HTMLDivElement>(null);

  const currentIdx = useMemo(
    () =>
      Math.max(
        0,
        DURATIONS.findIndex((d) => d === duration)
      ),
    [duration]
  );
  const isNovel = type === "novel";

  useEffect(() => {
    if (isOpen) confirmRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!openSelect) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !selectBtnRef.current?.contains(e.target as Node) &&
        !selectListRef.current?.contains(e.target as Node)
      ) {
        setOpenSelect(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openSelect]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        (last as HTMLElement).focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        (first as HTMLElement).focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && !loading) onClose();
  };

  const onKeyDownDialog = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      if (openSelect) {
        setOpenSelect(false);
        return;
      }
      if (!loading) onClose();
    }
    if (e.key === "Enter" && !openSelect) {
      e.preventDefault();
      if (!loading) handleConfirm();
    }
  };

  const onKeyDownSelect = (e: React.KeyboardEvent) => {
    if (!openSelect) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpenSelect(true);
        setActiveIndex(currentIdx);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpenSelect(false);
      selectBtnRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % DURATIONS.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + DURATIONS.length) % DURATIONS.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const idx = activeIndex === -1 ? currentIdx : activeIndex;
      commitSelect(idx);
      return;
    }
  };

  const commitSelect = (idx: number) => {
    if (idx < 0 || idx >= DURATIONS.length) return;
    setDuration(DURATIONS[idx]);
    setOpenSelect(false);
    selectBtnRef.current?.focus();
  };

  const handleConfirm = () => {
    onConfirm({
      duration: showDuration ? duration : undefined,
      note: showNote ? note.trim() : undefined,
    });
  };

  const headerClass = isNovel
    ? "flex items-center gap-3 p-5 border-b border-zinc-200 dark:border-white/10"
    : "flex items-center gap-3 px-5 pt-5 pb-0";

  const footerClass = isNovel
    ? "flex justify-end gap-2 px-5 py-4 border-t border-zinc-200 dark:border-white/10"
    : "flex justify-end gap-2 px-5 pt-0 pb-4";

  const ariaDescribedBy =
    !isNovel && (subtitle || showDuration || showNote)
      ? "cd-subtitle"
      : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            ref={overlayRef}
            onMouseDown={closeOnBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] backdrop-blur-sm bg-black/40"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cd-title"
            aria-describedby={ariaDescribedBy}
            onKeyDown={onKeyDownDialog}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={spring}
            className="fixed inset-0 z-[1001] grid place-items-center px-4"
          >
            <div
              ref={dialogRef}
              className="w-full max-w-md rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#0b0e13]/90 backdrop-blur shadow-xl"
            >
              <div className={headerClass}>
                <div className="shrink-0 p-2 rounded-xl bg-white/70 dark:bg-white/10 border border-zinc-200/60 dark:border-white/10">
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <h3
                    id="cd-title"
                    className="text-md font-semibold text-zinc-900 dark:text-white"
                  >
                    {title}
                  </h3>
                  {!isNovel && subtitle && (
                    <p
                      id="cd-subtitle"
                      className="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="ml-auto inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-white/10 focus-visible:ring-2"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isNovel && (
                <div className="p-5 space-y-4">
                  {showDuration && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-200">
                        Thời hạn khóa
                      </label>
                      <div className="relative" onKeyDown={onKeyDownSelect}>
                        <button
                          ref={selectBtnRef}
                          type="button"
                          disabled={loading}
                          onClick={() => !loading && setOpenSelect((s) => !s)}
                          aria-haspopup="listbox"
                          aria-expanded={openSelect}
                          className={[
                            "w-full h-11 rounded-xl border pl-10 pr-8 text-left",
                            "bg-white/80 dark:bg-zinc-900/70",
                            "border-zinc-200 dark:border-white/10",
                            "text-zinc-900 dark:text-white",
                            "focus:outline-none focus:ring-2 focus:ring-[#ff6740]/40",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                          ].join(" ")}
                        >
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                            <Clock className="w-4 h-4" />
                          </span>
                          <span className="truncate">{duration}</span>
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </button>

                        <AnimatePresence>
                          {openSelect && (
                            <motion.div
                              ref={selectListRef}
                              role="listbox"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.14 }}
                              className={[
                                "absolute z-20 mt-1 w-full rounded-xl overflow-hidden",
                                "border border-zinc-200 dark:border-white/10",
                                "bg-white/95 dark:bg-[#0b0e13]/95 backdrop-blur",
                                "shadow-xl",
                              ].join(" ")}
                            >
                              <div className="max-h-56 overflow-auto overscroll-contain">
                                {DURATIONS.map((opt, idx) => {
                                  const selected = opt === duration;
                                  const active =
                                    idx === activeIndex ||
                                    (activeIndex === -1 && selected);
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      role="option"
                                      aria-selected={selected}
                                      onMouseEnter={() => setActiveIndex(idx)}
                                      onClick={() => commitSelect(idx)}
                                      className={[
                                        "w-full text-left px-3 py-2.5 text-sm flex items-center gap-2",
                                        active
                                          ? "bg-zinc-100/80 dark:bg-white/10"
                                          : "bg-transparent",
                                        selected
                                          ? "font-semibold text-zinc-900 dark:text-white"
                                          : "text-zinc-700 dark:text-zinc-200",
                                      ].join(" ")}
                                    >
                                      <span className="inline-flex items-center justify-center w-5">
                                        {selected ? (
                                          <Check className="w-4 h-4" />
                                        ) : null}
                                      </span>
                                      <span className="truncate">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {showNote && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-200">
                        Ghi chú / Lý do
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          maxLength={500}
                          placeholder="(Tuỳ chọn) Nhập ghi chú…"
                          className={[
                            "w-full rounded-xl pl-9 pr-3 py-2",
                            "bg-white/80 dark:bg-zinc-900/70",
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

              <div className={footerClass}>
                <BaseBtn
                  onClick={onClose}
                  loading={false}
                  disabled={loading}
                  className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white"
                >
                  {cancelLabel ?? "Hủy"}
                </BaseBtn>

                <BaseBtn
                  ref={confirmRef}
                  onClick={handleConfirm}
                  loading={loading}
                  className={t.cta}
                >
                  {confirmLabel ??
                    (variant === "danger"
                      ? "Xác nhận"
                      : variant === "success"
                      ? "Duyệt"
                      : "Đồng ý")}
                </BaseBtn>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
