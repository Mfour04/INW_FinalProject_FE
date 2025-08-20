import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { NovelAdmin } from "../../../api/Novels/novel.type";
import type { User } from "../../../api/Admin/User/user.type";
import { formatVietnamTimeFromTicks } from "../../../utils/date_format";

interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

interface DataTableProps<T> {
  data: T[];
  sortConfig: SortConfig<T>;
  onSort: (key: string) => void;
  type: "novel" | "user";
  onOpenChapterPopup?: (novelId: string) => void;
  onLockUnlockNovel?: (novelId: string, isLock: boolean) => void;
  onLockUnlockUser?: (userId: string, isBanned: boolean) => void;
}

const DataTable = <T extends NovelAdmin | User>({
  data,
  sortConfig,
  onSort,
  type,
  onOpenChapterPopup,
  onLockUnlockNovel,
  onLockUnlockUser,
}: DataTableProps<T>) => {
  const headers =
    type === "novel"
      ? [
          {
            key: "Title",
            label: "Tên truyện",
            width: "20%",
            minWidth: "150px",
          },
          {
            key: "AuthorName",
            label: "Tác giả",
            width: "15%",
            minWidth: "150px",
          },
          {
            key: "Status",
            label: "Trạng thái",
            width: "10%",
            minWidth: "100px",
          },
          {
            key: "IsPublic",
            label: "Công khai",
            width: "10%",
            minWidth: "80px",
            center: true,
          },
          {
            key: "IsLock",
            label: "Khóa",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "TotalViews",
            label: "Lượt xem",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "Followers",
            label: "Follow",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "RatingAvg",
            label: "Đánh giá",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "CreateAt",
            label: "Ngày tạo",
            width: "10%",
            minWidth: "120px",
          },
          {
            key: "Actions",
            label: "Hành động",
            width: "15%",
            minWidth: "150px",
            center: true,
          },
        ]
      : [
          {
            key: "displayName",
            label: "Tên hiển thị",
            width: "20%",
            minWidth: "150px",
          },
          { key: "email", label: "Email", width: "20%", minWidth: "150px" },
          { key: "role", label: "Vai trò", width: "10%", minWidth: "100px" },
          {
            key: "isVerified",
            label: "Xác thực",
            width: "10%",
            minWidth: "80px",
            center: true,
          },
          {
            key: "isBanned",
            label: "Khóa",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "bannedUntil",
            label: "Thời hạn",
            width: "15%",
            minWidth: "120px",
            center: true,
          },
          {
            key: "novelFollowCount",
            label: "Follow",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "coin",
            label: "Coin",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
          {
            key: "createdAt",
            label: "Ngày tạo",
            width: "15%",
            minWidth: "120px",
          },
          {
            key: "Actions",
            label: "Hành động",
            width: "10%",
            minWidth: "100px",
            center: true,
          },
        ];

  return (
    <div className="overflow-x-auto overflow-y-hidden bg-white dark:bg-[#1a1a1c] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <table className="w-full table-fixed text-left text-sm text-gray-900 dark:text-white">
        <thead className="bg-gray-50 dark:bg-[#2c2c2c] text-base font-semibold h-16">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={`p-4 cursor-pointer ${header.width} ${
                  header.minWidth
                } ${header.center ? "text-center" : ""}`}
                onClick={() => header.key !== "Actions" && onSort(header.key)}
              >
                {header.label}{" "}
                {sortConfig.key === header.key &&
                  header.key !== "Actions" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <motion.tr
              key={String(type === "novel" ? item.NovelId : item.userId)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2c2c2c]"
            >
              {headers.map((header) => (
                <td
                  key={header.key}
                  className={`p-4 ${header.center ? "text-center" : ""} ${
                    header.key === "Title" ||
                    header.key === "displayName" ||
                    header.key === "email"
                      ? "truncate"
                      : ""
                  }`}
                >
                  {header.key === "Title" ? (
                    <Link
                      to={`/admin/novels/${String(item.NovelId)}`}
                      className="text-[#ff4d4f] hover:underline"
                    >
                      {String(item.Title)}
                    </Link>
                  ) : header.key === "displayName" ? (
                    <Link
                      to={`/admin/users/${String(item.userId)}`}
                      className="text-[#ff4d4f] hover:underline"
                    >
                      {String(item.displayName)}
                    </Link>
                  ) : header.key === "Actions" && type === "novel" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          onOpenChapterPopup &&
                          onOpenChapterPopup(String(item.NovelId))
                        }
                        className="bg-[#ff4d4f] text-white px-3 py-1 rounded-md hover:bg-[#e63939]"
                      >
                        Quản lý chương
                      </button>
                      <button
                        onClick={() =>
                          onLockUnlockNovel &&
                          onLockUnlockNovel(String(item.NovelId), !item.IsLock)
                        }
                        className="bg-[#ff4d4f] text-white px-3 py-1 rounded-md hover:bg-[#e63939]"
                      >
                        {item.IsLock ? "Mở khóa" : "Khóa"}
                      </button>
                    </div>
                  ) : header.key === "Actions" && type === "user" ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          onLockUnlockUser &&
                          onLockUnlockUser(String(item.userId), !item.isBanned)
                        }
                        className="bg-[#ff4d4f] text-white px-3 py-1 rounded-md hover:bg-[#e63939]"
                      >
                        {item.isBanned ? "Mở khóa" : "Khóa"}
                      </button>
                    </div>
                  ) : header.key === "IsPublic" ||
                    header.key === "isVerified" ? (
                    item[header.key] ? (
                      "✅"
                    ) : (
                      "❌"
                    )
                  ) : header.key === "IsLock" || header.key === "isBanned" ? (
                    item[header.key] ? (
                      "🔒"
                    ) : (
                      "❌"
                    )
                  ) : header.key === "bannedUntil" ? (
                    item.bannedUntil === 0 ? (
                      item.isBanned ? (
                        "Vĩnh viễn"
                      ) : (
                        "Không khóa"
                      )
                    ) : (
                      formatVietnamTimeFromTicks(Number(item.bannedUntil))
                    )
                  ) : header.key === "RatingAvg" ? (
                    Number(item.RatingAvg).toFixed(1)
                  ) : header.key === "role" ? (
                    String(item.role).charAt(0).toUpperCase() +
                    String(item.role).slice(1)
                  ) : header.key === "CreateAt" ||
                    header.key === "createdAt" ? (
                    String(item[header.key])
                  ) : (
                    String(item[header.key])
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
