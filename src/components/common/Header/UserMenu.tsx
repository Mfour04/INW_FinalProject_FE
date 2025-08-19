import { Link, useNavigate } from "react-router-dom";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import Person from "@mui/icons-material/Person";
import History from "@mui/icons-material/History";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../context/ToastContext/toast-context";

type Props = { onClose: () => void };

export const UserMenu = ({ onClose }: Props) => {
  const { auth, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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

  if (!auth?.user) return null;

  return (
    <div className="absolute top-[90px] right-12 mt-2 w-[260px] rounded-2xl border border-zinc-800 bg-[#111114] text-white shadow-2xl z-50 p-4">
      <div className="flex items-center gap-3">
        <div className="h-[52px] w-[52px] rounded-full overflow-hidden ring-1 ring-zinc-700 bg-white">
          <img
            src={auth.user.avatarUrl || DefaultAvatar}
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">
            {auth.user.displayName}
          </div>
          <div className="text-xs text-zinc-400 truncate">
            @{auth.user.userName}
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-300">
            <span className="flex items-center gap-1">
              🥇 {auth.user.badgeId.length ?? 0}
            </span>
            <span className="flex items-center gap-1">🔥 1</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-amber-300 font-bold text-sm">
          🪙 {(auth.user.coin ?? 0).toLocaleString("vi-VN")}
        </div>
        <button
          onClick={handleDepositClick}
          className="rounded-full px-3 py-1 text-xs font-semibold text-white
                     bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]
                     hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]
                     shadow-[0_8px_24px_rgba(255,103,64,0.35)] transition"
        >
          Nạp thêm
        </button>
      </div>

      <div className="mt-4 pt-3 space-y-2 text-sm border-t border-zinc-800">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-orange-400 transition"
        >
          <Person /> <span>Trang cá nhân</span>
        </Link>
        <button
          onClick={handleTransactionHistoryClick}
          className="flex items-center gap-2 hover:text-orange-400 transition"
        >
          <History /> <span>Lịch sử giao dịch</span>
        </button>
        <Link to="/setting" className="flex items-center gap-2 cursor-pointer hover:text-orange-400">
          <Settings /> <span>Cài đặt</span>
        </Link>
      </div>

      <button
        onClick={handleLogoutClick}
        className="mt-3 w-full rounded-lg border border-zinc-800 py-2 text-sm text-zinc-300 hover:text-red-400 hover:border-red-400 transition flex items-center justify-center gap-2"
      >
        <Logout /> <span>Đăng xuất</span>
      </button>
    </div>
  );
};
