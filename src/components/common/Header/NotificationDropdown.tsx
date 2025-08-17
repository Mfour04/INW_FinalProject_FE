import type { GetUserNotificationRes } from "../../../api/Notification/noti.type";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import { formatTicksToRelativeTime } from "../../../utils/date_format";

interface NotificationDropdownProps {
  notifications?: GetUserNotificationRes[];
}

export const NotificationDropdown = ({
  notifications,
}: NotificationDropdownProps) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-[#18191A] text-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="px-4 py-2 font-semibold border-b border-gray-700">
        Thông báo
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications?.map((noti) => (
          <div
            key={noti.notificationId}
            className="flex items-start gap-3 px-4 py-3 hover:bg-[#3A3B3C] cursor-pointer"
          >
            <img
              src={DefaultAvatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm">{noti.message}</p>
              <span className="text-xs text-gray-400">
                {formatTicksToRelativeTime(noti.createAt)}
              </span>
            </div>
            {!noti.isRead && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
