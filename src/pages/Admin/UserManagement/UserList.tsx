import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { memo } from "react";

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

// Memo hóa UserTopSection
const MemoizedUserTopSection = memo(UserTopSection);

// Memo hóa Pagination
const MemoizedPagination = memo(Pagination);

const UserList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
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

  const sortBy = `${keyToApiField[sortConfig.key]}:${sortConfig.direction}`;

  // Fetch users for DataTable (paginated)
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

  // Fetch all users for UserTopSection (no pagination)
  const {
    data: allUsersData,
    isLoading: isLoadingAllUsers,
    error: allUsersError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => GetAllUsers().then((res) => res.data),
  });

  // Map API user data to User interface for DataTable
  const mappedUsers: User[] =
    userData?.data?.users?.map((user) => ({
      userId: user.userId,
      userName: user.userName,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      bio: user.bio,
      role: user.role,
      isVerified: user.isVerified,
      isBanned: user.isBanned,
      bannedUntil: user.bannedUntil,
      coin: user.coin,
      blockCoin: user.blockCoin,
      novelFollowCount: user.novelFollowCount,
      badgeId: user.badgeId,
      lastLogin: user.lastLogin,
      favouriteType: user.favouriteType,
      readCount: user.readCount ?? 0,
      createdAt: formatTicksToDateString(Number(user.createAt)),
      updatedAt: formatTicksToDateString(Number(user.updateAt)),
    })) || [];

  // Memo hóa mappedAllUsers để tránh tính toán lại
  const mappedAllUsers: User[] = useMemo(
    () =>
      allUsersData?.data?.users?.map((user) => ({
        userId: user.userId,
        userName: user.userName,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
        bannedUntil: user.bannedUntil,
        coin: user.coin,
        blockCoin: user.blockCoin,
        novelFollowCount: user.novelFollowCount,
        badgeId: user.badgeId,
        lastLogin: user.lastLogin,
        favouriteType: user.favouriteType,
        readCount: user.readCount ?? 0,
        createdAt: formatTicksToDateString(Number(user.createAt)),
        updatedAt: formatTicksToDateString(Number(user.updateAt)),
      })) || [],
    [allUsersData]
  );

  // Mutation for ban/unban
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
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        toast?.onOpen(data.message);
      } else {
        toast?.onOpen(data.message || "Cập nhật trạng thái khóa thất bại");
      }
    },
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key: key as keyof User,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (userData?.data?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleLockUnlock = (userId: string, isBanned: boolean) => {
    const user = mappedUsers.find((u) => u.userId === userId);
    const action = isBanned ? "unlock" : "lock";
    const title = `Bạn muốn ${
      action === "lock" ? "khóa" : "mở khóa"
    } tài khoản: ${user?.displayName} ?`;
    setDialog({ isOpen: true, type: action, title, userId });
  };

  const handleConfirmDialog = (durationType?: string) => {
    if (dialog.userId && dialog.type) {
      const isBanned = dialog.type === "lock";
      updateBanUserMutation.mutate({
        userId: dialog.userId,
        isBanned,
        durationType: durationType || "",
      });
    }
    setDialog({ isOpen: false, type: null, title: "", userId: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen text-gray-900 dark:text-white"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        {/* <DarkModeToggler /> */}
      </div>
      {isLoadingAllUsers ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : allUsersError ? (
        <p className="text-red-600 dark:text-red-400">Failed to load users</p>
      ) : (
        <>
          <MemoizedUserTopSection users={mappedAllUsers} />
          <div className="flex justify-end items-center mb-4 flex-wrap gap-2">
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
          {isLoadingUsers ? (
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 text-[#ff4d4f] mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Loading...
              </p>
            </div>
          ) : userError ? (
            <p className="text-red-600 dark:text-red-400">
              Failed to load users
            </p>
          ) : (
            <>
              <DataTable
                data={mappedUsers}
                sortConfig={sortConfig}
                onSort={handleSort}
                type="user"
                onLockUnlockUser={handleLockUnlock}
              />
              <MemoizedPagination
                currentPage={currentPage}
                totalPages={userData?.data?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={() =>
          setDialog({ isOpen: false, type: null, title: "", userId: null })
        }
        onConfirm={handleConfirmDialog}
        title={dialog.title}
        isLockAction={dialog.type === "lock"}
        type="user"
      />
    </motion.div>
  );
};

export default UserList;
