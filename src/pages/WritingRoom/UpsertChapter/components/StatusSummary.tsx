import type { ChapterForm } from "../UpsertChapter";

export const StatusSummary = ({ chapterForm }: { chapterForm: ChapterForm }) => {
  const publishNode = (() => {
    if (chapterForm.isDraft) return <Badge tone="zinc">Bản nháp</Badge>;
    if (chapterForm.scheduledAt) {
      const d = new Date(chapterForm.scheduledAt);
      return <Badge tone="amber">Hẹn ngày: {formatHumanDate(d)}</Badge>;
    }
    if (chapterForm.isPublic) return <Badge tone="emerald">Xuất bản ngay</Badge>;
    return <span className="text-white/60">Chưa chọn ngày</span>;
  })();

  return (
    <>
      <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-medium mb-3">Tóm tắt</p>
        <div className="space-y-2 text-[13px]">
          <Row label="Trạng thái">{publishNode}</Row>

          <Row label="Chi phí">
            {chapterForm.isPaid ? (
              <div className="inline-flex items-center gap-2">
                <Badge tone="rose">Tính phí</Badge>
                <span>{chapterForm.price} coin</span>
              </div>
            ) : (
              <Badge tone="sky">Miễn phí</Badge>
            )}
          </Row>
        </div>
      </div>

      <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-4">
        <p className="text-[12.5px] text-white/70 leading-relaxed">
          Những thiết lập này có thể thay đổi sau khi bạn lưu. Hẹn ngày
          xuất bản sẽ công khai chương đúng ngày đã chọn.
        </p>
      </div>
    </>
  );
};

/* UI helpers (Row/Badge + date) */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/60">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}
function Badge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: "zinc" | "emerald" | "amber" | "rose" | "sky";
}) {
  const map: Record<string, string> = {
    zinc: "bg-white/[0.06] ring-white/10",
    emerald: "bg-emerald-500/20 ring-emerald-400/40 text-emerald-200",
    amber: "bg-amber-500/20 ring-amber-400/40 text-amber-200",
    rose: "bg-rose-500/20 ring-rose-400/40 text-rose-200",
    sky: "bg-sky-500/20 ring-sky-400/40 text-sky-200",
  };
  return (
    <span className={["inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ring-1", map[tone]].join(" ")}>
      {children}
    </span>
  );
}
function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatHumanDate(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
