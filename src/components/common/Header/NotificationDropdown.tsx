// NotificationDropdown.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { GetUserNotificationRes } from "../../../api/Notification/noti.type";
import { formatTicksToRelativeTime } from "../../../utils/date_format";
import {
  Bell,
  Heart,
  MessageSquare,
  CornerDownRight,
  BookmarkPlus,
  Lock,
  Unlock,
  ShieldAlert,
  FilePlus,
  UserX,
  UserCheck,
  Info,
} from "lucide-react";

interface Props {
  open: boolean;
  notifications?: GetUserNotificationRes[];
  onItemClick?: (id: string) => void;
  onClose?: () => void;

  /** thêm mới: khi true thì KHÔNG dùng absolute top-full/bottom-full */
  floating?: boolean;
  /** thêm mới: hướng bung khi không floating qua Portal  */
  anchorPlacement?: "below" | "above";
}

function normalizeToMs(t: number) {
  if (t > 9_000_000_000_000) {
    const TICKS_EPOCH = 621355968000000000n;
    const ticks = BigInt(t);
    return Number((ticks - TICKS_EPOCH) / 10_000n);
  }
  return t;
}

function groupKey(ts: number) {
  const ms = normalizeToMs(ts);
  const d = new Date(ms);
  const now = new Date();
  if (!Number.isFinite(ms) || isNaN(d.getTime())) return "Khác";
  if (d.toDateString() === now.toDateString()) return "Hôm nay";
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(d);
}

function getTypeMeta(type?: number) {
  switch (type) {
    case 0:
    case 7:
    case 14:
    case 15:
      return {
        Icon: ShieldAlert,
        light: "text-amber-600 bg-amber-50 ring-1 ring-amber-100",
        dark: "dark:text-amber-400 dark:bg-amber-400/10 dark:ring-0",
      };
    case 1:
    case 8:
      return {
        Icon: MessageSquare,
        light: "text-sky-600 bg-sky-50 ring-1 ring-sky-100",
        dark: "dark:text-sky-400 dark:bg-sky-400/10 dark:ring-0",
      };
    case 2:
    case 9:
      return {
        Icon: CornerDownRight,
        light: "text-sky-600 bg-sky-50 ring-1 ring-sky-100",
        dark: "dark:text-sky-400 dark:bg-sky-400/10 dark:ring-0",
      };
    case 3:
    case 10:
      return {
        Icon: Heart,
        light: "text-rose-600 bg-rose-50 ring-1 ring-rose-100",
        dark: "dark:text-rose-400 dark:bg-rose-400/10 dark:ring-0",
      };
    case 4:
      return {
        Icon: BookmarkPlus,
        light: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100",
        dark: "dark:text-emerald-400 dark:bg-emerald-400/10 dark:ring-0",
      };
    case 5:
    case 11:
      return {
        Icon: Lock,
        light: "text-slate-600 bg-slate-50 ring-1 ring-slate-100",
        dark: "dark:text-slate-300 dark:bg-slate-400/10 dark:ring-0",
      };
    case 6:
    case 12:
      return {
        Icon: Unlock,
        light: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100",
        dark: "dark:text-emerald-400 dark:bg-emerald-400/10 dark:ring-0",
      };
    case 13:
      return {
        Icon: FilePlus,
        light: "text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100",
        dark: "dark:text-indigo-400 dark:bg-indigo-400/10 dark:ring-0",
      };
    case 16:
      return {
        Icon: UserX,
        light: "text-red-600 bg-red-50 ring-1 ring-red-100",
        dark: "dark:text-red-400 dark:bg-red-400/10 dark:ring-0",
      };
    case 17:
      return {
        Icon: UserCheck,
        light: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100",
        dark: "dark:text-emerald-400 dark:bg-emerald-400/10 dark:ring-0",
      };
    default:
      return {
        Icon: Info,
        light: "text-slate-600 bg-slate-50 ring-1 ring-slate-100",
        dark: "dark:text-slate-300 dark:bg-slate-400/10 dark:ring-0",
      };
  }
}

export const NotificationDropdown = ({
  open,
  notifications,
  onItemClick,
  onClose,
  floating = false,
  anchorPlacement = "below",
}: Props) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(5);
  }, [showUnreadOnly, notifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose?.();
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  const list = useMemo(() => {
    const base = Array.isArray(notifications) ? notifications : [];
    const cleaned = base.filter(
      (n) => typeof n.createAt === "number" && Number.isFinite(n.createAt)
    );
    const sorted = [...cleaned].sort(
      (a, b) => normalizeToMs(b.createAt) - normalizeToMs(a.createAt)
    );
    return showUnreadOnly ? sorted.filter((n) => !n.isRead) : sorted;
  }, [notifications, showUnreadOnly]);

  const grouped = useMemo(() => {
    const map = new Map<string, GetUserNotificationRes[]>();
    for (const n of list.slice(0, visibleCount)) {
      const key = groupKey(n.createAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    }
    return Array.from(map.entries());
  }, [list, visibleCount]);

  const hasMore = list.length > visibleCount;
  if (!open) return null;

  const positionClass = floating
    ? "" // Portal đã định vị; không tự absolute ở đây
    : anchorPlacement === "below"
    ? "absolute top-full right-0 mt-1"
    : "absolute bottom-full right-0 mb-1";

  return (
    <div
      ref={ref}
      className={[
        positionClass, 
        "z-50 w-[22rem] max-w-[min(22rem,calc(100vw-16px))] rounded-xl overflow-hidden",
        "bg-white text-slate-900 border border-slate-200 shadow-lg",
        "dark:bg-[#18191A] dark:text-white dark:border-white/10",
      ].join(" ")}
      style={{ maxHeight: "min(65vh, 480px)" }}
      role="dialog"
      aria-label="Thông báo"
    >
      <div
        className={[
          "px-3 py-2 flex items-center justify-between",
          "border-b border-slate-200 dark:border-white/10",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-slate-500 dark:text-white/70" />
          <span className="text-sm font-semibold">Thông báo</span>
        </div>
        <button
          onClick={() => setShowUnreadOnly((v) => !v)}
          className={[
            "text-xs px-2 py-1 rounded-md transition",
            "bg-slate-100 text-slate-700 hover:bg-slate-200",
            "dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
          ].join(" ")}
        >
          {showUnreadOnly ? "Chỉ chưa đọc" : "Tất cả"}
        </button>
      </div>

      {/* Giới hạn chiều cao theo viewport để tránh bị chôn xuống dưới */}
      <div className="max-h-[65vh] sm:max-h-96 overflow-y-auto scrollbar-strong">
        {grouped.length === 0 ? (
          <div className="py-8 px-4 text-center text-sm text-slate-500 dark:text-white/70">
            Không có thông báo
          </div>
        ) : (
          grouped.map(([label, items]) => (
            <section key={label} className="py-2">
              <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-slate-500 dark:text-white/50">
                {label}
              </div>
              <ul>
                {items.map((noti) => {
                  const meta = getTypeMeta(noti.type as number | undefined);
                  const { Icon, light, dark } = meta;
                  return (
                    <li key={noti.notificationId}>
                      <button
                        onClick={() => onItemClick?.(noti.notificationId)}
                        className={[
                          "w-full text-left px-3 py-2 flex items-start gap-3 transition",
                          "hover:bg-slate-50 dark:hover:bg-white/5",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "h-8 w-8 rounded-full flex items-center justify-center ring-0",
                            light,
                            dark,
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={[
                              "text-sm leading-5",
                              noti.isRead
                                ? "text-slate-700 dark:text-white/80"
                                : "text-slate-900 font-medium dark:text-white",
                            ].join(" ")}
                          >
                            {noti.message}
                          </p>
                          <span className="mt-1 block text-xs text-slate-500 dark:text-white/60">
                            {formatTicksToRelativeTime(noti.createAt)}
                          </span>
                        </div>
                        {!noti.isRead && (
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}

        {hasMore && (
          <div
            className={[
              "px-3 py-2 text-center",
              "border-t border-slate-200 dark:border-white/10",
            ].join(" ")}
          >
            <button
              onClick={() => setVisibleCount((c) => c + 5)}
              className="text-xs text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition"
            >
              Xem thêm thông báo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
