// PasswordSection.tsx
import { useMemo, useState } from "react";
import { SectionCard } from "../components/SectionCard";
import { InputShell } from "../components/InputShell";
import { Eye, EyeOff, Info, Check, X } from "lucide-react";

type Props = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;

  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  setShowCurrentPassword: (v: boolean) => void;
  setShowNewPassword: (v: boolean) => void;
  setShowConfirmPassword: (v: boolean) => void;

  isCurrentPasswordValid: boolean | null;
  isNewPasswordValid: boolean | null;
  isConfirmPasswordValid: boolean | null;

  passwordError: string;
  isPasswordChangeEnabled: boolean;
  isLoading: boolean;

  onChangePassword: () => void;
};

export const PasswordSection = ({
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,
  isCurrentPasswordValid,
  isNewPasswordValid,
  isConfirmPasswordValid,
  passwordError,
  isPasswordChangeEnabled,
  isLoading,
  onChangePassword,
}: Props) => {
  const [showRules, setShowRules] = useState(false);
  const [touchedNew, setTouchedNew] = useState(false);

  const reqs = useMemo(() => {
    const hasLen = newPassword.length >= 8 && newPassword.length <= 32;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);
    const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const passed = [hasLen, hasUpper, hasNum, hasSpec].filter(Boolean).length;
    const pct = (passed / 4) * 100;
    const tone =
      passed <= 1
        ? "bg-red-500"
        : passed === 2
        ? "bg-amber-500"
        : passed === 3
        ? "bg-emerald-500"
        : "bg-emerald-600";
    return { hasLen, hasUpper, hasNum, hasSpec, passed, pct, tone };
  }, [newPassword]);

  const StrengthBar = () => (
    <div className="mt-2">
      <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
        <div
          className={`${reqs.tone} h-full rounded-full transition-all`}
          style={{ width: `${reqs.pct}%` }}
        />
      </div>
      <p className="text-[11px] mt-1 text-zinc-500 dark:text-zinc-400">
        {reqs.passed <= 1
          ? "Mật khẩu yếu"
          : reqs.passed === 2
          ? "Mật khẩu trung bình"
          : reqs.passed === 3
          ? "Mật khẩu mạnh"
          : "Mật khẩu rất mạnh"}
      </p>
    </div>
  );

  const RuleRow = ({ ok, text }: { ok: boolean; text: string }) => (
    <li className="flex items-center gap-2 text-[12px] text-zinc-700 dark:text-zinc-300">
      {ok ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      {text}
    </li>
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Đổi mật khẩu"
        desc="Tăng cường bảo mật cho tài khoản."
      >
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <InputShell label="Mật khẩu hiện tại">
              <div className="relative max-w-xl">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={[
                    "w-full rounded-lg pr-10 px-3.5 py-3 text-sm",
                    "bg-zinc-50 ring-1 ring-zinc-200 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff8a5c]/40",
                    "dark:bg-[#0f1115] dark:text-white dark:placeholder-zinc-500 dark:ring-white/10 dark:focus:ring-[#ff8a5c]/35",
                  ].join(" ")}
                  placeholder="Nhập mật khẩu hiện tại"
                  aria-label="Mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                  aria-label={
                    showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {currentPassword && (
                <span
                  className={`text-xs mt-1 ${
                    isCurrentPasswordValid ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {isCurrentPasswordValid ? "*Đúng" : "*Không đúng"}
                </span>
              )}
            </InputShell>

            <InputShell label="Mật khẩu mới">
              <div className="relative max-w-xl">
                <input
                  onBlur={() => setTouchedNew(true)}
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={[
                    "w-full rounded-lg pr-20 px-3.5 py-3 text-sm",
                    "bg-zinc-50 ring-1 ring-zinc-200 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff8a5c]/40",
                    "dark:bg-[#0f1115] dark:text-white dark:placeholder-zinc-500 dark:ring-white/10 dark:focus:ring-[#ff8a5c]/35",
                  ].join(" ")}
                  placeholder="Nhập mật khẩu mới"
                  aria-label="Mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRules((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white lg:hidden"
                  aria-label="Xem yêu cầu mật khẩu"
                >
                  <Info className="h-5 w-5" />
                </button>

                {(showRules ||
                  (!!touchedNew && isNewPasswordValid === false)) && (
                  <div className="absolute left-0 right-0 mt-2 z-20 lg:hidden">
                    <div className="rounded-xl p-3 sm:p-4 shadow-xl bg-white ring-1 ring-zinc-200 dark:bg-[#0f1115] dark:ring-white/10">
                      <p className="text-[13px] font-medium text-zinc-800 dark:text-white mb-2">
                        Yêu cầu mật khẩu
                      </p>
                      <StrengthBar />
                      <ul className="mt-2 space-y-1.5">
                        <RuleRow ok={reqs.hasLen} text="8–32 ký tự" />
                        <RuleRow
                          ok={reqs.hasUpper}
                          text="Ít nhất 1 chữ hoa (A–Z)"
                        />
                        <RuleRow ok={reqs.hasNum} text="Ít nhất 1 số (0–9)" />
                        <RuleRow
                          ok={reqs.hasSpec}
                          text="Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)"
                        />
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              {newPassword && (
                <span
                  className={`text-xs mt-1 ${
                    isNewPasswordValid ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {isNewPasswordValid ? "*Hợp lệ" : "*Không hợp lệ"}
                </span>
              )}
            </InputShell>

            <InputShell label="Nhập lại mật khẩu mới">
              <div className="relative max-w-xl">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={[
                    "w-full rounded-lg pr-10 px-3.5 py-3 text-sm",
                    "bg-zinc-50 ring-1 ring-zinc-200 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff8a5c]/40",
                    "dark:bg-[#0f1115] dark:text-white dark:placeholder-zinc-500 dark:ring-white/10 dark:focus:ring-[#ff8a5c]/35",
                  ].join(" ")}
                  placeholder="Nhập lại mật khẩu mới"
                  aria-label="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <span
                  className={`text-xs mt-1 ${
                    isConfirmPasswordValid ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {isConfirmPasswordValid
                    ? "*Trùng khớp với mật khẩu mới"
                    : "*Không trùng khớp với mật khẩu mới"}
                </span>
              )}
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">* {passwordError}</p>
              )}
            </InputShell>

            <div className="flex justify-end">
              <button
                onClick={onChangePassword}
                disabled={!isPasswordChangeEnabled || isLoading}
                className={[
                  "rounded-full px-5 py-2 text-sm font-semibold transition",
                  isPasswordChangeEnabled
                    ? "text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110"
                    : "text-zinc-500 bg-zinc-200 dark:bg-white/10 dark:text-zinc-400 cursor-not-allowed",
                ].join(" ")}
              >
                {isLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div
              className={[
                "sticky top-4 rounded-2xl p-4",
                "bg-white ring-1 ring-zinc-200 shadow-sm",
                "dark:bg-[#0f1115] dark:ring-white/10",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Yêu cầu mật khẩu
                  </p>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                    Thử đặt mật khẩu mạnh để bảo vệ tài khoản của bạn.
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <StrengthBar />
              </div>

              <ul className="mt-3 space-y-2">
                <RuleRow ok={reqs.hasLen} text="8–32 ký tự" />
                <RuleRow ok={reqs.hasUpper} text="Ít nhất 1 chữ hoa (A–Z)" />
                <RuleRow ok={reqs.hasNum} text="Ít nhất 1 số (0–9)" />
                <RuleRow
                  ok={reqs.hasSpec}
                  text="Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)"
                />
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
