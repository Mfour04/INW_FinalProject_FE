import type { User } from "../../../api/Admin/User/user.type";
import DefaultAvatar from "../../../assets/img/default_avt.png";

type UserDetailModalProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
};

export const UserDetailModal = ({
  user,
  open,
  onClose,
}: UserDetailModalProps) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-black">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="h-32 w-full relative">
          {user.coverUrl ? (
            <img
              src={user.coverUrl}
              alt="cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500" />
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
          >
            ✖
          </button>
        </div>

        <div className="flex flex-col items-center p-6">
          <img
            src={user.avatarUrl || DefaultAvatar}
            alt={user.displayName}
            className="w-24 h-24 rounded-full border-4 border-white shadow -mt-12"
          />
          <h2 className="mt-2 text-xl font-semibold">
            {user.displayName}{" "}
            {user.isVerified && <span className="text-blue-500">✔️</span>}
          </h2>
          <p className="text-gray-500">@{user.userName}</p>
          {user.bio && (
            <p className="mt-2 text-sm text-gray-600 text-center">{user.bio}</p>
          )}
        </div>

        <div className="px-6 pb-6 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Xu :</strong> {user.coin}
            </p>
            <p>
              <strong>Khóa xu:</strong> {user.blockCoin}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {user.isBanned ? "Bị chặn ❌" : "Hoạt động ✅"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
