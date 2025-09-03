import { Lock } from "lucide-react";

export const Banned = () => {
  return (
    <div
      className="max-h-screen h-full grid place-items-center
                text-zinc-900 dark:bg-[#0b0e13] dark:text-white px-4"
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center shadow-lg
                   bg-white ring-1 ring-zinc-200
                   dark:bg-[#1b1d22] dark:ring-white/10"
      >
        <div
          className="mx-auto mb-4 h-12 w-12 rounded-xl grid place-items-center
                     bg-rose-100 text-rose-700 ring-1 ring-rose-200
                     dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20"
        >
          <Lock className="h-6 w-6" />
        </div>

        <h2 className="text-lg font-semibold mb-2">Hạn chế quyền truy cập</h2>
        <p className="text-sm text-zinc-600 dark:text-white/70">
          Bạn đã bị hạn chế quyền truy cập từ admin, hãy liên hệ để có thể được
          hỗ trợ.
        </p>
      </div>
    </div>
  );
};
