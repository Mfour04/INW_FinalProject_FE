import { Loader2, ShieldAlert, CheckCircle2, DraftingCompass } from "lucide-react";

type Props = { loading: boolean; moderated: boolean; isDraftChange: boolean };

const baseBox = "hidden md:inline-flex items-center gap-2 text-[12px] px-2.5 h-8 rounded-lg ring-1";

export const SaveStatus = ({ loading, moderated, isDraftChange }: Props) => {
  if (moderated) {
    return (
      <div
        className={[
          baseBox,
          // Light
          "ring-amber-300/40 bg-amber-50 text-amber-700",
          // Dark
          "dark:ring-amber-300/30 dark:bg-amber-400/10 dark:text-amber-200",
        ].join(" ")}
      >
        <ShieldAlert className="h-4 w-4" />
        <span>Đang kiểm duyệt…</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={[
          baseBox,
          // Light
          "ring-zinc-300 bg-zinc-100 text-zinc-700",
          // Dark
          "dark:ring-white/15 dark:bg-white/10 dark:text-white",
        ].join(" ")}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Đang lưu…</span>
      </div>
    );
  }

  if (!isDraftChange) {
    return (
      <div
        className={[
          baseBox,
          // Light
          "ring-zinc-300 bg-zinc-100 text-zinc-700",
          // Dark
          "dark:ring-white/15 dark:bg-white/10 dark:text-white",
        ].join(" ")}
      >
        <DraftingCompass className="h-4 w-4" />
        <span>Lưu nháp</span>
      </div>
    );
  }

  return (
    <div
      className={[
        baseBox,
        // Light
        "ring-emerald-300/50 bg-emerald-50 text-emerald-700",
        // Dark
        "dark:ring-emerald-300/30 dark:bg-emerald-400/10 dark:text-emerald-200",
      ].join(" ")}
    >
      <CheckCircle2 className="h-4 w-4" />
      <span>Đã lưu</span>
    </div>
  );
};
