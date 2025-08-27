import { useEffect, useRef } from "react";

type WithdrawConfirmModalProps = {
  isOpen: boolean;
  coinAmount: number;
  vndAmount: number;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const WithdrawConfirmModal = ({
  isOpen,
  coinAmount,
  vndAmount,
  onCancel,
  onConfirm,
  loading = false,
}: WithdrawConfirmModalProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = "withdraw-confirm-title";
  const descId = "withdraw-confirm-desc";

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onCancel, onConfirm]);

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        className={[
          "relative z-10 w-[min(92vw,520px)] rounded-2xl",
          "bg-white/80 dark:bg-zinc-900/80",
          "shadow-[0_25px_80px_rgba(0,0,0,0.25)]",
          "ring-1 ring-black/10 dark:ring-white/10",
          "backdrop-blur-xl overflow-hidden",
          "animate-[modalPop_.18s_ease-out]",
        ].join(" ")}
      >
        <div className="relative px-5 pt-5">
          <div
            className="absolute inset-x-0 -top-20 h-32 pointer-events-none select-none opacity-70 blur-2xl
                          bg-[radial-gradient(40%_60%_at_50%_0%,rgba(255,103,64,0.35),transparent_70%)]"
          />
          <h3
            id={titleId}
            className="relative text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Xác nhận rút xu
          </h3>
          <p
            id={descId}
            className="relative mt-2 text-sm text-gray-700 dark:text-zinc-300"
          >
            Bạn muốn rút{" "}
            <span className="font-semibold text-[#ff6740]">
              {coinAmount.toLocaleString("vi-VN")} Xu
            </span>{" "}
            (tương đương{" "}
            <span className="font-semibold">
              {vndAmount.toLocaleString("vi-VN")} VND
            </span>
            )?
          </p>
          <div className="relative mt-1.5 text-[12px] text-gray-500 dark:text-zinc-400">
            Hệ thống sẽ xử lý trước 23:59 cùng ngày. Vui lòng không spam.
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

        {/* Action area */}
        <div className="px-5 py-4 flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className={[
              "h-9 px-4 rounded-lg text-sm font-semibold",
              "bg-white hover:bg-zinc-50 text-gray-800",
              "ring-1 ring-zinc-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
              "dark:bg-zinc-800 dark:text-white dark:ring-white/10 dark:hover:bg-zinc-700",
            ].join(" ")}
          >
            Hủy
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "h-9 px-5 rounded-lg text-sm font-semibold text-white",
              "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
              "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
              "shadow-[0_10px_24px_rgba(255,103,64,0.45)] hover:shadow-[0_14px_32px_rgba(255,103,64,0.60)]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff784f]/60",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "relative overflow-hidden",
            ].join(" ")}
          >
            {/* Spinner khi loading */}
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                Đang xử lý…
              </span>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>

      <style>
        {`
        @keyframes modalPop {
          from { transform: translateY(6px) scale(.98); opacity: .0; }
          to   { transform: translateY(0) scale(1);   opacity: 1; }
        }
      `}
      </style>
    </div>
  );
};
