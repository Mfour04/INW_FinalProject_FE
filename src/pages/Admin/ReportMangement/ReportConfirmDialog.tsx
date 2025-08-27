import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import Button from "../../../components/ButtonComponent";

interface ReportConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ReportConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ReportConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-auto mt-[12vh] w-full max-w-md rounded-2xl bg-white/95 text-zinc-900 ring-1 ring-zinc-200 shadow-2xl backdrop-blur dark:bg-[#0b0f14]/95 dark:text-zinc-100 dark:ring-white/12"
      >
        <div className="flex items-start gap-3 px-6 pt-6">
          <div className="mt-0.5 grid place-items-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200 h-10 w-10 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-300/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base md:text-lg font-semibold truncate">{title}</h2>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              Bạn có chắc muốn thực hiện hành động này?
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="ml-2 h-8 w-8 grid place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-200 dark:focus-visible:ring-white/25"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="my-5 h-px bg-zinc-200/90 dark:bg-white/12" />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-sm font-medium bg-zinc-100 text-zinc-800 ring-1 ring-zinc-300 hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/12 dark:hover:bg-white/15 dark:focus-visible:ring-white/25"
            >
              Hủy
            </button>
            <Button
              isLoading={false}
              onClick={onConfirm}
              className="h-10 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/50 dark:focus-visible:ring-orange-300/30"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmDialog;
