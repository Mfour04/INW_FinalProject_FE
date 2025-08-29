import { Lock, Unlock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  canLock?: boolean;
  canUnlock?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  selectedCount?: number;
  onLockUnlock?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
}

const ActionButtons = ({
  canLock,
  canUnlock,
  canApprove,
  canReject,
  selectedCount = 0,
  onLockUnlock,
  onApprove,
  onReject,
  isLoading,
}: ActionButtonsProps) => {
  const showLockUnlock = Boolean(canLock || canUnlock);
  const lockMode = canLock ? "lock" : canUnlock ? "unlock" : null;

  const baseBtn =
    "inline-flex items-center justify-center gap-2 h-8 px-3 rounded-lg text-sm font-medium transition " +
    "disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff6740]/30";

  const primary =
    "bg-[#ff6740] text-white hover:bg-[#e65d37]";

  const subtle =
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

  const iconCls = "w-4 h-4";
  const pill =
    "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 text-xs " +
    "text-zinc-600 dark:text-zinc-300 dark:border-white/10";

  return (
    <div className="flex items-center gap-2">
      {/* (Optional) Selected count pill for quick context when đặt component riêng lẻ */}
      {/* Có thể bỏ nếu đã hiển thị ở vị trí khác */}
      {/* <span className={pill}>Đã chọn: <span className="font-semibold ml-1">{selectedCount}</span></span> */}

      {/* Lock / Unlock */}
      {showLockUnlock && (
        <button
          type="button"
          onClick={onLockUnlock}
          disabled={isLoading || (!selectedCount && !(canLock || canUnlock))}
          className={[baseBtn, primary].join(" ")}
          title={lockMode === "lock" ? "Khóa chương đã chọn" : lockMode === "unlock" ? "Mở khóa chương đã chọn" : "Khóa/Mở khóa"}
          aria-label={lockMode === "lock" ? "Khóa" : lockMode === "unlock" ? "Mở khóa" : "Khóa/Mở khóa"}
        >
          {isLoading ? (
            <Loader2 className={`${iconCls} animate-spin`} />
          ) : lockMode === "lock" ? (
            <Lock className={iconCls} />
          ) : (
            <Unlock className={iconCls} />
          )}
          {/* Ẩn label nếu chỉ muốn icon: */}
          {/* <span className="sr-only">{lockMode === "lock" ? "Khóa" : "Mở khóa"}</span> */}
        </button>
      )}

      {/* Approve */}
      {canApprove && (
        <button
          type="button"
          onClick={onApprove}
          disabled={isLoading}
          className={[baseBtn, subtle].join(" ")}
          title="Duyệt"
          aria-label="Duyệt"
        >
          {isLoading ? (
            <Loader2 className={`${iconCls} animate-spin`} />
          ) : (
            <CheckCircle2 className={iconCls} />
          )}
          <span className="hidden sm:inline">Duyệt</span>
        </button>
      )}

      {/* Reject */}
      {canReject && (
        <button
          type="button"
          onClick={onReject}
          disabled={isLoading}
          className={[baseBtn, subtle].join(" ")}
          title="Từ chối"
          aria-label="Từ chối"
        >
          {isLoading ? (
            <Loader2 className={`${iconCls} animate-spin`} />
          ) : (
            <XCircle className={iconCls} />
          )}
          <span className="hidden sm:inline">Từ chối</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
