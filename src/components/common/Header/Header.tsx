import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  type RefObject,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import { Bell, X, Search, ListFilter } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  SORT_BY_FIELDS,
  SORT_DIRECTIONS,
} from "../../../pages/Home/hooks/useSortedNovels";
import { useNotification } from "../../../context/NotificationContext/NotificationContext";
import {
  GetUserNotifications,
  ReadNotification,
} from "../../../api/Notification/noti.api";
import { SearchBar } from "./SearchBar";
import { DarkModeToggler } from "../../DarkModeToggler";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../context/ToastContext/toast-context";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";
import { NotificationDropdown } from "./NotificationDropdown";
import type { ReadNotificationReq } from "../../../api/Notification/noti.type";

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
  isAdminRoute?: boolean;
};

const sortOptions = [
  {
    label: "Ngày ra mắt ↑",
    value: `${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.ASC}`,
  },
  {
    label: "Ngày ra mắt ↓",
    value: `${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.DESC}`,
  },
  {
    label: "Lượt xem ↑",
    value: `${SORT_BY_FIELDS.TOTAL_VIEWS}:${SORT_DIRECTIONS.ASC}`,
  },
  {
    label: "Lượt xem ↓",
    value: `${SORT_BY_FIELDS.TOTAL_VIEWS}:${SORT_DIRECTIONS.DESC}`,
  },
  {
    label: "Đánh giá ↑",
    value: `${SORT_BY_FIELDS.RATING_AVG}:${SORT_DIRECTIONS.ASC}`,
  },
  {
    label: "Đánh giá ↓",
    value: `${SORT_BY_FIELDS.RATING_AVG}:${SORT_DIRECTIONS.DESC}`,
  },
];

function PortalLayer<T extends HTMLElement>({
  anchorRef,
  open,
  offset = 8,
  children,
}: {
  anchorRef: RefObject<T | null>;
  open: boolean;
  offset?: number;
  children: ReactNode;
}) {
  const [style, setStyle] = useState<CSSProperties>({});

  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setStyle({
      position: "fixed",
      top: Math.round(rect.bottom + offset),
      right: Math.round(window.innerWidth - rect.right),
      zIndex: 9999,
    });
  }, [anchorRef, offset]);

  useLayoutEffect(() => {
    if (!open) return;
    update();
  }, [open, update]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, update]);

  if (!open) return null;
  return createPortal(<div style={style}>{children}</div>, document.body);
}

export const Header = ({
  onToggleSidebar,
  isSidebarOpen,
  isAdminRoute,
}: HeaderProps) => {
  const { auth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSort] = useState(
    `${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.ASC}`
  );
  const [selectedTag] = useState("");

  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  const { notifications } = useNotification();
  const { data: userNotifications, refetch: notificationsRefetch } = useQuery({
    queryKey: ["userNotifications", auth?.user.userId],
    queryFn: () => GetUserNotifications().then((res) => res.data.data),
    enabled: !!auth?.accessToken,
  });

  const NotificationMutation = useMutation({
    mutationFn: async (request: ReadNotificationReq) =>
      await ReadNotification(request),
    onSuccess: () => notificationsRefetch(),
  });

  const handleSearchNovels = useCallback(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({
      query: trimmed,
      ...(selectedSort && { selectedSort }),
      ...(selectedTag && { tag: selectedTag }),
    });
    navigate(`/novels?${params.toString()}`);
  }, [searchTerm, selectedSort, selectedTag, navigate]);

  const handleClickNotification = async (id: string) => {
    await NotificationMutation.mutate({
      notificationIds: [id],
    });
    setIsNotificationOpen(false);
  };

  useEffect(() => {
    if (notifications[0]) {
      toast?.onOpen(notifications[0].message);
      notificationsRefetch();
    }
  }, [notifications, toast, notificationsRefetch]);

  const unreadCount = useMemo(
    () => userNotifications?.filter?.((n: any) => !n.isRead)?.length ?? 0,
    [userNotifications]
  );

  useEffect(() => {
    if (isNotificationOpen && isPopupOpen) setIsPopupOpen(false);
  }, [isNotificationOpen, isPopupOpen]);

  return (
    <>
      <div className="h-[90px] flex items-center justify-center px-6 lg:px-[50px] bg-white dark:bg-[#000000] gap-6">
        <div className="shrink-0">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="grid place-items-center h-10 w-10 rounded-lg
                         bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff884b]
                         hover:opacity-90 active:scale-95 transition transform shadow-md"
              aria-label="Mở sidebar"
              title="Mở sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1 max-w-[800px]">
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSubmit={handleSearchNovels}
            sortOptions={sortOptions}
            searchIcon={
              <Search className="h-5 w-5 text-gray-600 dark:text-white" />
            }
            clearIcon={<X className="h-5 w-5 text-gray-600 dark:text-white" />}
            filterIcon={
              <ListFilter className="h-5 w-5 text-gray-600 dark:text-white" />
            }
            initialSort=""
            initialTags={[]}
          />
        </div>

        <DarkModeToggler />

        <button
          ref={notifBtnRef}
          onClick={() => setIsNotificationOpen((prev) => !prev)}
          className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition"
          aria-haspopup="menu"
          aria-expanded={isNotificationOpen}
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5 text-black dark:text-white" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#000]"
              aria-hidden
            />
          )}
        </button>

        <button
          ref={avatarBtnRef}
          onClick={() => setIsPopupOpen((prev) => !prev)}
          className="h-11 w-11 rounded-full ring-1 ring-zinc-700 hover:ring-orange-500/60 transition overflow-hidden bg-white"
          aria-haspopup="dialog"
          aria-expanded={isPopupOpen}
          aria-label="Tài khoản"
        >
          <img
            src={auth?.user?.avatarUrl || DefaultAvatar}
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        </button>
      </div>

      <PortalLayer anchorRef={notifBtnRef} open={isNotificationOpen} offset={8}>
        <NotificationDropdown
          open={isNotificationOpen}
          notifications={userNotifications}
          onClose={() => setIsNotificationOpen(false)}
          onItemClick={handleClickNotification}
        />
      </PortalLayer>

      {auth?.user ? (
        <PortalLayer anchorRef={avatarBtnRef} open={isPopupOpen} offset={8}>
          <UserMenu onClose={() => setIsPopupOpen(false)} />
        </PortalLayer>
      ) : (
        <PortalLayer anchorRef={avatarBtnRef} open={isPopupOpen} offset={8}>
          <AuthModal onClose={() => setIsPopupOpen(false)} />
        </PortalLayer>
      )}
    </>
  );
};
