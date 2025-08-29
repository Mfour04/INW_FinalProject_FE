import { useEffect } from "react";
import { LogIn, Lock } from "lucide-react";

type LoginNeededProps = {
  onLogin?: () => void;
  toLoginHref?: string;
  title?: string;
  subtitle?: string;
};

export const LoginNeeded = ({
  onLogin,
  toLoginHref = "/login",
  title = "Cần đăng nhập",
  subtitle = "Vui lòng đăng nhập để tiếp tục.",
}: LoginNeededProps) => {
  const goLogin = () =>
    onLogin ? onLogin() : (window.location.href = toLoginHref);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="max-h-screen h-full grid place-items-center bg-zinc-50 text-zinc-900 dark:bg-[#0b0e13] dark:text-white">
      <div className="w-[min(92vw,420px)] rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-white/[0.06] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-zinc-100 dark:bg-white/10 text-[#ff6740]">
            <Lock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold">{title}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={goLogin}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-[#ff6740] text-white hover:bg-[#e7633f] transition"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};
