import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
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
  const { darkMode } = useDarkMode();

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
    <div
      className={`overflow-x-auto overflow-y-hidden rounded-lg shadow-sm border ${
        darkMode
          ? "bg-[#1a1a1c] text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      }`}
    >
      <table className="w-full table-fixed text-left text-sm">
        <thead
          className={`h-16 ${
            darkMode ? "bg-[#2c2c2c]" : "bg-gray-50"
          } text-base font-semibold`}
        >
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
              key={String(
                type === "novel"
                  ? (item as NovelAdmin).NovelId
                  : (item as User).userId
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-t ${
                darkMode
                  ? "border-gray-700 hover:bg-[#2c2c2c]"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
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
                  {header.key === "Title" && type === "novel" ? (
                    <Link
                      to={`/novels/${String((item as NovelAdmin).Slug)}`}
                      className="text-[#ff4d4f] hover:underline"
                    >
                      {String((item as NovelAdmin).Title)}
                    </Link>
                  ) : header.key === "displayName" && type === "user" ? (
                    <Link
                      to={`/admin/users/${String((item as User).userId)}`}
                      className="text-[#ff4d4f] hover:underline"
                    >
                      {String((item as User).displayName)}
                    </Link>
                  ) : header.key === "Actions" && type === "novel" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          onOpenChapterPopup &&
                          onOpenChapterPopup(
                            String((item as NovelAdmin).NovelId)
                          )
                        }
                        className={`px-3 py-1 rounded-md text-white ${
                          darkMode
                            ? "bg-[#ff4d4f] hover:bg-[#e63939]"
                            : "bg-[#ff4d4f] hover:bg-[#e63939]"
                        }`}
                      >
                        Quản lý chương
                      </button>
                      <button
                        onClick={() =>
                          onLockUnlockNovel &&
                          onLockUnlockNovel(
                            String((item as NovelAdmin).NovelId),
                            (item as NovelAdmin).IsLock
                          )
                        }
                        className={`px-3 py-1 rounded-md text-white ${
                          darkMode
                            ? "bg-[#ff4d4f] hover:bg-[#e63939]"
                            : "bg-[#ff4d4f] hover:bg-[#e63939]"
                        }`}
                      >
                        {(item as NovelAdmin).IsLock ? "Mở khóa" : "Khóa"}
                      </button>
                    </div>
                  ) : header.key === "Actions" && type === "user" ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          onLockUnlockUser &&
                          onLockUnlockUser(
                            String((item as User).userId),
                            (item as User).isBanned
                          )
                        }
                        className={`px-3 py-1 rounded-md text-white ${
                          darkMode
                            ? "bg-[#ff4d4f] hover:bg-[#e63939]"
                            : "bg-[#ff4d4f] hover:bg-[#e63939]"
                        }`}
                      >
                        {(item as User).isBanned ? "Mở khóa" : "Khóa"}
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
                  ) : header.key === "bannedUntil" && type === "user" ? (
                    (item as User).bannedUntil === 0 ? (
                      (item as User).isBanned ? (
                        "Vĩnh viễn"
                      ) : (
                        "Không khóa"
                      )
                    ) : (
                      formatVietnamTimeFromTicks(
                        Number((item as User).bannedUntil)
                      )
                    )
                  ) : header.key === "RatingAvg" && type === "novel" ? (
                    Number((item as NovelAdmin).RatingAvg).toFixed(1)
                  ) : header.key === "role" && type === "user" ? (
                    String((item as User).role)
                      .charAt(0)
                      .toUpperCase() + String((item as User).role).slice(1)
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
