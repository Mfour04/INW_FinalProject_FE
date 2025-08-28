import type { ModerationAIResponse } from "../../../api/AI/ai.type";

type Props = {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
  data: ModerationAIResponse | null;
};

const BLOCK_LIMIT = 0.8;

export const ModerationReviewModal = ({
  open,
  onClose,
  onContinue,
  data,
}: Props) => {
  if (!open || !data) return null;

  const blocked = data.sensitive.some((s) => s.score >= BLOCK_LIMIT);

  const overallBadge = () => {
    if (blocked)
      return (
        <span className="px-2 py-0.5 text-[11px] rounded-full ring-1
          bg-red-100 text-red-700 ring-red-200
          dark:bg-red-500/15 dark:text-red-200 dark:ring-red-400/40">
          Bị chặn
        </span>
      );
    if (data.flagged)
      return (
        <span className="px-2 py-0.5 text-[11px] rounded-full ring-1
          bg-amber-100 text-amber-700 ring-amber-200
          dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/40">
          Cảnh báo
        </span>
      );
    return (
      <span className="px-2 py-0.5 text-[11px] rounded-full ring-1
        bg-emerald-100 text-emerald-700 ring-emerald-200
        dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/40">
        An toàn
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />

      {/* Dialog wrapper */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl rounded-2xl shadow-2xl
            bg-white text-zinc-900 ring-1 ring-zinc-200
            dark:bg-[#0b1017] dark:text-white dark:ring-white/10"
          role="dialog"
          aria-modal="true"
          aria-label="Kết quả kiểm duyệt"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4
              border-b border-zinc-200
              dark:border-white/10"
          >
            <div className="flex items-center gap-5">
              <h2 className="text-lg font-semibold">Kết quả kiểm duyệt</h2>
              {overallBadge()}
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-full
                hover:bg-zinc-100 text-xl leading-none
                dark:hover:bg-white/10"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          {/* Notes */}
          {blocked && (
            <div
              className="mx-5 mt-4 rounded-lg p-3 text-sm
                bg-red-50 text-red-700 ring-1 ring-red-200
                dark:bg-red-500/10 dark:text-red-200 dark:ring-red-400/30"
            >
              Có hạng mục vi phạm ≥ 80%. Bạn cần điều chỉnh nội dung để có thể
              tiếp tục.
            </div>
          )}

          {!blocked && data.flagged && (
            <div
              className="mx-5 mt-4 rounded-lg p-3 text-sm
                bg-amber-50 text-amber-700 ring-1 ring-amber-200
                dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-400/30"
            >
              Nội dung có yếu tố nhạy cảm. Vui lòng xem xét kỹ trước khi tiếp
              tục.
            </div>
          )}

          {/* Body */}
          <div className="px-5 py-4 max-h-[55vh] overflow-y-auto">
            <table
              className="w-full text-left text-sm border-collapse
                text-zinc-800 dark:text-white/90"
            >
              <thead
                className="text-xs uppercase tracking-wide
                  bg-zinc-100 text-zinc-700
                  dark:bg-white/5 dark:text-white/90"
              >
                <tr>
                  <th className="px-4 py-3">Hạng mục</th>
                  <th className="px-4 py-3">Điểm</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.sensitive.length ? (
                  data.sensitive.map((s, i) => {
                    const percent = Math.round(s.score * 100);
                    const severe = s.score >= BLOCK_LIMIT;
                    const warn = s.score >= 0.4 && s.score < BLOCK_LIMIT;

                    const barClass = severe
                      ? "bg-red-500"
                      : warn
                      ? "bg-amber-400"
                      : "bg-emerald-500";

                    const badgeClass = severe
                      ? "bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-400/40"
                      : warn
                      ? "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/40"
                      : "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/40";

                    const label = severe ? "Nghiêm trọng" : warn ? "Cảnh báo" : "An toàn";

                    return (
                      <tr
                        key={i}
                        className="border-b border-zinc-100 hover:bg-zinc-50
                          dark:border-white/5 dark:hover:bg-white/5"
                      >
                        <td className="px-4 py-3">{s.category}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-36 h-2 rounded-full overflow-hidden
                              bg-zinc-200
                              dark:bg-white/10"
                            >
                              <div
                                className={`h-2 ${barClass}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="font-semibold tabular-nums">
                              {percent}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 text-[11px] rounded-full ring-1 ${badgeClass}`}
                          >
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-zinc-500 dark:text-white/60"
                      colSpan={3}
                    >
                      Không có hạng mục rủi ro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end px-5 py-4
              border-t border-zinc-200
              dark:border-white/10"
          >
            <button
              onClick={!blocked ? onContinue : undefined}
              disabled={blocked}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold text-white",
                "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
                "shadow-[0_6px_16px_rgba(255,103,64,0.35)]",
                "transition-transform active:scale-95 hover:brightness-110",
                blocked ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              Tiếp tục
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
