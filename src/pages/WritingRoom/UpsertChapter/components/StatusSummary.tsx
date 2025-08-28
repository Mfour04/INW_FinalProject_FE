import type { ChapterForm } from "../UpsertChapter";
import { formatHumanDate } from "../util";
import { Badge } from "./Badge";
import { Row } from "./Row";

export const StatusSummary = ({ chapterForm }: { chapterForm: ChapterForm }) => {
  const publishNode = (() => {
    if (chapterForm.isDraft) return <Badge tone="zinc">Bản nháp</Badge>;
    if (chapterForm.scheduledAt) {
      const d = new Date(chapterForm.scheduledAt);
      return <Badge tone="amber">Hẹn ngày: {formatHumanDate(d)}</Badge>;
    }
    if (chapterForm.isPublic) return <Badge tone="emerald">Xuất bản ngay</Badge>;
    return <span className="text-zinc-600 dark:text-white/60">Chưa chọn ngày</span>;
  })();

  return (
    <>
      <div
        className={[
          "rounded-2xl p-4",
          // Light
          "bg-white ring-1 ring-zinc-200 shadow-sm",
          // Dark
          "dark:bg-white/[0.03] dark:ring-1 dark:ring-white/10 dark:shadow-none",
        ].join(" ")}
      >
        <p className="text-sm font-medium mb-3 text-zinc-900 dark:text-white">Tóm tắt</p>
        <div className="space-y-2 text-[13px] text-zinc-800 dark:text-white/90">
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

      <div
        className={[
          "rounded-2xl p-4 mt-3 text-[12.5px] leading-relaxed",
          // Light
          "bg-white ring-1 ring-zinc-200 text-zinc-700 shadow-sm",
          // Dark
          "dark:bg-white/[0.02] dark:ring-1 dark:ring-white/10 dark:text-white/70 dark:shadow-none",
        ].join(" ")}
      >
        Những thiết lập này có thể thay đổi sau khi bạn lưu. Hẹn ngày xuất bản sẽ công khai chương đúng ngày đã chọn.
      </div>
    </>
  );
};
