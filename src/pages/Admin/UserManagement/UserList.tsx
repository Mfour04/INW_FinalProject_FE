import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import SearchBar from "../AdminModal/SearchBar";
import DataTable from "../AdminModal/DataTable";
import Pagination from "../AdminModal/Pagination";
import UserTopSection from "./UserTopSection";
import type { User } from "../../../api/Admin/User/user.type";
import {
  GetAllUsers,
  GetUsers,
  UpdateBanUser,
} from "../../../api/Admin/User/user.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { formatTicksToDateString } from "../../../utils/date_format";
import { UserDetailModal } from "../AdminModal/UserDetailModal";

interface SortConfig {
  key: keyof User;
  direction: "asc" | "desc";
}
interface DialogState {
  isOpen: boolean;
  type: "lock" | "unlock" | null;
  title: string;
  userId: string | null;
  durationType?: string;
}

const usersPerPage = 10;

const keyToApiField: Record<keyof User, string> = {
  userId: "userId",
  userName: "userName",
  displayName: "displayName",
  email: "email",
  avatarUrl: "avatarUrl",
  coverUrl: "coverUrl",
  bio: "bio",
  role: "role",
  isVerified: "isVerified",
  isBanned: "isBanned",
  bannedUntil: "bannedUntil",
  coin: "coin",
  blockCoin: "blockCoin",
  novelFollowCount: "novelFollowCount",
  badgeId: "badgeId",
  lastLogin: "lastLogin",
  favouriteType: "favouriteType",
  readCount: "readCount",
  createdAt: "createAt",
  updatedAt: "updateAt",
};

const MemoizedUserTopSection = memo(UserTopSection);
const MemoizedPagination = memo(Pagination);

const UserList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { darkMode } = useDarkMode();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "displayName",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: null,
    title: "",
    userId: null,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const sortBy = `${keyToApiField[sortConfig.key]}:${sortConfig.direction}`;

  // Paged users
  const {
    data: userData,
    isLoading: isLoadingUsers,
    error: userError,
  } = useQuery({
    queryKey: ["users", { searchTerm, currentPage, sortBy }],
    queryFn: () =>
      GetUsers({
        searchTerm: searchTerm.trim() || undefined,
        page: currentPage - 1,
        limit: usersPerPage,
        sortBy,
      }).then((res) => res.data),
  });

  // All users for KPI + TopSection
  const {
    data: allUsersData,
    isLoading: isLoadingAllUsers,
    error: allUsersError,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => GetAllUsers().then((res) => res.data),
  });

  const mappedUsers: User[] =
    userData?.data?.users?.map((u: any) => ({
      userId: u.userId,
      userName: u.userName,
      displayName: u.displayName,
      email: u.email,
      avatarUrl: u.avatarUrl,
      coverUrl: u.coverUrl,
      bio: u.bio,
      role: u.role,
      isVerified: u.isVerified,
      isBanned: u.isBanned,
      bannedUntil: u.bannedUntil,
      coin: u.coin,
      blockCoin: u.blockCoin,
      novelFollowCount: u.novelFollowCount,
      badgeId: u.badgeId,
      lastLogin: u.lastLogin,
      favouriteType: u.favouriteType,
      readCount: u.readCount ?? 0,
      createdAt: formatTicksToDateString(Number(u.createAt)),
      updatedAt: formatTicksToDateString(Number(u.updateAt)),
    })) || [];

  // Map for KPIs/Top
  const mappedAllUsers: User[] = useMemo(
    () =>
      allUsersData?.data?.users?.map((u: any) => ({
        userId: u.userId,
        userName: u.userName,
        displayName: u.displayName,
        email: u.email,
        avatarUrl: u.avatarUrl,
        coverUrl: u.coverUrl,
        bio: u.bio,
        role: u.role,
        isVerified: u.isVerified,
        isBanned: u.isBanned,
        bannedUntil: u.bannedUntil,
        coin: u.coin,
        blockCoin: u.blockCoin,
        novelFollowCount: u.novelFollowCount,
        badgeId: u.badgeId,
        lastLogin: u.lastLogin,
        favouriteType: u.favouriteType,
        readCount: u.readCount ?? 0,
        createdAt: formatTicksToDateString(Number(u.createAt)),
        updatedAt: formatTicksToDateString(Number(u.updateAt)),
      })) || [],
    [allUsersData]
  );

  // KPIs
  const kTotal = mappedAllUsers.length;
  const kVerified = mappedAllUsers.filter((u) => u.isVerified).length;
  const kBanned = mappedAllUsers.filter((u) => u.isBanned).length;
  const kReads = mappedAllUsers.reduce(
    (s, u) => s + (Number(u.readCount) || 0),
    0
  );

  // Ban/unban
  const updateBanUserMutation = useMutation({
    mutationFn: ({
      userId,
      isBanned,
      durationType,
    }: {
      userId: string;
      isBanned: boolean;
      durationType: string;
    }) =>
      UpdateBanUser({ userIds: [userId], isBanned, durationType }).then(
        (res) => res.data
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast?.onOpen(data.message);
      setDialog({ isOpen: false, type: null, title: "", userId: null });
    },
    onError: (error: any) => {
      toast?.onOpen({ message: error?.message || "Cập nhật trạng thái khóa thất bại", variant: "error"});
      setDialog({ isOpen: false, type: null, title: "", userId: null });
    },
  });

  const handleSort = (key: string) =>
    setSortConfig((prev) => ({
      key: key as keyof User,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (userData?.data?.totalPages || 1))
      setCurrentPage(page);
  };

  const handleLockUnlock = (userId: string, isBanned: boolean) => {
    const user = mappedUsers.find((u) => u.userId === userId);
    const action = isBanned ? "unlock" : "lock";
    const title = `Bạn muốn ${
      action === "lock" ? "khóa" : "mở khóa"
    } tài khoản: ${user?.displayName} ?`;
    setDialog({ isOpen: true, type: action, title, userId });
  };

  const handleConfirmDialog = (extra?: {
    duration?: string;
    note?: string;
  }) => {
    if (dialog.userId && dialog.type) {
      const isBanned = dialog.type === "lock";
      // durationType gửi lên API: lấy trực tiếp từ dialog (nếu cần) hoặc từ extra.duration
      const durationType = extra?.duration || dialog.durationType || "";
      updateBanUserMutation.mutate({
        userId: dialog.userId,
        isBanned,
        durationType,
      });
    }
  };

  const handleClickUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetail(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`min-h-screen p-6 ${
        darkMode ? "bg-[#0a0f16] text-white" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Giám sát số liệu và thao tác nhanh với tài khoản.
          </p>
        </div>
        <button
          onClick={() => refetchAll()}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur hover:bg-white dark:hover:bg-white/15 transition"
          title="Làm mới thống kê"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            <path d="M21 3v6h-6" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* KPI row */}
      <div className="mb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Tổng người dùng" value={kTotal.toLocaleString()} />
        <KpiCard label="Đã xác minh" value={kVerified.toLocaleString()} />
        <KpiCard label="Đang bị khóa" value={kBanned.toLocaleString()} />
        <KpiCard label="Tổng lượt đọc" value={kReads.toLocaleString()} />
      </div>

      {/* Top section */}
      <div className="mb-6">
        {isLoadingAllUsers ? (
          <SkeletonTop />
        ) : allUsersError ? (
          <StateCard
            tone="error"
            title="Không thể tải danh sách người dùng"
            desc="Vui lòng thử lại sau."
          />
        ) : (
          <MemoizedUserTopSection users={mappedAllUsers} />
        )}
      </div>

      <div className="top-0 z-10 -mx-6 mb-4 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#0a0f16]/60">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>
      </div>

      {isLoadingUsers ? (
        <div className="p-6">
          <SkeletonTable />
        </div>
      ) : userError ? (
        <div className="p-6">
          <StateCard
            tone="error"
            title="Không thể tải danh sách người dùng"
            desc="Vui lòng thử lại."
          />
        </div>
      ) : mappedUsers.length === 0 ? (
        <div className="p-8">
          <StateCard
            tone="empty"
            title="Không có kết quả"
            desc="Thử từ khóa khác."
          />
        </div>
      ) : (
        <>
          <div className="relative pb-2">
            <DataTable
              data={mappedUsers}
              sortConfig={sortConfig}
              onSort={handleSort}
              type="user"
              onLockUnlockUser={handleLockUnlock}
              onDetailUser={handleClickUserDetail}
            />
          </div>
          <div className="flex items-center justify-center mt-2">
            <MemoizedPagination
              currentPage={currentPage}
              totalPages={userData?.data?.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={() =>
          setDialog({ isOpen: false, type: null, title: "", userId: null })
        }
        onConfirm={handleConfirmDialog}
        title={dialog.title}
        // dùng API mới:
        variant={dialog.type === "lock" ? "danger" : "success"}
        showDuration={dialog.type === "lock"} // mở dropdown thời hạn khi KHÓA
        showNote={dialog.type === "lock"} // tuỳ bạn: bật ô ghi chú khi KHÓA
        loading={updateBanUserMutation.isPending}
      />
      <UserDetailModal
        onClose={() => setIsDetail(false)}
        open={isDetail}
        user={selectedUser}
      />
    </motion.div>
  );
};

export default UserList;

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-white/5 p-3 shadow-sm backdrop-blur">
      <div className="text-sm text-zinc-600 dark:text-zinc-300">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function StateCard({
  tone,
  title,
  desc,
}: {
  tone: "error" | "empty";
  title: string;
  desc: string;
}) {
  const isError = tone === "error";
  return (
    <div
      className={[
        "rounded-xl border p-4",
        isError
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
      ].join(" ")}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm mt-0.5">{desc}</div>
    </div>
  );
}

function SkeletonTop() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 backdrop-blur"
        >
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse mb-3" />
          <div className="space-y-2.5">
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                <div className="h-9 w-9 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                </div>
                <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/40 animate-pulse"
        />
      ))}
    </div>
  );
}
