import { useMemo, useState } from "react";
import LoginLogo from "../../../assets/img/SearchBar/login_logo.png";
import GoogleLogin from "../../../assets/img/SearchBar/google_login.png";
import Button from "../../ButtonComponent";
import { useToast } from "../../../context/ToastContext/toast-context";
import { useMutation } from "@tanstack/react-query";
import { Login, Register } from "../../../api/Auth/auth.api";
import type { LoginParams, RegisterParams } from "../../../api/Auth/auth.type";
import { validatePassword, type PasswordValidationResult } from "../../../utils/validation";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AUTH_ACTIONS = {
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
} as const;

type AuthAction = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];

const initialLoginForm: LoginParams = { username: "", password: "" };
const initialRegisterForm: RegisterParams = { username: "", email: "", password: "" };

type Props = { onClose: () => void };

export default function AuthModal({ onClose }: Props) {
  const toast = useToast();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [action, setAction] = useState<AuthAction>(AUTH_ACTIONS.LOGIN);
  const [loginForm, setLoginForm] = useState<LoginParams>(initialLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterParams>(initialRegisterForm);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const validationPassword: PasswordValidationResult = validatePassword(registerForm.password);
  const isRegisterError = registerForm.password !== confirmPassword && confirmPassword.length > 0;

  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
    mutationFn: (body: LoginParams) => Login(body),
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data.token;
      setAuth({ accessToken, refreshToken, user });
      toast?.onOpen("Bạn đã đăng nhập thành công!");
      onClose();
      if (user.role === "Admin") navigate("/admin");
      else navigate("/");
    },
  });

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: (body: RegisterParams) => Register(body),
    onError: (res: any) => setRegisterMessage(res?.message ?? "Đăng ký thất bại"),
    onSuccess: () => {
      toast?.onOpen("Đăng ký thành công, kiểm tra email để xác thực!");
      setAction(AUTH_ACTIONS.LOGIN);
    },
  });

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) return;
    loginMutate(loginForm);
  };

  const handleRegister = () => {
    if (!validationPassword.isValid || isRegisterError) return;
    registerMutate(registerForm);
  };

  const handleForgot = () => {
    // TODO: replace bằng API quên mật khẩu nếu bạn có.
    if (!loginForm.username.trim()) {
      toast?.onOpen("Hãy nhập email hoặc tên đăng nhập để đặt lại mật khẩu");
      return;
    }
    toast?.onOpen("Nếu tài khoản tồn tại, hướng dẫn đặt lại đã được gửi.");
    setAction(AUTH_ACTIONS.LOGIN);
  };

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
              onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginForm.password}
              onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
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
                onClick={handleLogin}
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
            <div className="text-sm text-left text-[#45454e] mb-4">Hoặc đăng ký tài khoản:</div>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={registerForm.username}
              onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
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
                {validationPassword.errors.map((error, i) => (
                  <div key={i} className="text-sm text-left text-red-500">{error}</div>
                ))}
              </div>
            )}
            {isRegisterError && (
              <div className="text-sm text-left text-red-500">Nhập lại mật khẩu không giống với mật khẩu</div>
            )}
            {registerMessage && (
              <div className="text-sm text-left text-red-500">{registerMessage}</div>
            )}

            <div className="w-full flex justify-center">
              <Button
                isLoading={isRegisterPending}
                onClick={handleRegister}
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
            <div className="text-sm text-left text-[#45454e] mb-4">Quên mật khẩu?</div>
            <input
              type="text"
              placeholder="Email/Tên đăng nhập"
              value={loginForm.username}
              onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
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
                onClick={handleForgot}
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
    }
  }, [
    action,
    loginForm.username,
    loginForm.password,
    confirmPassword,
    registerForm.username,
    registerForm.email,
    registerForm.password,
    isLoginPending,
    isRegisterPending,
    isRegisterError,
    registerMessage,
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[360px] bg-white rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2.5 right-3 h-8 w-8 grid place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition text-xl"
          aria-label="Đóng"
        >
          &times;
        </button>

        <div className="h-[46px] w-full flex items-center justify-center mb-4 overflow-hidden">
          <img src={LoginLogo} alt="Login Logo" className="max-w-[168px] h-auto object-contain" />
        </div>

        <h2 className="text-lg font-semibold text-center mb-1">Chào mừng đến với InkWave</h2>
        <p className="text-sm text-center text-zinc-600 mb-4">Gõ cửa thế giới truyện</p>

        <button className="w-full border border-zinc-300 rounded-lg py-2.5 flex items-center justify-center gap-2 mb-3 hover:bg-zinc-50 transition">
          <img src={GoogleLogin} alt="Google" className="w-5 h-5" />
          <span className="text-sm">Đăng nhập bằng Google</span>
        </button>

        {content}
      </div>
    </div>
  );
}
