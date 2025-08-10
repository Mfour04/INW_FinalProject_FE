import LockIcon from "../../../assets/img/AdminSidebar/square-lock-02-stroke-rounded.svg";
import UnlockIcon from "../../../assets/img/AdminSidebar/square-unlock-01-stroke-rounded.svg";

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
  selectedCount,
  onLockUnlock,
  onApprove,
  onReject,
  isLoading,
}: ActionButtonsProps) => {
  const LockUnlockIcon = canLock ? LockIcon : canUnlock ? UnlockIcon : LockIcon;

  return (
    <div className="flex gap-2">
      {(canLock || canUnlock) && (
        <button
          onClick={onLockUnlock}
          disabled={
            isLoading || (selectedCount === 0 && !canLock && !canUnlock)
          }
          className={`px-4 py-2 rounded-[5px] bg-[#ff6740] text-white hover:bg-[#e14b2e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[35px]`}
        >
          <img
            src={LockUnlockIcon}
            alt={canLock ? "Lock" : canUnlock ? "Unlock" : "Lock/Unlock"}
            className="w-5 h-5"
          />
        </button>
      )}
      {canApprove && (
        <button
          onClick={onApprove}
          disabled={isLoading}
          className={`px-4 py-2 rounded-[5px] bg-[#ff6740] text-white hover:bg-[#e14b2e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[35px]`}
        >
          Duyệt
        </button>
      )}
      {canReject && (
        <button
          onClick={onReject}
          disabled={isLoading}
          className={`px-4 py-2 rounded-[5px] bg-[#ff6740] text-white hover:bg-[#e14b2e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[35px]`}
        >
          Từ chối
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
