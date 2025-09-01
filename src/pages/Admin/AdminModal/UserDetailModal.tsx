import type { User } from "../../../api/Admin/User/user.type";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import {
  X,
  AtSign,
  Mail,
  Coins,
  Lock,
  BadgeCheck,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

type UserDetailModalProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
};

export const UserDetailModal = ({ user, open, onClose }: UserDetailModalProps) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
      <div className="w-full max-w-md rounded-xl bg-white ring-1 ring-zinc-200">
        {/* Cover + Avatar overlay */}
        <div className="relative">
          <div className="h-28 w-full overflow-hidden rounded-t-xl">
            {user.coverUrl ? (
              <img src={user.coverUrl} alt="cover" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-zinc-200 to-zinc-300" />
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/95 text-zinc-700 ring-1 ring-zinc-200 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Avatar tuyệt đối, chồng lên cover */}
          <div className="absolute inset-x-0 -bottom-8 z-10 flex justify-center">
            <img
              src={user.avatarUrl || DefaultAvatar}
              alt={user.displayName}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
          </div>
        </div>

        {/* Header */}
        <div className="px-4 pt-12 pb-4">
          <div className="flex flex-col items-center">
            <h2 className="text-[15px] font-semibold text-zinc-900">{user.displayName}</h2>
            <div className="mt-0.5 flex items-center text-[12px] text-zinc-500">
              <span>@{user.userName}</span>
            </div>
            {user.bio && (
              <p className="mt-2 line-clamp-3 text-center text-[12.5px] text-zinc-600">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 pb-4 text-[12.5px] space-y-2">
          {/* Email: riêng 1 hàng */}
          <div className="flex items-center gap-2 rounded-lg ring-1 ring-zinc-200 px-3 py-2">
            <Mail className="h-4 w-4 text-zinc-500" />
            <span className="truncate">{user.email}</span>
          </div>

          {/* Xu + Khóa: gộp 1 hàng */}
          <div className="flex items-center gap-2 rounded-lg ring-1 ring-zinc-200 px-3 py-2">
            <Coins className="h-4 w-4 text-amber-600" />
            <div className="flex w-full items-center justify-between gap-2">
              <span>Xu {user.coin?.toLocaleString?.() ?? user.coin}</span>
              <span className="inline-flex items-center gap-1 text-zinc-500">
                <Lock className="h-3.5 w-3.5" />
                Khóa {user.blockCoin?.toLocaleString?.() ?? user.blockCoin}
              </span>
            </div>
          </div>

          {/* Hoạt động + Đã xác minh: cùng 1 hàng (2 cột) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg ring-1 ring-zinc-200 px-3 py-2">
              {user.isBanned ? (
                <>
                  <ShieldX className="h-4 w-4 text-rose-600" />
                  <span className="text-rose-600">Bị chặn</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">Hoạt động</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-lg ring-1 ring-zinc-200 px-3 py-2">
              <BadgeCheck className={user.isVerified ? "h-4 w-4 text-sky-600" : "h-4 w-4 text-zinc-400"} />
              <span>{user.isVerified ? "Đã xác minh" : "Chưa xác minh"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
