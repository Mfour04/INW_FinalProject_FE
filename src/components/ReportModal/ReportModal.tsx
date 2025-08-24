import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldAlert, Check } from "lucide-react";

type ReportReason =
  | "nudity"
  | "violence"
  | "hate"
  | "spam"
  | "copyright"
  | "scam"
  | "illegal"
  | "other";

export type ReportPayload = {
  novelId: string;
  chapterId?: string;  
  reason: ReportReason;
  message?: string;
};

type Props = {
  isOpen: boolean;
  novelTitle?: string;
  novelId: string;
  onClose: () => void;
  onSubmit: (payload: ReportPayload) => Promise<void> | void;
};

const REASONS: { id: ReportReason; label: string }[] = [
  { id: "nudity", label: "Nội dung nhạy cảm" },
  { id: "violence", label: "Bạo lực/ghê rợn" },
  { id: "hate", label: "Thù hằn/quấy rối" },
  { id: "spam", label: "Spam/quảng cáo" },
  { id: "copyright", label: "Vi phạm bản quyền" },
  { id: "scam", label: "Lừa đảo/thông tin sai lệch" },
  { id: "illegal", label: "Hoạt động phi pháp" },
  { id: "other", label: "Khác" },
];

export const ReportModal: React.FC<Props> = ({
  isOpen,
  novelTitle,
  novelId,
  onClose,
  onSubmit,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason(null);
      setMessage("");
      setSubmitting(false);
    }
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

  const mustFillMessage = reason === "other";
  const canSubmit =
    !!reason && (!mustFillMessage || message.trim().length > 0) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !reason) return;
    setSubmitting(true);
    try {
      await onSubmit({ novelId, reason, message: message.trim() || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/50" />

      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-xl bg-white dark:bg-[#1a1a1a] shadow-xl ring-1 ring-black/10 dark:ring-white/10 p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold">
              Báo cáo {novelTitle ? `“${novelTitle}”` : "truyện"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reasons */}
        <div className="space-y-1.5 mb-4 max-h-[280px] overflow-y-auto px-1 pr-2">
          {REASONS.map((r) => {
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
              >
                <span>{r.label}</span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* Message */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder={
            mustFillMessage ? "Vui lòng mô tả chi tiết..." : "Mô tả chi tiết (tuỳ chọn)"
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
            {submitting ? "Đang gửi…" : "Gửi báo cáo"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
