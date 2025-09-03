import { motion } from "framer-motion";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import type { NovelAdmin } from "../../../api/Novels/novel.type";
import type { User } from "../../../api/Admin/User/user.type";
import { formatVietnamTimeFromTicks } from "../../../utils/date_format";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

interface HeaderDef {
  key: string;
  sortKey?: string;
  label: string;
  sortable?: boolean;
  center?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  sortConfig: SortConfig<T>;
  onSort: (key: string) => void;
  type: "novel" | "user";
  onOpenChapterPopup?: (novelId: string) => void;
  onLockUnlockNovel?: (novelId: string, isLock: boolean) => void;
  onDetailUser?: (user: User) => void;
  onLockUnlockUser?: (userId: string, isBanned: boolean) => void;
}

const COLS_USER = [26, 10, 10, 8, 15, 16, 15];
const COLS_NOVEL = [22, 16, 10, 8, 8, 10, 10, 10, 16];

const SortArrow = ({
  active,
  dir,
}: {
  active: boolean;
  dir: "asc" | "desc";
}) => (
  <span className="inline-block w-3 text-center align-middle select-none">
    {active ? (
      <span className="text-[10px]">{dir === "asc" ? "↑" : "↓"}</span>
    ) : (
      <span className="text-zinc-400 dark:text-zinc-500">↕</span>
    )}
  </span>
);

const DataTable = <T extends NovelAdmin | User>({
  data,
  sortConfig,
  onSort,
  type,
  onOpenChapterPopup,
  onLockUnlockNovel,
  onLockUnlockUser,
  onDetailUser,
}: DataTableProps<T>) => {
  const { darkMode } = useDarkMode();

  const headers: HeaderDef[] =
    type === "novel"
      ? [
          {
            key: "Title",
            label: "Tên truyện",
            sortable: false,
          },
          {
            key: "AuthorName",
            label: "Tác giả",
            sortable: false,
          },
          { key: "Status", label: "Trạng thái", sortable: false },
          {
            key: "IsPublic",
            label: "Công khai",
            sortable: false,
            center: true,
          },
          { key: "IsLock", label: "Khóa", sortable: false, center: true },
          {
            key: "TotalViews",
            sortKey: "total_views",
            label: "Lượt xem",
            sortable: true,
            center: true,
          },
          {
            key: "RatingAvg",
            sortKey: "rating_avg",
            label: "Đánh giá",
            sortable: true,
            center: true,
          },
          {
            key: "CreateAt",
            sortKey: "created_at",
            label: "Ngày tạo",
            sortable: true,
          },
          { key: "Actions", label: "Hành động", sortable: false, center: true },
        ]
      : [
          {
            key: "displayName",
            sortKey: "displayname_normalized",
            label: "Tên hiển thị",
            sortable: true,
          },
          { key: "role", label: "Vai trò", sortable: false },
          {
            key: "isVerified",
            label: "Xác thực",
            sortable: false,
            center: true,
          },
          { key: "isBanned", label: "Khóa", sortable: false, center: true },
          {
            key: "bannedUntil",
            label: "Thời hạn",
            sortable: false,
            center: true,
          },
          {
            key: "createdAt",
            sortKey: "created_at",
            label: "Ngày tạo",
            sortable: true,
          },
          { key: "Actions", label: "Hành động", sortable: false, center: true },
        ];

  const colPercents = type === "novel" ? COLS_NOVEL : COLS_USER;
  const isActive = (h: HeaderDef): boolean =>
    !!(h.sortable && h.sortKey && (sortConfig.key as any) === h.sortKey);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const minDesignWidth = type === "novel" ? 1120 : 900;
  const rowHeight = 48; // px, tương tự h-12
  const headerHeight = 40; // px, tương tự h-10
  const minHeightPx = headerHeight + rowHeight * (type === "novel" ? 10 : 10); // 10 rows

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const table = inner.querySelector("table") as HTMLTableElement | null;
      if (table) {
        table.style.minWidth = `${minDesignWidth}px`;
      }

      const containerWidth = outer.clientWidth;
      const naturalWidth = inner.scrollWidth;
      const nextScale = Math.min(1, containerWidth / Math.max(naturalWidth, 1));

      setScale(nextScale);

      const naturalHeight = inner.scrollHeight;
      outer.style.height = `${naturalHeight * nextScale}px`;
    };

    const ro = new ResizeObserver(updateScale);
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    updateScale();
    return () => ro.disconnect();
  }, [sortedData, type, minDesignWidth]);

  return (
    <div
      ref={outerRef}
      className={[
        "rounded-xl border shadow-sm overflow-hidden relative",
        darkMode
          ? "bg-[#0b0f15]/80 text-white border-white/10"
          : "bg-white text-zinc-900 border-zinc-200",
      ].join(" ")}
      style={{ minHeight: `${minHeightPx}px` }}
    >
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "left top",
          width: "fit-content",
        }}
      >
        <table
          className="w-full table-fixed text-sm"
          style={{ minWidth: `${minDesignWidth}px` }}
        >
          <colgroup>
            {colPercents.map((w, i) => (
              <col key={i} style={{ width: `${w}%` }} />
            ))}
          </colgroup>

          <thead
            className={
              darkMode
                ? "bg-[#0b0f15]/90 text-zinc-300"
                : "bg-zinc-50 text-zinc-600"
            }
          >
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={[
                    "px-3 py-2 text-[12.5px] md:text-xs font-semibold uppercase tracking-wide whitespace-nowrap",
                    h.center ? "text-center" : "text-left",
                    h.sortable
                      ? "cursor-pointer select-none hover:bg-zinc-100/50 dark:hover:bg-white/10"
                      : "cursor-default",
                  ].join(" ")}
                  aria-sort={
                    isActive(h)
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => h.sortable && h.sortKey && onSort(h.sortKey)}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${
                      h.center ? "justify-center w-full" : ""
                    }`}
                  >
                    <span>{h.label}</span>
                    {h.sortable && (
                      <SortArrow
                        active={isActive(h)}
                        dir={sortConfig.direction}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item) => (
              <motion.tr
                key={String(
                  type === "novel"
                    ? (item as NovelAdmin).NovelId
                    : (item as User).userId
                )}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={
                  darkMode
                    ? "even:bg-white/5 hover:bg-white/10"
                    : "even:bg-zinc-50 hover:bg-zinc-100"
                }
              >
                {headers.map((h) => {
                  const value: any = (item as any)[h.key];

                  if (type === "user" && h.key === "displayName") {
                    const u = item as User;
                    return (
                      <td
                        key={h.key}
                        className="px-3 py-2 truncate font-medium"
                      >
                        <span className="text-[#ff5f3d] decoration-1 underline-offset-2">
                          {value}
                        </span>
                      </td>
                    );
                  }

                  if (type === "user" && h.key === "isVerified") {
                    return (
                      <td key={h.key} className="px-3 py-2 text-center">
                        {value ? (
                          <span
                            title="Đã xác thực"
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 text-[11px] font-bold"
                          >
                            ✓
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                    );
                  }

                  if (type === "user" && h.key === "isBanned") {
                    const isBanned = Boolean(value);
                    return (
                      <td key={h.key} className="px-3 py-2 text-center">
                        {isBanned ? (
                          <span
                            title="Đang bị khóa"
                            className="inline-flex items-center justify-center"
                          >
                            <Lock className="h-4 w-4 text-rose-500" />
                          </span>
                        ) : (
                          <span
                            title="Đang mở khóa"
                            className="inline-flex items-center justify-center"
                          >
                            <Unlock className="h-4 w-4 text-emerald-500" />
                          </span>
                        )}
                      </td>
                    );
                  }

                  if (type === "user" && h.key === "bannedUntil") {
                    const u = item as User;
                    let display = "—";
                    if (u.isBanned) {
                      display =
                        u.bannedUntil === 0
                          ? "∞"
                          : formatVietnamTimeFromTicks(
                              Number(u.bannedUntil)
                            ).slice(0, 5);
                    }
                    return (
                      <td
                        key={h.key}
                        className="px-3 py-2 text-center tabular-nums"
                      >
                        {display}
                      </td>
                    );
                  }

                  if (h.key === "Actions" && type === "user") {
                    const u = item as User;
                    return (
                      <td key={h.key} className="px-3 py-2 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onDetailUser?.(u!)}
                            className={[
                              "px-2.5 py-1.5 text-xs font-semibold rounded-xl border",
                              darkMode
                                ? "border-white/10 bg-white/5 hover:bg-white/10"
                                : "border-zinc-200 bg-white hover:bg-zinc-50",
                            ].join(" ")}
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() =>
                              onLockUnlockUser?.(u.userId, u.isBanned)
                            }
                            className={[
                              "px-2.5 py-1.5 text-xs font-semibold rounded-xl",
                              u.isBanned
                                ? "border border-emerald-500/30 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15"
                                : "text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] shadow-sm hover:opacity-95",
                            ].join(" ")}
                          >
                            {u.isBanned ? "Mở khóa" : "Khóa"}
                          </button>
                        </div>
                      </td>
                    );
                  }

                  if (type === "novel" && h.key === "IsPublic") {
                    const isPublic = Boolean(value);
                    return (
                      <td key={h.key} className="px-3 py-2 text-center">
                        {isPublic ? (
                          <span
                            title="Công khai"
                            className="inline-flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 text-emerald-500" />
                          </span>
                        ) : (
                          <span
                            title="Không công khai"
                            className="inline-flex items-center justify-center"
                          >
                            <EyeOff className="h-4 w-4 text-zinc-400" />
                          </span>
                        )}
                      </td>
                    );
                  }

                  if (type === "novel" && h.key === "IsLock") {
                    const isLocked = Boolean(value);
                    return (
                      <td key={h.key} className="px-3 py-2 text-center">
                        {isLocked ? (
                          <span
                            title="Đang khóa"
                            className="inline-flex items-center justify-center"
                          >
                            <Lock className="h-4 w-4 text-rose-500" />
                          </span>
                        ) : (
                          <span
                            title="Đang mở"
                            className="inline-flex items-center justify-center"
                          >
                            <Unlock className="h-4 w-4 text-emerald-500" />
                          </span>
                        )}
                      </td>
                    );
                  }

                  if (h.key === "Actions" && type === "novel") {
                    const n = item as NovelAdmin;
                    return (
                      <td key={h.key} className="px-3 py-2 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onOpenChapterPopup?.(n.NovelId)}
                            className={[
                              "px-2.5 py-1.5 text-xs font-semibold rounded-xl border",
                              darkMode
                                ? "border-white/10 bg-white/5 hover:bg-white/10"
                                : "border-zinc-200 bg-white hover:bg-zinc-50",
                            ].join(" ")}
                          >
                            Chương
                          </button>
                          <button
                            onClick={() =>
                              onLockUnlockNovel?.(n.NovelId, n.IsLock)
                            }
                            className={[
                              "px-2.5 py-1.5 text-xs font-semibold rounded-xl",
                              n.IsLock
                                ? "border border-emerald-500/30 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15"
                                : "text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] shadow-sm hover:opacity-95",
                            ].join(" ")}
                          >
                            {n.IsLock ? "Mở" : "Khóa"}
                          </button>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={h.key}
                      className={[
                        "px-3 py-2 truncate",
                        h.center ? "text-center" : "",
                        typeof value === "number" ? "tabular-nums" : "",
                      ].join(" ")}
                      title={typeof value === "string" ? value : undefined}
                    >
                      {String(value ?? "")}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
