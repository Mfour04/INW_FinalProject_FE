import type { ChapterForm } from "../UpsertChapter";
import { formatHumanDate } from "../util";
import { Badge } from "./Badge";
import { Row } from "./Row";

export const StatusSummary = ({
  chapterForm,
}: {
  chapterForm: ChapterForm;
}) => {
  const publishNode = (() => {
    if (chapterForm.isDraft) return <Badge tone="zinc">Bản nháp</Badge>;
    if (chapterForm.scheduledAt) {
      const d = new Date(chapterForm.scheduledAt);
      return <Badge tone="amber">Hẹn ngày: {formatHumanDate(d)}</Badge>;
    }
    if (chapterForm.isPublic)
      return <Badge tone="emerald">Xuất bản ngay</Badge>;
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

      <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] p-4 mt-3">
        <p className="text-[12.5px] text-white/70 leading-relaxed">
          Những thiết lập này có thể thay đổi sau khi bạn lưu. Hẹn ngày xuất bản
          sẽ công khai chương đúng ngày đã chọn.
        </p>
      </div>
    </>
  );
};
