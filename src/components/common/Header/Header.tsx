import { useCallback, useEffect, useMemo, useState } from "react";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import LoginLogo from "../../../assets/img/SearchBar/login_logo.png";
import GoogleLogin from "../../../assets/img/SearchBar/google_login.png";
import Notification from "../../../assets/svg/SearchBar/notification-02-stroke-rounded.svg";
import Search from "../../../assets/svg/SearchBar/search-02-stroke-rounded.svg";
import SearchArea from "../../../assets/svg/SearchBar/search-area-stroke-rounded.svg";
import Delete from "../../../assets/svg/SearchBar/multiplication-sign-stroke-rounded.svg";
import Person from "@mui/icons-material/Person";
import History from "@mui/icons-material/History";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Login, Register } from "../../../api/Auth/auth.api";
import type { LoginParams, RegisterParams } from "../../../api/Auth/auth.type";
import { useAuth } from "../../../hooks/useAuth";
import {
  validatePassword,
  type PasswordValidationResult,
} from "../../../utils/validation";
import Button from "../../ButtonComponent";
import { useToast } from "../../../context/ToastContext/toast-context";
import { useNavigate, Link } from "react-router-dom";
import {
  SORT_BY_FIELDS,
  SORT_DIRECTIONS,
} from "../../../pages/Home/hooks/useSortedNovels";
import { getTags } from "../../../api/Tags/tag.api";
import { useNotification } from "../../../context/NotificationContext/NotificationContext";
import { GetUserNotifications } from "../../../api/Notification/noti.api";
import { SearchBar } from "./SearchBar";
import { DarkModeToggler } from "../../DarkModeToggler";
import { NotificationDropdown } from "./NotificationDropdown";

const initialLoginForm: LoginParams = {
  username: "",
  password: "",
};

const initialRegisterForm: RegisterParams = {
  username: "",
  email: "",
  password: "",
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

export const AUTH_ACTIONS = {
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
} as const;

export type AuthAction = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];

export const Header = () => {
  const { auth, setAuth, logout } = useAuth();
  const toast = useToast();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [action, setAction] = useState<AuthAction>(AUTH_ACTIONS.LOGIN);
  const [loginForm, setLoginForm] = useState<LoginParams>(initialLoginForm);
  const [registerForm, setRegisterForm] =
    useState<RegisterParams>(initialRegisterForm);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [registerMessage, setRegisterMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>(
    `${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.ASC}`
  );
  const [selectedTag, setSelectedTag] = useState<string>("");

  const navigate = useNavigate();

  const { notifications } = useNotification();

  const validationPassword: PasswordValidationResult = validatePassword(
    registerForm.password
  );
  const isRegisterError =
    registerForm.password !== confirmPassword && confirmPassword.length > 0;

  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags().then((res) => res.data.data),
  });

  const capitalize = (str: string) =>
    str
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const tagOptions = [
    { label: "All Tags", value: "" },
    ...(Array.isArray(tagData)
      ? tagData.map((tag) => ({
          label: capitalize(tag.name),
          value: tag.name,
        }))
      : []),
  ];

  const { data: userNotifications, refetch: notificationsRefetch } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: () => GetUserNotifications().then((res) => res.data.data),
  });

  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
    mutationFn: (body: LoginParams) => {
      return Login(body);
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data.token;
      setAuth({ accessToken, refreshToken, user });
      if (user.role === "Admin") {
        console.log(user.role);
        navigate("/admin");
      } else {
        navigate("/");
      }
      toast?.onOpen("Bạn đã đăng nhập thành công!");
    },
  });

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: (body: RegisterParams) => {
      return Register(body);
    },
    onError: (res) => {
      setRegisterMessage(res.message);
    },
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

  const handleLoginButtonClick = () => {
    loginMutate(loginForm, {
      onSuccess: () => {
        setIsPopupOpen(false);
      },
    });
  };

  const handleRegisterButtonClick = () => {
    registerMutate(registerForm, {
      onSuccess: () => {
        setAction(AUTH_ACTIONS.LOGIN);
        toast?.onOpen("Đăng ký thành công, kiểm tra email để xác thực!");
      },
    });
  };

  const handleDepositClick = () => {
    setIsPopupOpen(false);
    navigate("/deposite");
  };

  const handleTransactionHistoryClick = () => {
    setIsPopupOpen(false);
    navigate("/transaction-history");
  };

  const handleLogoutClick = () => {
    logout();
    setIsPopupOpen(false);
    toast?.onOpen("Đăng xuất thành công!");
  };

  const onLoginCloseClick = () => {
    setIsPopupOpen(false);
    setAction(AUTH_ACTIONS.LOGIN);
  };

  const content = useMemo(() => {
    switch (action) {
      case AUTH_ACTIONS.LOGIN:
        return (
          <>
            <div className="text-sm text-left text-[#45454e] mb-4">
              Hoặc đăng nhập tài khoản:
            </div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <div
              onClick={() => setAction(AUTH_ACTIONS.FORGOT_PASSWORD)}
              className="pr-1 text-right text-sm hover:underline text-[#45454e] cursor-pointer mb-4"
            >
              Quên mật khẩu?
            </div>
            <div className="w-full flex justify-center">
              <Button
                isLoading={isLoginPending}
                onClick={handleLoginButtonClick}
                className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600"
              >
                ĐĂNG NHẬP
              </Button>
            </div>
            <div className="text-sm text-center text-[#45454e] mt-4">
              Nếu bạn chưa có tài khoản,{" "}
              <span
                onClick={() => setAction(AUTH_ACTIONS.REGISTER)}
                className="text-[#ff6740] hover:underline cursor-pointer"
              >
                đăng ký ngay
              </span>
            </div>
          </>
        );
      case AUTH_ACTIONS.REGISTER:
        return (
          <>
            <div className="text-sm text-left text-[#45454e] mb-4">
              Hoặc đăng ký tài khoản:
            </div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={registerForm.username}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />

            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            {!validationPassword.isValid && (
              <div>
                {validationPassword.errors.map((error, index) => (
                  <div key={index} className="text-sm text-left text-red-500">
                    {error}
                  </div>
                ))}
              </div>
            )}
            {isRegisterError && (
              <div className="text-sm text-left text-red-500">
                Nhập lại mật khẩu không giống với mật khẩu
              </div>
            )}
            {registerMessage && (
              <div className="text-sm text-left text-red-500">
                {registerMessage}
              </div>
            )}
            <div className="w-full flex justify-center">
              <Button
                isLoading={isRegisterPending}
                onClick={handleRegisterButtonClick}
                className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600"
              >
                ĐĂNG KÝ
              </Button>
            </div>
            <div className="text-sm text-center text-[#45454e] mt-4">
              Nếu bạn đã có tài khoản,{" "}
              <span
                onClick={() => setAction(AUTH_ACTIONS.LOGIN)}
                className="text-[#ff6740] hover:underline cursor-pointer"
              >
                đăng nhập
              </span>
            </div>
          </>
        );
      case AUTH_ACTIONS.FORGOT_PASSWORD:
        return (
          <>
            <div className="text-sm text-left text-[#45454e] mb-4">
              Quên mật khẩu?
            </div>
            <input
              type="text"
              placeholder="Email/Tên đăng nhập"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />

            <div
              onClick={() => setAction(AUTH_ACTIONS.LOGIN)}
              className="text-sm text-left cursor-pointer text-[#ff6740] hover:underline pb-2"
            >
              Về đăng nhập
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={handleLoginButtonClick}
                className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600"
              >
                Gửi
              </button>
            </div>

            <div className="text-sm text-center text-[#45454e] mt-4">
              Nhập tên đăng nhập hoặc email để nhận hướng dẫn đặt lại mật khẩu.
            </div>
          </>
        );
      default:
    }
  }, [
    action,
    setAction,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    confirmPassword,
    setConfirmPassword,
    registerMessage,
    isRegisterPending,
    isLoginPending,
  ]);

  useEffect(() => {
    if (notifications[0]) {
      toast?.onOpen("Tác giả vừa đăng chương mới");
      notificationsRefetch();
    }
  }, [notifications]);

  return (
    <>
      <div className="h-[90px] flex items-center justify-between px-12 lg:px-[50px] bg-white dark:bg-[#000000]">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSubmit={handleSearchNovels}
          sortOptions={sortOptions} // [{value:'created_at_asc', label:'Ngày ra mắt ↑'}, ...]
          searchIcon={Search}
          clearIcon={Delete}
          filterIcon={SearchArea}
          // onApplyFilters={({ sort, tags }) => {
          //   // lưu vào state của bạn nếu cần:
          //   setSelectedSort(sort);       // nhớ tạo state selectedSort ở parent
          //   setSelectedTags(tags);       // mảng string
          //   // gọi API lọc nếu muốn
          // }}
          initialSort=""
          initialTags={[]}
        />

        <DarkModeToggler />

        {/* Actions */}
        <div className="flex items-center h-[50px] ml-4 shrink-0 gap-6">
          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className="grid place-items-center h-10 w-10 rounded-full hover:bg-zinc-800/40 transition"
              aria-haspopup="menu"
              aria-expanded={isNotificationOpen}
              aria-label="Thông báo"
            >
              <img src={Notification} alt="" className="h-5 w-5" />
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
              src={auth?.user.avatarUrl || DefaultAvatar}
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Account / Login Popover */}
      {isPopupOpen && (
        <>
          {auth?.user ? (
            <div className="absolute top-[90px] right-12 mt-2 w-[260px] rounded-2xl border border-zinc-800 bg-[#111114] text-white shadow-2xl z-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-[52px] w-[52px] rounded-full overflow-hidden ring-1 ring-zinc-700 bg-white">
                  <img
                    src={auth.user.avatarUrl || DefaultAvatar}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {auth.user.displayName}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    @{auth.user.displayName}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-300">
                    <span className="flex items-center gap-1">
                      🥇 {auth.user.badgeId.length ?? 0}
                    </span>
                    <span className="flex items-center gap-1">🔥 1</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-amber-300 font-bold text-sm">
                  🪙 {(auth.user.coin ?? 0).toLocaleString("vi-VN")}
                </div>
                <button
                  onClick={handleDepositClick}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white
                           bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]
                           hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]
                           shadow-[0_8px_24px_rgba(255,103,64,0.35)] transition"
                >
                  Nạp thêm
                </button>
              </div>

              <div className="mt-4 pt-3 space-y-2 text-sm border-t border-zinc-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:text-orange-400 transition"
                >
                  <Person /> <span>Trang cá nhân</span>
                </Link>
                <button
                  onClick={handleTransactionHistoryClick}
                  className="flex items-center gap-2 hover:text-orange-400 transition"
                >
                  <History /> <span>Lịch sử giao dịch</span>
                </button>
                <div className="flex items-center gap-2 hover:text-orange-400 transition cursor-pointer">
                  <Settings /> <span>Cài đặt</span>
                </div>
              </div>

              <button
                onClick={() => handleLogoutClick()}
                className="mt-3 w-full rounded-lg border border-zinc-800 py-2 text-sm text-zinc-300 hover:text-red-400 hover:border-red-400 transition flex items-center justify-center gap-2"
              >
                <Logout /> <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative w-[360px] bg-white rounded-2xl p-6 shadow-2xl">
                <button
                  onClick={onLoginCloseClick}
                  className="absolute top-2.5 right-3 h-8 w-8 grid place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition text-xl"
                  aria-label="Đóng"
                >
                  &times;
                </button>

                <div className="h-[46px] w-full flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={LoginLogo}
                    alt="Login Logo"
                    className="max-w-[168px] h-auto object-contain"
                  />
                </div>

                <h2 className="text-lg font-semibold text-center mb-1">
                  Chào mừng đến với InkWave
                </h2>
                <p className="text-sm text-center text-zinc-600 mb-4">
                  Gõ cửa thế giới truyện
                </p>

                <button className="w-full border border-zinc-300 rounded-lg py-2.5 flex items-center justify-center gap-2 mb-3 hover:bg-zinc-50 transition">
                  <img src={GoogleLogin} alt="Google" className="w-5 h-5" />
                  <span className="text-sm">Đăng nhập bằng Google</span>
                </button>

                {content}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
