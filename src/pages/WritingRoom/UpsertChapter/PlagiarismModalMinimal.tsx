import { useState } from "react";
import type { Matches } from "../../../api/AI/ai.type";
import { badge, pct } from "./util";

type Props = {
  open: boolean;
  onClose: () => void;
  matches: Matches[];
  onGoNovel?: (slug: string) => void;
  onGoChapter?: (slug: string, chapterId: string) => void;
};

export const PlagiarismModalMinimal = ({
  open,
  onClose,
  matches,
  onGoNovel,
  onGoChapter,
}: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-4xl rounded-2xl shadow-2xl
            bg-white text-zinc-900 ring-1 ring-zinc-200
            dark:bg-[#0b1017] dark:text-white dark:ring-white/10"
          role="dialog"
          aria-modal="true"
          aria-label="Phát hiện trùng lặp"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4
              border-b border-zinc-200 dark:border-white/10"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Phát hiện trùng lặp</h2>
              <span
                className="px-2 py-0.5 text-[11px] rounded-full ring-1
                  bg-zinc-100 text-zinc-700 ring-zinc-200
                  dark:bg-white/10 dark:text-white/90 dark:ring-white/15"
              >
                {matches.length} nguồn
              </span>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full
                hover:bg-zinc-100 text-2xl leading-none
                dark:hover:bg-white/10"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-2 max-h-[60vh] overflow-y-auto">
            {matches.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-white/70">
                Không phát hiện nội dung trùng lặp.
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200 dark:divide-white/10">
                {matches.map((m, i) => {
                  const isOpen = openIdx === i;
                  return (
                    <li key={i} className="py-2">
                      <button
                        type="button"
                        onClick={() => setOpenIdx(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full text-left rounded-xl px-3 py-3
                          hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-200
                          dark:hover:bg-white/5 dark:focus:ring-white/20 transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex items-center gap-3">
                            <span
                              className={[
                                "inline-flex h-6 w-6 items-center justify-center rounded-full",
                                "ring-1 ring-zinc-200 bg-white text-zinc-600",
                                "dark:bg-white/10 dark:ring-white/15 dark:text-white/90",
                                "transition-transform",
                                isOpen ? "rotate-90" : "",
                              ].join(" ")}
                              aria-hidden
                            >
                              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
                                <path
                                  d="M7 5l6 5-6 5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500 dark:text-white/60">
                                  Tiểu thuyết:
                                </span>
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGoNovel?.(m.novelSlug);
                                  }}
                                  title="Đi tới tiểu thuyết"
                                  className="truncate text-sm font-medium text-blue-600 hover:underline cursor-pointer
                                    dark:text-sky-400"
                                >
                                  {m.novelTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-white/70 mt-0.5">
                                <span>Chương:</span>
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGoChapter?.(m.novelSlug, m.chapterId);
                                  }}
                                  title="Đi tới chương"
                                  className="underline cursor-pointer"
                                >
                                  {m.chapterTitle}
                                </span>
                                <span className="text-zinc-400 dark:text-white/40 truncate">
                                  ({m.novelSlug})
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-zinc-500 dark:text-white/60">
                              {m.matches.length} đoạn
                            </span>
                            {/* badge() đã tự style theo ngưỡng — giữ nguyên */}
                            <span
                              className={`px-2 py-0.5 text-[11px] rounded-full ring-1 ${badge(
                                m.similarity
                              )}`}
                            >
                              {pct(m.similarity)}%
                            </span>
                          </div>
                        </div>

                        {!isOpen && (
                          <div className="mt-2 text-xs text-zinc-500 dark:text-white/60">
                            Nhấn để xem các đoạn trùng & so sánh nhanh
                          </div>
                        )}
                      </button>

                      {isOpen && (
                        <div
                          className="mt-2 rounded-xl border p-3
                            border-zinc-200 dark:border-white/10"
                        >
                          {m.matches.slice(0, 4).map((c, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg ${
                                idx !== 0
                                  ? "mt-3 border-t border-zinc-200 dark:border-white/10 pt-3"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-700 dark:text-white/80">
                                  Đoạn trùng
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[11px] rounded-full ring-1 ${badge(
                                    c.similarity
                                  )}`}
                                >
                                  {pct(c.similarity)}%
                                </span>
                              </div>

                              <div className="mt-2 grid md:grid-cols-2 gap-3">
                                <div
                                  className="rounded-lg p-3
                                    bg-white ring-1 ring-zinc-200
                                    dark:bg-white/5 dark:ring-white/10"
                                >
                                  <div className="text-[11px] text-zinc-500 dark:text-white/60 mb-1">
                                    Trong bài
                                  </div>
                                  <p className="text-sm text-zinc-900 dark:text-white/90 whitespace-pre-wrap line-clamp-5">
                                    {c.inputChunk}
                                  </p>
                                </div>
                                <div
                                  className="rounded-lg p-3
                                    bg-white ring-1 ring-zinc-200
                                    dark:bg-white/5 dark:ring-white/10"
                                >
                                  <div className="text-[11px] text-zinc-500 dark:text-white/60 mb-1">
                                    Nguồn
                                  </div>
                                  <p className="text-sm text-zinc-900 dark:text-white/90 whitespace-pre-wrap line-clamp-5">
                                    {c.matchedChunk}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {m.matches.length > 4 && (
                            <div className="px-1 pt-2 text-xs text-zinc-500 dark:text-white/60">
                              + {m.matches.length - 4} đoạn nữa…
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end px-6 py-4
              border-t border-zinc-200 dark:border-white/10"
          >
            <button
              onClick={onClose}
              type="button"
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold text-white",
                "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
                "shadow-[0_6px_16px_rgba(255,103,64,0.35)]",
                "transition-transform active:scale-95 hover:brightness-110",
              ].join(" ")}
            >
              Đóng
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
                <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
