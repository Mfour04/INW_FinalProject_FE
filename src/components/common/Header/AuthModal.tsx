import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ChevronLeft,
  X,
  Check,
} from "lucide-react";
import LoginLogo from "../../../assets/img/icon_logo.png";
import GoogleLogin from "../../../assets/img/SearchBar/google_login.png";
import Button from "../../ButtonComponent";
import { useToast } from "../../../context/ToastContext/toast-context";
import { useMutation } from "@tanstack/react-query";
import { ForgotPassword, Login, Register } from "../../../api/Auth/auth.api";
import type {
  ForgotPasswordParams,
  LoginParams,
  RegisterParams,
} from "../../../api/Auth/auth.type";
import {
  validatePassword,
  type PasswordValidationResult,
} from "../../../utils/validation";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TextField } from "./TextField";
import { Input } from "./Input";

const AUTH_ACTIONS = {
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
} as const;
type AuthAction = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];

const initialLoginForm: LoginParams = { username: "", password: "" };
const initialRegisterForm: RegisterParams = {
  username: "",
  email: "",
  password: "",
};

const initialForgotForm: ForgotPasswordParams = { email: "" };

type Props = { onClose: () => void };

export default function AuthSplitModal({ onClose }: Props) {
  const toast = useToast();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [action, setAction] = useState<AuthAction>(AUTH_ACTIONS.LOGIN);
  const [loginForm, setLoginForm] = useState<LoginParams>(initialLoginForm);
  const [registerForm, setRegisterForm] =
    useState<RegisterParams>(initialRegisterForm);
  const [forgotPasswordForm, setForgotPasswordForm] =
    useState<ForgotPasswordParams>(initialForgotForm);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const handleLoginUsernameChange = useCallback((v: string) => {
    setLoginForm((p) => ({ ...p, username: v }));
  }, []);

  const handleLoginPasswordChange = useCallback((v: string) => {
    setLoginForm((p) => ({ ...p, password: v }));
  }, []);

  const handleRegisterUsernameChange = useCallback((v: string) => {
    setRegisterForm((p) => ({ ...p, username: v }));
  }, []);

  const handleRegisterEmailChange = useCallback((v: string) => {
    setRegisterForm((p) => ({ ...p, email: v }));
  }, []);

  const handleRegisterPasswordChange = useCallback((v: string) => {
    setRegisterForm((p) => ({ ...p, password: v }));
  }, []);

  const handleConfirmPasswordChange = useCallback((v: string) => {
    setConfirmPassword(v);
  }, []);

  const handleForgotPasswordChange = useCallback((v: string) => {
    setForgotPasswordForm({ email: v });
  }, []);

  const toggleShowPwd1 = useCallback(() => setShowPwd1((s) => !s), []);
  const toggleShowPwd2 = useCallback(() => setShowPwd2((s) => !s), []);

  const validationPassword: PasswordValidationResult = useMemo(
    () => validatePassword(registerForm.password),
    [registerForm.password]
  );

  const isRegisterError = useMemo(
    () =>
      registerForm.password !== confirmPassword && confirmPassword.length > 0,
    [registerForm.password, confirmPassword]
  );

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
    onError: (res: any) =>
      setRegisterMessage(res?.message ?? "Đăng ký thất bại"),
    onSuccess: () => {
      toast?.onOpen("Đăng ký thành công, kiểm tra email để xác thực!");
      setAction(AUTH_ACTIONS.LOGIN);
    },
  });

  const ForgotPasswordMutation = useMutation({
    mutationFn: (params: ForgotPasswordParams) => ForgotPassword(params),
    onSuccess: () => {
      toast?.onOpen("Yêu cầu thành công. Hãy kiểm tra email của bạn");
      setAction(AUTH_ACTIONS.LOGIN);
    },
  });

  const handleLogin = useCallback(() => {
    if (!loginForm.username || !loginForm.password) return;
    loginMutate(loginForm);
  }, [loginForm, loginMutate]);

  const handleRegister = useCallback(() => {
    if (!validationPassword.isValid || isRegisterError) return;
    registerMutate(registerForm);
  }, [
    validationPassword.isValid,
    isRegisterError,
    registerForm,
    registerMutate,
  ]);

  const handleForgot = useCallback(() => {
    if (!forgotPasswordForm.email.trim()) {
      toast?.onOpen("Hãy nhập email để đặt lại mật khẩu");
      return;
    }
    ForgotPasswordMutation.mutate(forgotPasswordForm);
  }, [forgotPasswordForm.email, toast]);

  const content = useMemo(() => {
    switch (action) {
      case AUTH_ACTIONS.LOGIN:
        return (
          <>
            <Input>
              <TextField
                icon={<User size={18} />}
                placeholder="Tên đăng nhập / Email"
                value={loginForm.username}
                onChange={handleLoginUsernameChange}
                autoComplete="username"
              />
            </Input>
            <Input>
              <TextField
                icon={<Lock size={18} />}
                placeholder="Mật khẩu"
                value={loginForm.password}
                onChange={handleLoginPasswordChange}
                autoComplete="current-password"
                type={showPwd1 ? "text" : "password"}
                rightIcon={
                  <button
                    type="button"
                    onClick={toggleShowPwd1}
                    className="p-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                    aria-label={showPwd1 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPwd1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </Input>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-zinc-600 dark:text-zinc-300">
                <input type="checkbox" className="peer sr-only" />
                <span
                  className={[
                    "grid place-items-center h-4 w-4 rounded-[4px] transition-colors",
                    "border border-zinc-400 bg-transparent peer-checked:bg-zinc-900 peer-checked:border-zinc-900",
                    "dark:border-white/35 dark:peer-checked:bg-white dark:peer-checked:border-white",
                    "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
                  ].join(" ")}
                >
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="text-white dark:text-black transition-opacity"
                  />
                </span>
                Ghi nhớ tôi
              </label>

              <button
                onClick={() => setAction(AUTH_ACTIONS.FORGOT_PASSWORD)}
                className="text-[#ff6740] font-bold hover:underline text-xs"
              >
                Quên mật khẩu?
              </button>
            </div>

            <Button
              isLoading={isLoginPending}
              onClick={handleLogin}
              className="w-full h-10 rounded-xl text-sm font-semibold border-0 bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] text-white hover:opacity-95"
            >
              Đăng nhập
            </Button>

            <p className="text-xs text-center text-zinc-600 dark:text-zinc-300">
              Chưa có tài khoản?{" "}
              <button
                onClick={() => setAction(AUTH_ACTIONS.REGISTER)}
                className="text-[#ff6740] font-bold hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </>
        );

      case AUTH_ACTIONS.REGISTER:
        return (
          <>
            <Input>
              <TextField
                icon={<User size={18} />}
                placeholder="Tên đăng nhập"
                value={registerForm.username}
                onChange={handleRegisterUsernameChange}
                autoComplete="username"
              />
            </Input>
            <Input>
              <TextField
                icon={<Mail size={18} />}
                placeholder="Email"
                value={registerForm.email}
                onChange={handleRegisterEmailChange}
                autoComplete="email"
                type="email"
              />
            </Input>
            <Input>
              <TextField
                icon={<Lock size={18} />}
                placeholder="Mật khẩu"
                value={registerForm.password}
                onChange={handleRegisterPasswordChange}
                autoComplete="new-password"
                type={showPwd1 ? "text" : "password"}
                rightIcon={
                  <button
                    type="button"
                    onClick={toggleShowPwd1}
                    className="p-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  >
                    {showPwd1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </Input>
            <Input
              error={
                isRegisterError ? "Mật khẩu nhập lại không khớp" : undefined
              }
            >
              <TextField
                icon={<Lock size={18} />}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                autoComplete="new-password"
                type={showPwd2 ? "text" : "password"}
                rightIcon={
                  <button
                    type="button"
                    onClick={toggleShowPwd2}
                    className="p-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  >
                    {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </Input>

            {!validationPassword.isValid && (
              <ul className="text-sm text-red-600 dark:text-red-400 pl-2 -mt-0.5 space-y-0.5">
                {validationPassword.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
            {registerMessage && (
              <p className="text-sm text-red-600 dark:text-red-400 -mt-0.5">
                {registerMessage}
              </p>
            )}

            <Button
              isLoading={isRegisterPending}
              onClick={handleRegister}
              className="w-full h-10 rounded-xl text-sm font-semibold border-0 bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] text-white hover:opacity-95"
            >
              Tạo tài khoản
            </Button>

            <p className="text-xs text-center text-zinc-600 dark:text-zinc-300">
              Đã có tài khoản?{" "}
              <button
                onClick={() => setAction(AUTH_ACTIONS.LOGIN)}
                className="text-[#ff6740] font-bold hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </>
        );

      case AUTH_ACTIONS.FORGOT_PASSWORD:
        return (
          <>
            <button
              onClick={() => setAction(AUTH_ACTIONS.LOGIN)}
              className="inline-flex items-center gap-1 text-sm font-bold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              <ChevronLeft size={16} /> Về đăng nhập
            </button>

            <Input>
              <TextField
                icon={<Mail size={18} />}
                placeholder="Email"
                value={forgotPasswordForm.email}
                onChange={handleForgotPasswordChange}
                autoComplete="username"
              />
            </Input>

            <Button
              onClick={handleForgot}
              isLoading={ForgotPasswordMutation.isPending}
              className="w-full h-10 rounded-xl text-sm font-semibold border-0 bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] text-white hover:opacity-95"
            >
              Gửi hướng dẫn đặt lại
            </Button>

            <p className="text-xs text-center text-zinc-600 dark:text-zinc-300">
              Nhập email hoặc tên đăng nhập để nhận hướng dẫn đặt lại mật khẩu.
            </p>
          </>
        );
    }
  }, [
    action,
    loginForm,
    registerForm,
    confirmPassword,
    showPwd1,
    showPwd2,
    isRegisterError,
    validationPassword,
    registerMessage,
    isLoginPending,
    isRegisterPending,
    handleLoginUsernameChange,
    handleLoginPasswordChange,
    handleRegisterUsernameChange,
    handleRegisterEmailChange,
    handleRegisterPasswordChange,
    handleConfirmPasswordChange,
    handleForgotPasswordChange,
    toggleShowPwd1,
    toggleShowPwd2,
    handleLogin,
    handleRegister,
    handleForgot,
    Input,
    TextField,
  ]);

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={[
          "relative z-[101] min-h-screen grid lg:grid-cols-2",
          "bg-[#f7f8fa] text-zinc-900",
          "dark:bg-[#0a0f16] dark:text-white",
        ].join(" ")}
      >
        <div className="relative hidden lg:block">
          <div
            className="absolute inset-0 block dark:hidden"
            style={{
              background: [
                "radial-gradient(42rem 22rem at 12% -6%, rgba(255,103,64,0.08), transparent 60%)",
                "radial-gradient(34rem 20rem at 88% 106%, rgba(120,170,255,0.07), transparent 60%)",
                "linear-gradient(0deg, rgba(255,255,255,0.55), rgba(255,255,255,0.55))",
              ].join(", "),
            }}
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background: [
                "linear-gradient(180deg, #0f141b 0%, #0d1319 55%, #0b1016 100%)",
                "radial-gradient(80rem 40rem at 20% -10%, rgba(0,0,0,0.48), transparent 65%)",
                "radial-gradient(70rem 34rem at 120% 110%, rgba(0,0,0,0.38), transparent 65%)",
              ].join(", "),
            }}
          />
          <div className="relative h-full flex flex-col justify-center p-12">
            {action === AUTH_ACTIONS.REGISTER ? (
              <>
                <h1 className="text-3xl font-semibold leading-tight">
                  Tham gia InkWave ngay
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-md text-sm">
                  Đồng bộ tủ truyện & gợi ý cá nhân hóa
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold leading-tight">
                  Gõ cửa thế giới truyện
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-md text-sm">
                  Khám phá – Lưu trữ – Đồng hành cùng tác giả yêu thích
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center p-4">
          <div
            className={[
              "relative w-full max-w-[380px] rounded-2xl px-6 py-4",
              "bg-white/95 shadow-2xl supports-[backdrop-filter]:backdrop-blur",
              "dark:bg-white/8 dark:border dark:border-white/10 dark:shadow-[0_12px_44px_-14px_rgba(0,0,0,0.55)] dark:backdrop-blur-xl",
            ].join(" ")}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="h-[40px] w-full flex items-center justify-center mb-3">
              <img
                src={LoginLogo}
                alt="InkWave"
                className="max-w-[140px] h-[40px] object-contain"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold">
                {action === AUTH_ACTIONS.REGISTER
                  ? "Tạo tài khoản"
                  : "Chào mừng trở lại"}
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 -mt-1 mb-3">
              {action === AUTH_ACTIONS.REGISTER
                ? "Mất 1 phút để bạn bắt đầu hành trình đọc mới."
                : "Đăng nhập để đồng bộ tủ truyện & tiến trình đọc."}
            </p>

            {action === AUTH_ACTIONS.REGISTER ? (
              <button
                className={[
                  "w-full h-10 rounded-xl transition flex items-center justify-center gap-2",
                  "bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-200",
                  "dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:border-white/20",
                ].join(" ")}
              >
                <img src={GoogleLogin} alt="Google" className="w-4 h-4" />
                <span className="text-sm font-bold">
                  Tạo tài khoản với Google
                </span>
              </button>
            ) : (
              <button
                className={[
                  "w-full h-10 rounded-xl transition flex items-center justify-center gap-2",
                  "bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-200",
                  "dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:border-white/20",
                ].join(" ")}
              >
                <img src={GoogleLogin} alt="Google" className="w-4 h-4" />
                <span className="text-sm font-bold">Tiếp tục với Google</span>
              </button>
            )}

            <div className="my-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                hoặc
              </span>
              <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            </div>

            <div className="space-y-2.5">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
