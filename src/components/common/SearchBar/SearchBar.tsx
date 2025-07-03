import { useCallback, useMemo, useState } from 'react';
import DefaultAvatar from '../../../assets/img/default_avt.png'
import LoginLogo from '../../../assets/img/SearchBar/login_logo.png'
import GoogleLogin from '../../../assets/img/SearchBar/google_login.png'
import Notification from '../../../assets/svg/SearchBar/notification-02-stroke-rounded.svg'
import Search from '../../../assets/svg/SearchBar/search-02-stroke-rounded.svg'
import SearchArea from '../../../assets/svg/SearchBar/search-area-stroke-rounded.svg'
import Delete from '../../../assets/svg/SearchBar/multiplication-sign-stroke-rounded.svg'
import Person from '@mui/icons-material/Person'
import History from '@mui/icons-material/History'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useMutation, useQuery } from '@tanstack/react-query';
import { Login, Register } from '../../../api/Auth/auth.api';
import type { LoginParams, RegisterParams } from '../../../api/Auth/auth.type';
import { useAuth } from '../../../hooks/useAuth';
import { validatePassword, type PasswordValidationResult } from '../../../utils/validation';
import Button from '../../ButtonComponent';
import { useToast } from '../../../context/ToastContext/toast-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { SORT_BY_FIELDS, SORT_DIRECTIONS } from '../../../pages/HomePage';
import { getTags } from '../../../api/Tags/tag.api';

const initialLoginForm: LoginParams = {
  username: '',
  password: ''
}

const initialRegisterForm: RegisterParams = {
  username: '',
  email: '',
  password: ''
}

const sortOptions = [
  { label: "Ngày ra mắt ↑", value: `${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.ASC}` },
  { label: "Ngày ra mắt ↓", value: `${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.DESC}` },
  { label: "Lượt xem ↑", value: `${SORT_BY_FIELDS.TOTAL_VIEWS}:${SORT_DIRECTIONS.ASC}` },
  { label: "Lượt xem ↓", value: `${SORT_BY_FIELDS.TOTAL_VIEWS}:${SORT_DIRECTIONS.DESC}` },
  { label: "Đánh giá ↑", value: `${SORT_BY_FIELDS.RATING_AVG}:${SORT_DIRECTIONS.ASC}` },
  { label: "Đánh giá ↓", value: `${SORT_BY_FIELDS.RATING_AVG}:${SORT_DIRECTIONS.DESC}` },
];



export const AUTH_ACTIONS = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
} as const;

export type AuthAction = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];

export const SearchBar = () => {
  const { auth, setAuth, logout } = useAuth();
  const toast = useToast();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [action, setAction] = useState<AuthAction>(AUTH_ACTIONS.LOGIN);
  const [loginForm, setLoginForm] = useState<LoginParams>(initialLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterParams>(initialRegisterForm);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [registerMessage, setRegisterMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>(`${SORT_BY_FIELDS.CREATED_AT}:${SORT_DIRECTIONS.ASC}`);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const validationPassword: PasswordValidationResult = validatePassword(registerForm.password);
  const isRegisterError = registerForm.password !== confirmPassword && confirmPassword.length > 0;

  const { data: tagData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags().then(res => res.data.data)
  })

  const capitalize = (str: string) =>
    str
      .split("-")
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const tagOptions = [
    { label: "All Tags", value: "" },
    ...(tagData?.map(tag => ({
      label: capitalize(tag.name),
      value: tag.name
    })) ?? [])
  ];



  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
    mutationFn: (body: LoginParams) => {
      return Login(body)
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data.token;
      setAuth({ accessToken, refreshToken, user });
      toast?.onOpen('Bạn đã đăng nhập thành công!');
    },
  })

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: (body: RegisterParams) => {
      return Register(body)
    },
    onError: (res) => {
      setRegisterMessage(res.message);
    }
  })

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
    })
  }

  const handleRegisterButtonClick = () => {
    registerMutate(registerForm, {
      onSuccess: () => {
        setAction(AUTH_ACTIONS.LOGIN);
        toast?.onOpen('Đăng ký thành công, kiểm tra email để xác thực!');
      }
    })
  }


  const handleLogoutClick = () => {
    logout();
    setIsPopupOpen(false);
    toast?.onOpen('Đăng xuất thành công!');
  };

  const onLoginCloseClick = () => {
    setIsPopupOpen(false);
    setAction(AUTH_ACTIONS.LOGIN);
  }

  const content = useMemo(() => {
    switch (action) {
      case AUTH_ACTIONS.LOGIN:
        return (
          <>
            <div className="text-sm text-left text-[#45454e] mb-4">Hoặc đăng nhập tài khoản:</div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={loginForm.username}
              onChange={e => setLoginForm(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginForm.password}
              onChange={e => setLoginForm(prev => ({
                ...prev,
                password: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <div onClick={() => setAction(AUTH_ACTIONS.FORGOT_PASSWORD)} className="pr-1 text-right text-sm hover:underline text-[#45454e] cursor-pointer mb-4">
              Quên mật khẩu?
            </div>
            <div className="w-full flex justify-center">
              <Button
                isLoading={isLoginPending}
                onClick={handleLoginButtonClick}
                className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600">
                ĐĂNG NHẬP
              </Button>
            </div>
            <div className="text-sm text-center text-[#45454e] mt-4">
              Nếu bạn chưa có tài khoản,{" "}
              <span onClick={() => setAction(AUTH_ACTIONS.REGISTER)} className="text-[#ff6740] hover:underline cursor-pointer">đăng ký ngay</span>
            </div>
          </>
        );
      case AUTH_ACTIONS.REGISTER:
        return (
          <>
            <div className="text-sm text-left text-[#45454e] mb-4">Hoặc đăng ký tài khoản:</div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={registerForm.username}
              onChange={e => setRegisterForm(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={e => setRegisterForm(prev => ({
                ...prev,
                email: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={registerForm.password}
              onChange={e => setRegisterForm(prev => ({
                ...prev,
                password: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />

            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            {
              !validationPassword.isValid && (
                <div>
                  {
                    validationPassword.errors.map((error, index) =>
                    (
                      <div key={index} className="text-sm text-left text-red-500">
                        {error}
                      </div>
                    )
                    )
                  }
                </div>
              )
            }
            {
              isRegisterError &&
              <div className="text-sm text-left text-red-500">
                Nhập lại mật khẩu không giống với mật khẩu
              </div>
            }
            {
              registerMessage &&
              <div className="text-sm text-left text-red-500">
                {registerMessage}
              </div>
            }
            <div className="w-full flex justify-center">
              <Button
                isLoading={isRegisterPending}
                onClick={handleRegisterButtonClick}
                className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600">
                ĐĂNG KÝ
              </Button>
            </div>
            <div className="text-sm text-center text-[#45454e] mt-4">
              Nếu bạn đã có tài khoản,{" "}
              <span onClick={() => setAction(AUTH_ACTIONS.LOGIN)} className="text-[#ff6740] hover:underline cursor-pointer">đăng nhập</span>
            </div>
          </>
        );
      case AUTH_ACTIONS.FORGOT_PASSWORD:
        return (
          <>
            <div className="text-sm text-left text-[#45454e] mb-4">Quên mật khẩu?</div>
            <input
              type="text"
              placeholder="Email/Tên đăng nhập"
              value={loginForm.username}
              onChange={e => setLoginForm(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />

            <div onClick={() => setAction(AUTH_ACTIONS.LOGIN)} className="text-sm text-left cursor-pointer text-[#ff6740] hover:underline pb-2">
              Về đăng nhập
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={handleLoginButtonClick}
                className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600">
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
  }, [action, setAction, loginForm, setLoginForm, registerForm, setRegisterForm, confirmPassword, setConfirmPassword, registerMessage, isRegisterPending, isLoginPending])

  return (
    <>
      <div className="h-[90px] flex items-center justify-between px-12 md:px-13 lg:px-[50px] bg-white dark:bg-[#0f0f11]">
        <div className="relative w-full max-w-[650px]">
          <button className="absolute left-3 top-1/2 -translate-y-1/2" onClick={handleSearchNovels}>
            <img
              src={Search}
              alt="Search"
              className="w-5 h-5 opacity-70 hover:opacity-100"
            />
          </button>
          <input
            type="text"
            placeholder="Tìm Kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 text-white rounded-[10px] pl-10 pr-4 py-2 bg-[#1c1c1f] border-0 focus:outline-none focus:ring-0"
          />
          {
            searchTerm && (
              <button
                className="absolute right-9 top-1/2 -translate-y-1/2"
                onClick={() => setSearchTerm('')}
              >
                <img
                  src={Delete}
                  alt="Delete"
                  className="w-5 h-5 opacity-70 hover:opacity-100"
                />
              </button>
            )
          }

          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setSearchTerm('')}
          >
            <img
              src={SearchArea}
              alt="SearchArea"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-5 h-5 opacity-70 hover:opacity-100"
            />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#2e2e2e] rounded-lg shadow-lg z-20 p-4 space-y-4 text-white">
              <div>
                <label className="block mb-1 text-sm font-semibold">Sắp xếp theo</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full bg-[#1c1c1f] text-white px-3 py-2 rounded-md focus:outline-none"
                >
                  <option value="" disabled>Chọn kiểu sắp xếp</option>
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold">Lọc theo tag</label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-[#1c1c1f] text-white px-3 py-2 rounded-md focus:outline-none"
                >
                  <option value="" disabled>Chọn tag</option>
                  {tagOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center h-[50px] ml-4 shrink-0 gap-8">
          <img src={Notification} alt="Notification" />
          <img
            src={auth?.user.avatarUrl || DefaultAvatar}
            alt="User Avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer bg-white"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          />
        </div>
        <img
          src={DefaultAvatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full ml-3 object-cover cursor-pointer bg-white"
        />
      </div>
    </div >
  )
}
