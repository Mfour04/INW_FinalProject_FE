import { useState } from "react";
import { motion } from "framer-motion";
import { DarkModeToggler } from "../../../components/DarkModeToggler";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import SearchBar from "../AdminModal/SearchBar";
import ActionButtons from "../AdminModal/ActionButtons";
import DataTable from "../AdminModal/DataTable";
import Pagination from "../AdminModal/Pagination";
import UserTopSection from "./UserTopSection";
import type { User } from "../../../api/Admin/User/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetAllUsers,
  GetUsers,
  UpdateBanUser,
} from "../../../api/Admin/User/user.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { formatTicksToDateString } from "../../../utils/date_format";

interface SortConfig {
  key: keyof User;
  direction: "asc" | "desc";
}

interface DialogState {
  isOpen: boolean;
  type: "lock" | "unlock" | null;
  title: string;
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

const UserList = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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

  const mappedAllUsers: User[] =
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
    })) || [];

  const updateBanUserMutation = useMutation({
    mutationFn: ({
      userIds,
      isBanned,
      durationType,
    }: {
      userIds: string[];
      isBanned: boolean;
      durationType: string;
    }) =>
      UpdateBanUser({ userIds, isBanned, durationType }).then(
        (res) => res.data
      ),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["allUsers"] }); // Invalidate allUsers query
        toast?.onOpen(data.message);
      } else {
        toast?.onOpen(data.message || "Cập nhật trạng thái khóa thất bại");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái khóa";
      toast?.onOpen(message);
      console.error("Failed to update ban status:", error);
    },
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === mappedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(mappedUsers.map((user) => user.userId));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key: key as keyof User,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (userData?.data?.totalPages || 1)) {
      setCurrentPage(page);
      setSelectedUsers([]);
    }
  };

  const handleLockUnlock = () => {
    const selectedUserObjects = mappedUsers.filter((user) =>
      selectedUsers.includes(user.userId)
    );
    const allBanned = selectedUserObjects.every((user) => user.isBanned);
    const action = allBanned ? "unlock" : "lock";
    const title = `Bạn muốn ${
      action === "lock" ? "khóa" : "mở khóa"
    } tài khoản: ${selectedUserObjects.map((u) => u.displayName).join(", ")} ?`;
    setDialog({ isOpen: true, type: action, title });
  };

  const handleConfirmDialog = (durationType?: string) => {
    if (dialog.type === "lock") {
      updateBanUserMutation.mutate({
        userIds: selectedUsers,
        isBanned: true,
        durationType: durationType || "",
      });
      console.log(
        `Thực hiện lock với thời hạn: ${
          durationType || "không xác định"
        } cho user: ${selectedUsers.join(", ")}`
      );
    } else if (dialog.type === "unlock") {
      updateBanUserMutation.mutate({
        userIds: selectedUsers,
        isBanned: false,
        durationType: "",
      });
      console.log(`Thực hiện unlock cho user: ${selectedUsers.join(", ")}`);
    }
    setSelectedUsers([]);
    setDialog({ isOpen: false, type: null, title: "" });
  };

  const selectedUserObjects = mappedUsers.filter((user) =>
    selectedUsers.includes(user.userId)
  );
  const canLock = selectedUserObjects.every((user) => !user.isBanned);
  const canUnlock = selectedUserObjects.every((user) => user.isBanned);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý người dùng
        </h1>
        <DarkModeToggler />
      </div>
      {isLoadingUsers || isLoadingAllUsers ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : userError || allUsersError ? (
        <p className="text-red-600">Failed to load users</p>
      ) : (
        <>
          <UserTopSection users={mappedAllUsers} />
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <ActionButtons
              canLock={canLock}
              canUnlock={canUnlock}
              selectedCount={selectedUsers.length}
              onLockUnlock={handleLockUnlock}
            />
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
          <DataTable
            data={mappedUsers}
            selectedItems={selectedUsers}
            sortConfig={sortConfig}
            onSelectItem={handleSelectUser}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            type="user"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={userData?.data?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, type: null, title: "" })}
        onConfirm={handleConfirmDialog}
        title={dialog.title}
        isLockAction={dialog.type === "lock"}
        type="user"
      />
    </motion.div>
  );
};

export default UserList;
