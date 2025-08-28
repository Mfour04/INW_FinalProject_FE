// src/pages/Auth/ResetPasswordCardMock.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordParams } from "../../../api/Auth/auth.type";
import { ResetPassword } from "../../../api/Auth/auth.api";
import { useToast } from "../../../context/ToastContext/toast-context";

type PasswordValidationResult = { isValid: boolean; errors: string[] };
function validatePassword(pwd: string): PasswordValidationResult {
  const errs: string[] = [];
  if (pwd.length < 8)
    if (!/[A-Za-z]/.test(pwd) || !/\d/.test(pwd))
      errs.push(
        "Mật khẩu phải dài 8–32 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt."
      );
  return { isValid: errs.length === 0, errors: errs };
}

function DarkInput({
  value,
  onChange,
  placeholder,
  type = "text",
  leftIcon,
  rightIcon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="h-12 w-full rounded-xl bg-[#111316] border border-[#2c2c2c] text-white flex items-center gap-2 px-3">
      <span className="text-zinc-400">{leftIcon}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500"
        autoComplete="new-password"
      />
      {rightIcon}
    </div>
  );
}

function GradientButton({
  children,
  disabled,
  loading,
  onClick,
}: React.PropsWithChildren<{
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}>) {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        "h-12 w-full rounded-xl text-[15px] font-semibold",
        "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] text-white",
        "shadow-[0_8px_28px_-10px_rgba(255,103,64,0.55)]",
        "disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95",
      ].join(" ")}
    >
      {loading ? "Đang xử lý..." : children}
    </button>
  );
}

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [pwd, setPwd] = useState("");
  const [cfm, setCfm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const rule = useMemo(() => validatePassword(pwd), [pwd]);
  const mismatch = cfm.length > 0 && pwd !== cfm;
  const canSubmit = !!token && rule.isValid && !mismatch && !loading;

  const ResetPasswordMutation = useMutation({
    mutationFn: (param: ResetPasswordParams) => ResetPassword(param),
    onSuccess: () => {
      toast?.onOpen("Đổi mật khẩu thành công. Hãy thử đăng nhập");
    },
  });

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await ResetPasswordMutation.mutate({
        token: token,
        confirmPassword: cfm,
        newPassword: pwd,
      });
      setTimeout(() => navigate("/"), 1100);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token)
      toast?.onOpen("Liên kết đổi mật khẩu không hợp lệ hoặc đã hết hạn.");
  }, [token]);

  return (
    <div className="fixed inset-0 z-[100]">
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
            <h1 className="text-3xl font-semibold leading-tight">
              Gõ cửa thế giới truyện
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-md text-sm">
              Khám phá – Lưu trữ – Đồng hành cùng tác giả yêu thích
            </p>
          </div>
        </div>

        {/* Right card */}
        <div className="flex items-center justify-center p-6">
          <form
            onSubmit={submit}
            className={[
              "relative w-full max-w-[380px] rounded-2xl px-6 py-4",
              "bg-white/95 shadow-2xl supports-[backdrop-filter]:backdrop-blur",
              "dark:bg-white/8 dark:border dark:border-white/10 dark:shadow-[0_12px_44px_-14px_rgba(0,0,0,0.55)] dark:backdrop-blur-xl",
            ].join(" ")}
          >
            <h2 className="text-xl font-semibold mt-3">Đặt lại mật khẩu</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Nhập mật khẩu mới cho tài khoản của bạn.
            </p>

            <div className="mt-5 space-y-3.5">
              <DarkInput
                value={pwd}
                onChange={setPwd}
                placeholder="Mật khẩu mới"
                type={show1 ? "text" : "password"}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShow1((s) => !s)}
                    className="text-zinc-400 hover:text-white"
                  >
                    {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div>
                <DarkInput
                  value={cfm}
                  onChange={setCfm}
                  placeholder="Xác nhận mật khẩu"
                  type={show2 ? "text" : "password"}
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShow2((s) => !s)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                {mismatch && (
                  <p className="mt-1.5 text-sm text-red-400">
                    Mật khẩu nhập lại không khớp.
                  </p>
                )}
              </div>

              {!rule.isValid && (
                <ul className="text-sm text-red-400 pl-1 space-y-0.5">
                  {rule.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}

              <GradientButton
                loading={ResetPasswordMutation.isPending}
                disabled={!canSubmit}
                onClick={() => submit()}
              >
                Cập nhật
              </GradientButton>

              {!token && (
                <p className="text-sm text-red-400 text-center">
                  Liên kết không hợp lệ hoặc đã hết hạn.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
