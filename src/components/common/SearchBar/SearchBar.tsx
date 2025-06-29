import { useState } from 'react';
import DefaultAvatar from '../../../assets/img/default_avt.png'
import LoginLogo from '../../../assets/img/SearchBar/login_logo.png'
import GoogleLogin from '../../../assets/img/SearchBar/google_login.png'
import Notification from '../../../assets/svg/SearchBar/notification-02-stroke-rounded.svg'
import Person from '@mui/icons-material/Person'
import History from '@mui/icons-material/History'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useMutation } from '@tanstack/react-query';
import { Login } from '../../../api/Login/login.api';
import type { LoginParams } from '../../../api/Login/login.type';
import { useAuth } from '../../../hooks/useAuth';

const initialLoginForm: LoginParams = {
  username: '',
  password: ''
}

export const SearchBar = () => {
  const { auth, setAuth, logout } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginParams>(initialLoginForm);

  const { mutate } = useMutation({
    mutationFn: (body: LoginParams) => {
      return Login(body)
    },
    onSuccess: (data) => {
    const { accessToken, refreshToken, user } = data.data.token;
    setAuth({ accessToken, refreshToken, user });
  },
  })

  const handleLoginButtonClick = () => {
    mutate(loginForm, {
      onSuccess: () => {
        console.log('Login success');
        setIsPopupOpen(false);
      },
    })
  }

  const handleLogoutClick = () => {
    logout();
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="h-[90px] flex items-center justify-between px-12 md:px-13 lg:px-[50px] bg-white dark:bg-[#0f0f11]">
        <input
          type="text"
          placeholder="Tìm Kiếm..."
          className="w-full max-w-[650px] h-11 text-white rounded-[10px] px-4 py-2 bg-[#1c1c1f] border-0 focus:outline-none focus:ring-0"
        />

        <div className="flex items-center h-[50px] ml-4 shrink-0 gap-8">
          <img src={Notification} alt="Notification" />
          <img
            src={auth?.user.avatarUrl || DefaultAvatar}
            alt="User Avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer bg-white"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          />
        </div>
      </div>
      {isPopupOpen && (
        <> 
        {
          auth?.user? 
          <div className="absolute right-12 mt-[-6px] w-[210px] h-[#281px] bg-[#1c1c1f] text-white rounded-xl shadow-lg z-50 p-4">
            <div className="flex items-center gap-4">
              <img
                src={auth.user.avatarUrl || DefaultAvatar}
                alt="User Avatar"
                className="w-15 h-15 rounded-full object-cover bg-white"
              />
              <div className='flex flex-col gap-0.5'>
                <div className="font-bold text-sm">{auth.user.username}</div>
                <div className="text-xs text-gray-400">@{auth.user.username}</div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    🥇<span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    🔥<span>1</span>
                  </div>
                </div>
              </div>
            </div>



            <div className="flex justify-between items-center mt-4">
              <div className="text-yellow-300 font-bold text-sm">🪙 {auth.user.coin || 0}</div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-semibold">
                Nạp thêm
              </button>
            </div>

            <div className="mt-4 pt-3  space-y-2 text-sm border-t border-white">
              <div className="flex items-center gap-2 cursor-pointer hover:text-orange-400">
                <Person /> <span>Trang cá nhân</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-orange-400">
                <History /> <span>Lịch sử giao dịch</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-orange-400">
                <Settings /> <span>Cài đặt</span>
              </div>
            </div>

            <div onClick={() => handleLogoutClick()} className="mt-4 border-t border-white pt-3 text-sm cursor-pointer hover:text-red-400 flex items-center gap-2">
              <Logout /> <span>Đăng xuất</span>
            </div>
          </div>
        : <div className="fixed inset-0 z-50 flex items-center justify-center  bg-[rgba(0,0,0,0.4)]">
            <div className="w-[350px] bg-white shadow-lg rounded-xl p-6 transform transition-all duration-200 ease-out scale-100 opacity-100">
              <div className="max-h-[50px] w-full overflow-hidden flex justify-center items-center mb-4">
                <img
                  src={LoginLogo}
                  alt="Login Logo"
                  className="max-w-42 h-auto object-contain"
                />
              </div>
              <button
                  onClick={() => setIsPopupOpen(false)}
                  className="absolute cursor-pointer top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Đóng popup"
                  >
                  &times;
              </button>
              <h2 className="text-lg font-semibold text-center mb-2">Chào mừng đến với InkWave</h2>
              <p className="text-sm text-center text-gray-600 mb-4">Gõ cửa thế giới truyện</p>

              <button className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 mb-4 hover:bg-gray-100">
                <img src={GoogleLogin} alt="Google" className="w-5 h-5" />
                <span>Đăng nhập bằng Google</span>
              </button>

              <div className="text-sm text-center text-gray-500 mb-4">Hoặc đăng nhập tài khoản:</div>

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
              <div className="text-right text-sm hover:underline text-gray-500 cursor-pointer mb-4">
                Quên mật khẩu?
              </div>

              <div className="w-full flex justify-center">
                <button 
                  onClick={handleLoginButtonClick}
                  className="w-[200px] h-[34px] flex items-center justify-center gap-2.5 rounded-2xl border border-gray-300 bg-orange-500 text-white text-sm font-semibold px-[25px] py-[7px] hover:bg-orange-600">
                  ĐĂNG NHẬP
                </button>
              </div>


              <div className="text-sm text-center text-gray-600 mt-4">
                Nếu bạn chưa có tài khoản,{" "}
                <span className="text-[#ff6740] hover:underline cursor-pointer">đăng ký ngay</span>
              </div>
            </div>
          </div>
        }
          
        </>
      )}

    </>
  )
}
