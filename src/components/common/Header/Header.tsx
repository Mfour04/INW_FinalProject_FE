import { useCallback, useEffect, useState } from "react";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import Notification from "../../../assets/svg/SearchBar/notification-02-stroke-rounded.svg";
import Delete from "../../../assets/svg/SearchBar/multiplication-sign-stroke-rounded.svg";
import Search from "../../../assets/svg/SearchBar/search-02-stroke-rounded.svg";
import SearchArea from "../../../assets/svg/SearchBar/search-area-stroke-rounded.svg";

import { useQuery } from "@tanstack/react-query";
import {
  SORT_BY_FIELDS,
  SORT_DIRECTIONS,
} from "../../../pages/Home/hooks/useSortedNovels";
import { useNotification } from "../../../context/NotificationContext/NotificationContext";
import { GetUserNotifications } from "../../../api/Notification/noti.api";
import { SearchBar } from "./SearchBar";
import { NotificationDropdown } from "./NotificationDropdown";
import { DarkModeToggler } from "../../DarkModeToggler";

import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../context/ToastContext/toast-context";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";

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

  const { notifications } = useNotification();
  const { data: userNotifications, refetch: notificationsRefetch } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: () => GetUserNotifications().then((res) => res.data.data),
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

  useEffect(() => {
    if (notifications[0]) {
      toast?.onOpen("Tác giả vừa đăng chương mới");
      notificationsRefetch();
    }
  }, [notifications, toast, notificationsRefetch]);

  return (
    <>
      <div className="h-[90px] flex items-center justify-center px-6 lg:px-[50px] bg-white dark:bg-[#000000] gap-6">
        <div className="shrink-0">
          {!isAdminRoute && !isSidebarOpen && ( 
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            searchIcon={Search}
            clearIcon={Delete}
            filterIcon={SearchArea}
            initialSort=""
            initialTags={[]}
          />
        </div>

        <DarkModeToggler />

        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="grid place-items-center h-10 w-10 rounded-full hover:bg-zinc-800/40 transition"
            aria-haspopup="menu"
            aria-expanded={isNotificationOpen}
            aria-label="Thông báo"
          >
            <img src={Notification} alt="Notification" className="h-5 w-5" />
          </button>
          {isNotificationOpen && (
            <NotificationDropdown notifications={userNotifications} />
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => setIsPopupOpen(!isPopupOpen)}
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

      {/* Popup */}
      {isPopupOpen &&
        (auth?.user ? (
          <UserMenu onClose={() => setIsPopupOpen(false)} />
        ) : (
          <AuthModal onClose={() => setIsPopupOpen(false)} />
        ))}
    </>
  );
};
