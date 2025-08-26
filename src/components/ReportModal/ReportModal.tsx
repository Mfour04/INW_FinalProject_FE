import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldAlert, Check } from "lucide-react";

export type ReportReason =
  | "nudity"
  | "violence"
  | "hate"
  | "spam"
  | "copyright"
  | "scam"
  | "illegal"
  | "other"
  | "harassment"
  | "doxxing"
  | "offtopic"
  | "misinfo"
  | "spoiler";

export const REPORT_REASON_CODE: Record<ReportReason, number> = {
  nudity: 0,
  violence: 1,
  hate: 2,
  spam: 3,
  copyright: 4,
  scam: 5,
  illegal: 6,
  other: 7,
  harassment: 8,
  doxxing: 9,
  offtopic: 10,
  misinfo: 11,
  spoiler: 12,
};

export type ReportPayload = {
  novelId?: string;
  chapterId?: string;
  commentId?: string;
  postId?: string;
  reason: ReportReason;
  message?: string;
  reasonCode?: number;
};

type ReasonItem = { id: ReportReason; label: string };

type BaseProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  reasons: ReasonItem[];
  mustFillWhen?: ReportReason[];
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => Promise<void> | void;
  payloadExtras: Omit<ReportPayload, "reason" | "message" | "reasonCode">;
};

const ReportModalBase = ({
  isOpen,
  title,
  subtitle,
  reasons,
  isLoading,
  mustFillWhen = ["other"],
  onClose,
  onSubmit,
  payloadExtras,
}: BaseProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setReason(null);
    setMessage("");
    setSubmitting(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mustFillMessage = !!reason && mustFillWhen.includes(reason);
  const canSubmit =
    !!reason && (!mustFillMessage || message.trim().length > 0) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !reason) return;
    setSubmitting(true);
    try {
      const reasonCode = REPORT_REASON_CODE[reason];
      await onSubmit({
        ...payloadExtras,
        reason,
        reasonCode,
        message: message.trim() || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-xl bg-white dark:bg-[#1a1a1a] shadow-xl ring-1 ring-black/10 dark:ring-white/10 p-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 mt-0.5 text-orange-500 shrink-0" />
            <div>
              <h3 className="text-[15px] font-semibold">{title}</h3>
              {subtitle ? (
                <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reasons */}
        <div className="space-y-1.5 mb-4 max-h-[280px] overflow-y-auto px-1 pr-2">
          {reasons.map((r) => {
            const active = reason === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "text-white bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a]"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                }`}
                aria-pressed={active}
              >
                <span>{r.label}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* Message */}
        <label className="block text-xs mb-1 text-gray-600 dark:text-white/60">
          Mô tả chi tiết {mustFillMessage ? "(bắt buộc)" : "(tuỳ chọn)"}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder={
            mustFillMessage
              ? "Vui lòng mô tả rõ vấn đề bạn gặp phải…"
              : "Thêm ngữ cảnh để admin xử lý nhanh hơn…"
          }
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-sm p-2 mb-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-sm ring-1 ring-gray-300 dark:ring-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold text-white transition ${
              canSubmit
                ? "bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a] hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading || submitting ? "Đang gửi…" : "Gửi báo cáo"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const NOVEL_REASONS: ReasonItem[] = [
  { id: "copyright", label: "Vi phạm bản quyền / đạo nhái tổng thể" },
  { id: "illegal", label: "Nội dung/hoạt động phi pháp" },
  { id: "nudity", label: "Nội dung 18+ quá mức / trái quy định" },
  { id: "violence", label: "Bạo lực/ghê rợn xuyên suốt" },
  { id: "hate", label: "Thù hằn/quấy rối có hệ thống" },
  { id: "spam", label: "Spam nhiều chương / câu kéo rating" },
  { id: "scam", label: "Lừa đảo / thông tin sai lệch" },
  { id: "other", label: "Khác" },
];

export type ReportNovelModalProps = {
  isOpen: boolean;
  novelId: string;
  novelTitle?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => Promise<void> | void;
};

export const ReportNovelModal = ({
  isOpen,
  novelId,
  novelTitle,
  isLoading,
  onClose,
  onSubmit,
}: ReportNovelModalProps) => (
  <ReportModalBase
    isOpen={isOpen}
    title={`Báo cáo truyện${novelTitle ? ` “${novelTitle}”` : ""}`}
    subtitle="Áp dụng khi vấn đề mang tính tổng thể của tác phẩm."
    reasons={NOVEL_REASONS}
    isLoading={isLoading}
    mustFillWhen={["other"]}
    onClose={onClose}
    onSubmit={onSubmit}
    payloadExtras={{ novelId }}
  />
);

const CHAPTER_REASONS: ReasonItem[] = [
  { id: "nudity", label: "Nội dung nhạy cảm quá mức ở chương" },
  { id: "violence", label: "Bạo lực/ghê rợn ở chương" },
  { id: "hate", label: "Thù hằn/quấy rối trong chương" },
  { id: "spam", label: "Chèn link quảng cáo / spam trong chương" },
  { id: "copyright", label: "Chương vi phạm bản quyền / sao chép" },
  { id: "scam", label: "Lừa đảo / thông tin sai lệch trong chương" },
  { id: "illegal", label: "Nội dung/hoạt động phi pháp trong chương" },
  { id: "other", label: "Khác (mô tả rõ chương bị lỗi, dịch sai, hỏng ảnh…)" },
];

export type ReportChapterModalProps = {
  isOpen: boolean;
  novelId: string;
  chapterId: string;
  novelTitle?: string;
  chapterTitle?: string;
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => Promise<void> | void;
};

export const ReportChapterModal = ({
  isOpen,
  novelId,
  chapterId,
  novelTitle,
  chapterTitle,
  onClose,
  onSubmit,
}: ReportChapterModalProps) => (
  <ReportModalBase
    isOpen={isOpen}
    title={`Báo cáo chương${chapterTitle ? ` “${chapterTitle}”` : ""}`}
    subtitle={
      novelTitle
        ? `Thuộc truyện “${novelTitle}”.`
        : "Chỉ xử lý riêng chương này."
    }
    reasons={CHAPTER_REASONS}
    mustFillWhen={["other"]}
    onClose={onClose}
    onSubmit={onSubmit}
    payloadExtras={{ novelId, chapterId }}
  />
);

const COMMENT_REASONS: ReasonItem[] = [
  { id: "harassment", label: "Quấy rối / công kích cá nhân" },
  { id: "hate", label: "Ngôn từ thù hằn / phân biệt đối xử" },
  { id: "spam", label: "Spam / quảng cáo" },
  { id: "doxxing", label: "Tiết lộ thông tin cá nhân (doxxing)" },
  { id: "spoiler", label: "Tiết lộ nội dung (spoiler) không cảnh báo" },
  { id: "offtopic", label: "Lạc đề / phá rối thảo luận" },
  { id: "illegal", label: "Nội dung/hoạt động phi pháp" },
  { id: "other", label: "Khác" },
];

export type ReportCommentModalProps = {
  isOpen: boolean;
  commentId: string;
  commentPreview?: string;
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => Promise<void> | void;
};

export const ReportCommentModal = ({
  isOpen,
  commentId,
  commentPreview,
  onClose,
  onSubmit,
}: ReportCommentModalProps) => (
  <ReportModalBase
    isOpen={isOpen}
    title={`Báo cáo bình luận`}
    subtitle={
      commentPreview
        ? `“${commentPreview.slice(0, 60)}${
            commentPreview.length > 60 ? "…" : ""
          }”`
        : "Áp dụng cho một bình luận cụ thể."
    }
    reasons={COMMENT_REASONS}
    mustFillWhen={["other", "doxxing", "harassment", "hate"]}
    onClose={onClose}
    onSubmit={onSubmit}
    payloadExtras={{ commentId }}
  />
);

const POST_REASONS: ReasonItem[] = [
  { id: "misinfo", label: "Thông tin sai lệch / gây hiểu lầm" },
  { id: "scam", label: "Lừa đảo (link, bán hàng, phishing…)" },
  { id: "spam", label: "Spam / quảng cáo" },
  { id: "nudity", label: "Nội dung nhạy cảm không gắn cảnh báo" },
  { id: "hate", label: "Ngôn từ thù hằn / kích động" },
  { id: "violence", label: "Bạo lực / hình ảnh ghê rợn" },
  { id: "illegal", label: "Nội dung/hoạt động phi pháp" },
  { id: "copyright", label: "Vi phạm bản quyền (tài liệu/hình ảnh…)" },
  { id: "offtopic", label: "Lạc đề / không phù hợp chuyên mục" },
  { id: "other", label: "Khác" },
];

export type ReportPostModalProps = {
  isOpen: boolean;
  postId: string;
  postTitle?: string;
  forumName?: string;
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => Promise<void> | void;
};

export const ReportPostModal = ({
  isOpen,
  postId,
  postTitle,
  forumName,
  onClose,
  onSubmit,
}: ReportPostModalProps) => (
  <ReportModalBase
    isOpen={isOpen}
    title={`Báo cáo bài viết${postTitle ? ` “${postTitle}”` : ""}`}
    subtitle={
      forumName
        ? `Thuộc chuyên mục ${forumName}.`
        : "Áp dụng cho một bài viết trên forum."
    }
    reasons={POST_REASONS}
    mustFillWhen={["other", "misinfo", "scam", "copyright"]}
    onClose={onClose}
    onSubmit={onSubmit}
    payloadExtras={{ postId }}
  />
);
