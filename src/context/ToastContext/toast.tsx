import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { ToastContext, type ToastInput, type ToastVariant } from "./toast-context";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";
import "./toast.css";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
  exiting?: boolean;
};

const VARIANT_STYLES: Record<
  ToastVariant,
  { bar: string; icon: JSX.Element }
> = {
  info: {
    bar: "from-sky-500 to-sky-400",
    icon: <Info className="h-5 w-5 text-sky-500" />,
  },
  success: {
    bar: "from-emerald-500 to-emerald-400",
    icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  },
  warning: {
    bar: "from-amber-500 to-amber-400",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  error: {
    bar: "from-rose-500 to-rose-400",
    icon: <XCircle className="h-5 w-5 text-rose-500" />,
  },
};

function ToastCard({
  item,
  onDone,
}: {
  item: ToastItem;
  onDone: (id: number) => void;
}) {
  const { id, message, variant, duration, exiting } = item;
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (exiting) return;
    timerRef.current = window.setTimeout(() => onDone(id), duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, duration, exiting, onDone]);

  const { bar, icon } = VARIANT_STYLES[variant];

  return (
    <div
      className={[
        "pointer-events-auto w-[320px] max-w-[92vw]",
        "rounded-xl border border-zinc-200/70 dark:border-white/10",
        "bg-white/95 dark:bg-zinc-900/80 backdrop-blur-sm",
        "shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)]",
        "px-3.5 py-3 relative",
        exiting ? "toast-exit" : "toast-enter",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="absolute left-0 right-0 top-0 h-0.5">
        <div
          className={`h-full bg-gradient-to-r rounded-t-xl toast-progress ${bar}`}
          style={{ ["--toast-duration" as any]: `${duration}ms` }}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="flex-shrink-0">{icon}</span>
        <p className="flex-1 text-[13.5px] leading-5 text-zinc-900 dark:text-zinc-100 break-words">
          {message}
        </p>
        <button
          aria-label="Close"
          onClick={() => onDone(id)}
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/40 dark:hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactElement }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const openToast = (input: ToastInput) => {
    const payload = typeof input === "string" ? { message: input } : input;
    const t: ToastItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      message: payload.message,
      variant: payload.variant ?? "info",
      duration: Math.max(1200, payload.duration ?? 3000),
    };
    setToasts((prev) => [...prev, t]);
  };

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const closeToast = (id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    window.setTimeout(() => removeToast(id), 160);
  };

  const ctx = useMemo(
    () => ({ onOpen: openToast, onClose: closeToast }),
    []
  );

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 flex flex-col gap-3 items-end">
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDone={closeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
