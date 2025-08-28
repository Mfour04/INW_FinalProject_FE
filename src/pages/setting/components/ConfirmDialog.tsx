import Button from "../../../components/ButtonComponent";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({ open, onConfirm, onCancel }: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" />

      <div
        className={[
          "relative w-[min(92vw,480px)] rounded-2xl p-5",
          "bg-white ring-1 ring-zinc-200 shadow-xl",
          "dark:bg-[#0f1115] dark:ring-white/10 dark:shadow-[0_20px_60px_-28px_rgba(0,0,0,0.8)]",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/15" />

        <h2
          id="confirm-title"
          className="text-[15px] font-semibold text-zinc-900 dark:text-white"
        >
          Rời khỏi trang?
        </h2>
        <p
          id="confirm-desc"
          className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          Bạn có thay đổi chưa lưu. Nếu rời khỏi, những thay đổi này sẽ bị mất.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={onCancel}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
              "bg-zinc-100 text-zinc-800 hover:bg-zinc-200/80",
              "dark:bg-white/8 dark:text-white dark:hover:bg-white/12",
            ].join(" ")}
          >
            Ở lại
          </Button>

          <Button
            onClick={onConfirm}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-semibold text-white transition",
              "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110",
              "shadow-sm shadow-black/10",
            ].join(" ")}
          >
            Rời khỏi
          </Button>
        </div>
      </div>
    </div>
  );
};
