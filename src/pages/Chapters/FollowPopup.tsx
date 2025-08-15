import { useState } from "react";

type FollowStatus = "Đang đọc" | "Sẽ đọc" | "Hoàn thành";

type FollowPopupProps = {
  notify: boolean;
  status: number;
  onNotifyChange?: () => void;
  onStatusChange?: (status: number) => void;
  onUnfollow?: () => void;
  onClose?: () => void;
};

export const FollowPopup = ({
  notify: initialNotify,
  status: initialStatus,
  onNotifyChange,
  onStatusChange,
  onUnfollow,
  onClose,
}: FollowPopupProps) => {
  const [notify, setNotify] = useState(initialNotify);
  const [status, setStatus] = useState<number>(initialStatus);
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions: FollowStatus[] = ["Đang đọc", "Sẽ đọc", "Hoàn thành"];

  return (
    <div className="absolute z-50 right-0 top-0 mt-12 bg-[#2e2e2e] text-white px-4 py-2 rounded-md w-[228px] shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <span>Thông báo</span>
        <button
          className={`w-10 h-5 rounded-full flex items-center px-1 ${
            notify ? "bg-[#ff6740]" : "bg-gray-400"
          }`}
          onClick={() => {
            setNotify((prev) => !prev);
            onNotifyChange?.();
          }}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              notify ? "translate-x-4" : ""
            }`}
          />
        </button>
      </div>

      <div className="relative mb-2">
        <div className="flex justify-between items-center mb-1">
          <p className="mr-2">Trạng thái</p>
          <button
            className="bg-[#444] px-3 py-1 w-[55%] rounded text-left"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {statusOptions[status]}
          </button>
        </div>
        {showDropdown && (
          <div className="absolute bg-[#555] min-w-[55%] right-0 mt-1 rounded shadow z-10">
            {statusOptions.map((option, index) => (
              <div
                key={option}
                className="px-3 py-1 hover:bg-[#666] cursor-pointer"
                onClick={() => {
                  setStatus(index);
                  onStatusChange?.(index);
                  setShowDropdown(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="text-red-500 hover:underline mt-2 w-full text-center"
        onClick={onUnfollow}
      >
        Bỏ theo dõi
      </button>
    </div>
  );
};
