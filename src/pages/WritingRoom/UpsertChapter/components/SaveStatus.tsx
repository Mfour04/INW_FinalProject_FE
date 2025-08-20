import { Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";

export const SaveStatus = ({ loading, moderated }: { loading: boolean; moderated: boolean }) => {
  if (moderated) {
    return (
      <div className="hidden md:inline-flex items-center gap-2 text-[12px] px-2.5 h-8 rounded-lg ring-1 ring-amber-300/30 bg-amber-400/10 text-amber-200">
        <ShieldAlert className="h-4 w-4" />
        <span>Đang kiểm duyệt…</span>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="hidden md:inline-flex items-center gap-2 text-[12px] px-2.5 h-8 rounded-lg ring-1 ring-white/15 bg-white/10">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Đang lưu…</span>
      </div>
    );
  }
  return (
    <div className="hidden md:inline-flex items-center gap-2 text-[12px] px-2.5 h-8 rounded-lg ring-1 ring-emerald-300/30 bg-emerald-400/10 text-emerald-200">
      <CheckCircle2 className="h-4 w-4" />
      <span>Đã lưu</span>
    </div>
  );
};
