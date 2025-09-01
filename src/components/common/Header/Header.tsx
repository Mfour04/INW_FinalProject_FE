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
import { DESIGN_TOKENS } from "../../ui/tokens";
import { getTags } from "../../../api/Tags/tag.api";

function useSmallScreen(query = "(max-width: 639.5px)") {
  const get = () => {
    if (typeof window === "undefined" || !("matchMedia" in window))
      return false;
    return window.matchMedia(query).matches;
  };
  const [isSmall, setIsSmall] = useState<boolean>(get);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const m = window.matchMedia(query);
    const update = () => setIsSmall(m.matches);

    if (m.addEventListener) {
      m.addEventListener("change", update);
      return () => m.removeEventListener("change", update);
    }
    m.addListener(update);
    return () => m.removeListener(update);
  }, [query]);

  return isSmall;
}

function PortalLayer<T extends HTMLElement>({
  anchorRef,
  open,
  offset = 8,
  placement = "below",
  children,
}: {
  anchorRef: RefObject<T | null>;
  open: boolean;
  offset?: number;
  placement?: "below" | "above";
  children: ReactNode;
}) {
  const [style, setStyle] = useState<CSSProperties | null>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const resizeObs = useRef<ResizeObserver | null>(null);

  const compute = useCallback(() => {
    const anchor = anchorRef.current;
    const child = childRef.current;
    if (!anchor || !child) return;

    const r = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const cw = child.offsetWidth || 0;
    const ch = child.offsetHeight || 0;

    let right = Math.round(vw - r.right);
    const maxRight = Math.max(8, vw - cw - 8);
    right = Math.min(Math.max(8, right), maxRight);

    let finalPlacement = placement;
    const spaceAbove = r.top - 8;
    const spaceBelow = vh - r.bottom - 8;

    if (
      placement === "above" &&
      ch + offset > spaceAbove &&
      spaceBelow >= spaceAbove
    ) {
      finalPlacement = "below";
    }
    if (
      placement === "below" &&
      ch + offset > spaceBelow &&
      spaceAbove > spaceBelow
    ) {
      finalPlacement = "above";
    }

    const top = Math.round(finalPlacement === "above" ? r.top : r.bottom);

    setStyle({
      position: "fixed",
      top,
      right,
      transform:
        finalPlacement === "above"
          ? `translateY(calc(-100% - ${offset}px))`
          : `translateY(${offset}px)`,
      zIndex: 2147483647,
      pointerEvents: "auto",
    });
  }, [anchorRef, placement, offset]);

  useLayoutEffect(() => {
    if (!open) return;
    rafId.current = requestAnimationFrame(() => {
      compute();
      rafId.current = requestAnimationFrame(() => compute());
    });
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [open, compute]);

  useEffect(() => {
    if (!open) return;
    const onReflow = () => compute();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, { passive: true });
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow);
    };
  }, [open, compute]);

  useEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const child = childRef.current;
    if (!anchor || !child) return;

    if ("ResizeObserver" in window) {
      resizeObs.current = new ResizeObserver(() => compute());
      resizeObs.current.observe(anchor);
      resizeObs.current.observe(child);
    }

    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => compute()).catch(() => {});
    }

    const imgs = child.querySelectorAll("img");
    const handlers: Array<() => void> = [];
    imgs.forEach((img) => {
      const onload = () => compute();
      const onerror = () => compute();
      img.addEventListener("load", onload);
      img.addEventListener("error", onerror);
      handlers.push(() => {
        img.removeEventListener("load", onload);
        img.removeEventListener("error", onerror);
      });
    });

    return () => {
      handlers.forEach((h) => h());
      resizeObs.current?.disconnect();
      resizeObs.current = null;
    };
  }, [open, compute, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: "none",
      }}
    >
      <div ref={childRef} style={{ ...style, pointerEvents: "auto" }}>
        {children}
      </div>
    </div>,
    document.body
  );
}

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
  isAdminRoute?: boolean;
};

export type TagSelectProps = { value: string; label: string };

export const sortOptions = [
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

const TAG_OPTIONS: TagSelectProps[] = [
  { value: "romance", label: "Ngôn tình" },
  { value: "action", label: "Hành động" },
  { value: "fantasy", label: "Phiêu lưu" },
  { value: "comedy", label: "Hài hước" },
  { value: "school", label: "Học đường" },
  { value: "isekai", label: "Chuyển sinh" },
  { value: "drama", label: "Drama" },
];

export const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { auth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isSmall = useSmallScreen();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  const { notifications } = useNotification();
  const { data: userNotifications, refetch: notificationsRefetch } = useQuery({
    queryKey: ["userNotifications", auth?.user?.userId],
    queryFn: () => GetUserNotifications().then((res) => res.data.data),
    enabled: !!auth?.accessToken,
  });

  const notReadNotificationIds = userNotifications
    ?.filter((noti) => noti.isRead === false)
    .map((noti) => noti.notificationId);

  const NotificationMutation = useMutation({
    mutationFn: async (request: ReadNotificationReq) =>
      ReadNotification(request),
    onSuccess: () => notificationsRefetch(),
  });

  const { data: tags } = useQuery({
    queryKey: ["tags-options"],
    queryFn: () => getTags().then((res) => res.data),
  });

  const selectTagOptions: TagSelectProps[] = (tags?.data ?? [])
    .map((tag) => {
      const match = TAG_OPTIONS.find((option) => option.label === tag.name);
      return match ? { value: tag.name, label: match.label } : null;
    })
    .filter((x): x is TagSelectProps => x !== null);

  const handleSearchNovels = useCallback(() => {
    const params = new URLSearchParams();
    const trimmed = searchTerm.trim();

    if (trimmed) params.set("query", trimmed);
    if (sortBy) params.set("sortBy", sortBy);
    if (tagFilter && tagFilter.length > 0) {
      tagFilter.forEach((t) => params.append("tag", t));
    }

    const queryString = params.toString();
    if (queryString) {
      navigate(`/novels?${queryString}`);
    } else {
      navigate(`novels`);
    }
  }, [searchTerm, sortBy, tagFilter, navigate]);

  const handleClickNotification = async (id: string) => {
    await NotificationMutation.mutateAsync({ notificationIds: [id] });
  };

  const handleClickReadAll = async () => {
    if (notReadNotificationIds && notReadNotificationIds.length > 0) {
      NotificationMutation.mutateAsync({
        notificationIds: notReadNotificationIds,
      });
    } else {
      toast?.onOpen("Bạn đã đọc hết tất cả!");
    }
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
    setIsNotificationOpen(false);
    setIsUserMenuOpen(false);
    setIsAuthOpen(false);
  }, [isSmall]);

  useEffect(() => {
    if (isNotificationOpen) {
      setIsUserMenuOpen(false);
      setIsAuthOpen(false);
    }
  }, [isNotificationOpen]);

  const onAvatarClick = () => {
    if (auth?.user) {
      setIsUserMenuOpen((v) => !v);
      setIsNotificationOpen(false);
    } else {
      setIsAuthOpen(true);
      setIsNotificationOpen(false);
      setIsUserMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`${DESIGN_TOKENS.sectionPad} py-3`}>
        <div className={`${DESIGN_TOKENS.container}`}>
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="shrink-0">
              {!isSidebarOpen && (
                <button
                  onClick={onToggleSidebar}
                  className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg
                             bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff884b]
                             shadow-md transition hover:opacity-90 active:scale-95"
                  aria-label="Mở sidebar"
                  title="Mở sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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

            <div className="min-w-0 flex-1">
              <SearchBar
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSubmit={handleSearchNovels}
                sortOptions={sortOptions}
                tagFilterOptions={selectTagOptions}
                searchIcon={
                  <Search className="h-5 w-5 text-gray-600 dark:text-white" />
                }
                clearIcon={
                  <X className="h-5 w-5 text-gray-600 dark:text-white" />
                }
                filterIcon={
                  <ListFilter className="h-5 w-5 text-gray-600 dark:text-white" />
                }
                initialSort={sortBy}
                setSort={setSortBy}
                initialTags={tagFilter}
                setTags={setTagFilter}
              />
            </div>

            {/* Desktop actions */}
            {!isSmall && (
              <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                <DarkModeToggler />

                <button
                  ref={notifBtnRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(!isNotificationOpen);
                  }}
                  className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40"
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
                  onClick={onAvatarClick}
                  className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-zinc-300 transition hover:ring-orange-500/60 dark:ring-zinc-700 bg-white"
                  aria-haspopup="dialog"
                  aria-expanded={auth?.user ? isUserMenuOpen : isAuthOpen}
                  aria-label="Tài khoản"
                >
                  <img
                    src={auth?.user?.avatarUrl || DefaultAvatar}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
            )}

            {isSmall && (
              <div className="flex shrink-0 items-center">
                <button
                  ref={avatarBtnRef}
                  onClick={onAvatarClick}
                  className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-zinc-300 transition hover:ring-orange-500/60 dark:ring-zinc-700 bg-white"
                  aria-haspopup="dialog"
                  aria-expanded={auth?.user ? isUserMenuOpen : isAuthOpen}
                  aria-label="Tài khoản"
                >
                  <img
                    src={auth?.user?.avatarUrl || DefaultAvatar}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isSmall && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto w-full bg-white/85 dark:bg-[#0b0c0f]/85 backdrop-blur-md border-t border-zinc-200 dark:border-white/10">
            <div className={`${DESIGN_TOKENS.container} px-4`}>
              <div
                className="flex items-center justify-around py-2"
                style={{
                  paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
                }}
              >
                <div className="scale-[0.92]">
                  <DarkModeToggler />
                </div>

                <button
                  ref={notifBtnRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(!isNotificationOpen);
                  }}
                  className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40"
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
              </div>
            </div>
          </div>
        </div>
      )}

      <PortalLayer
        anchorRef={notifBtnRef}
        open={isNotificationOpen}
        offset={8}
        placement={isSmall ? "above" : "below"}
      >
        <NotificationDropdown
          open={isNotificationOpen}
          notifications={userNotifications}
          readAll={handleClickReadAll}
          onClose={() => setIsNotificationOpen(false)}
          onItemClick={handleClickNotification}
          floating
        />
      </PortalLayer>

      {auth?.user && (
        <PortalLayer
          anchorRef={avatarBtnRef}
          open={isUserMenuOpen}
          offset={8}
          placement={isSmall ? "below" : "below"}
        >
          <UserMenu onClose={() => setIsUserMenuOpen(false)} />
        </PortalLayer>
      )}

      {!auth?.user && isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}
    </>
  );
};
