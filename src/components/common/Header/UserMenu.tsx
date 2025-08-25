import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import { getAvatarUrl } from "../../../utils/avatar";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../context/ToastContext/toast-context";
import { User as UserIcon, Clock, Settings, LogOut, Coins } from "lucide-react";

type Props = { onClose: () => void };

const UserMenu: React.FC<Props> = ({ onClose }) => {
  const { auth, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Click outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onClose]);

  // ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!auth?.user) return null;

  const handleDepositClick = () => {
    onClose();
    navigate("/deposite");
  };
  const handleTransactionHistoryClick = () => {
    onClose();
    navigate("/transaction-history");
  };
  const handleLogoutClick = () => {
    logout();
    onClose();
    toast?.onOpen("Đăng xuất thành công!");
  };

  const avatarSrc = getAvatarUrl(auth.user.avatarUrl) || DefaultAvatar;
  const coins = (auth.user.coin ?? 0).toLocaleString("vi-VN");

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="User menu"
      className={[
        "w-[230px] mt-1 rounded-xl overflow-hidden",
        // light
        "bg-white text-slate-900 border border-slate-200 shadow-md",
        // dark
        "dark:bg-[#0f0f11] dark:text-white dark:border-white/10",
      ].join(" ")}
    >
      {/* Header: avatar nhỏ + tên */}
      <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-200 dark:border-white/10">
        <img
          src={avatarSrc}
          alt="avatar"
          className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-700"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{auth.user.displayName}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">@{auth.user.userName}</div>
        </div>
      </div>

      {/* Balance row (siêu gọn) */}
      <div className="px-3 pt-2 pb-1 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium
                     bg-amber-50 text-amber-700 ring-1 ring-amber-200
                     dark:bg-amber-500/10 dark:text-amber-300 dark:ring-0"
          title="Số dư xu"
        >
          <Coins className="h-3.5 w-3.5" />
          {coins}
        </span>

        <button
          onClick={handleDepositClick}
          className={[
            "ml-auto inline-flex items-center rounded-full px-4 py-0.5 text-[11px] font-semibold text-white",
            "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
            "transition-transform active:scale-95 hover:brightness-110"
          ].join(" ")}
        >
          Nạp
        </button>
      </div>

      {/* Actions: 3 dòng gọn */}
      <nav className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition"
        >
          <UserIcon className="h-4 w-4 text-slate-500 dark:text-white/70" />
          Trang cá nhân
        </Link>

        <button
          onClick={handleTransactionHistoryClick}
          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition"
        >
          <Clock className="h-4 w-4 text-slate-500 dark:text-white/70" />
          Lịch sử giao dịch
        </button>

        <Link
          to="/setting"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition"
        >
          <Settings className="h-4 w-4 text-slate-500 dark:text-white/70" />
          Cài đặt
        </Link>
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-white/10">
        <button
          onClick={handleLogoutClick}
          className="w-full rounded-md px-3 py-2 text-sm inline-flex items-center justify-center gap-2
                     text-slate-600 hover:bg-red-50 hover:text-red-600
                     dark:text-zinc-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </button>
      </div>

    </div>
  );
};

export default UserMenu;