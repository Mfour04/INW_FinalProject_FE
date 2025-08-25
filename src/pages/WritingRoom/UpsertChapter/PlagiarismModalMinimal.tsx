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
    <div className="fixed inset-0 z-[100] ">
      <div className="absolute inset-0 bg-black/60 " onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-black/10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Phát hiện trùng lặp</h2>
              <span className="px-2 py-0.5 text-[11px] rounded-full ring-1 bg-gray-100 ring-gray-200 text-gray-700">
                {matches.length} nguồn
              </span>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl leading-none"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-2 max-h-[60vh] overflow-y-auto">
            {matches.length === 0 ? (
              <div className="text-sm text-gray-600">
                Không phát hiện nội dung trùng lặp.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {matches.map((m, i) => {
                  const isOpen = openIdx === i;
                  return (
                    <li key={i} className="py-2">
                      <button
                        type="button"
                        onClick={() => setOpenIdx(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full text-left rounded-xl px-3 py-3 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex items-center gap-3">
                            <span
                              className={[
                                "inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-gray-200 bg-white text-gray-600",
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
                                <span className="text-xs text-gray-500">
                                  Tiểu thuyết:
                                </span>
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGoNovel?.(m.novelSlug);
                                  }}
                                  title="Đi tới tiểu thuyết"
                                  className="truncate text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                                >
                                  {m.novelTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
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
                                <span className="text-gray-400 truncate">
                                  ({m.novelSlug})
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-500">
                              {m.matches.length} đoạn
                            </span>
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
                          <div className="mt-2 text-xs text-gray-500">
                            Nhấn để xem các đoạn trùng & so sánh nhanh
                          </div>
                        )}
                      </button>

                      {isOpen && (
                        <div className="mt-2 rounded-xl border border-gray-200 p-3">
                          {m.matches.slice(0, 4).map((c, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg ${
                                idx !== 0
                                  ? "mt-3 border-t border-gray-200 pt-3"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700">
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
                                <div className="rounded-lg bg-white ring-1 ring-gray-200 p-3">
                                  <div className="text-[11px] text-gray-500 mb-1">
                                    Trong bài
                                  </div>
                                  <p className="text-sm text-gray-900 whitespace-pre-wrap line-clamp-5">
                                    {c.inputChunk}
                                  </p>
                                </div>
                                <div className="rounded-lg bg-white ring-1 ring-gray-200 p-3">
                                  <div className="text-[11px] text-gray-500 mb-1">
                                    Nguồn
                                  </div>
                                  <p className="text-sm text-gray-900 whitespace-pre-wrap line-clamp-5">
                                    {c.matchedChunk}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {m.matches.length > 4 && (
                            <div className="px-1 pt-2 text-xs text-gray-500">
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

          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
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
                <path
                  d="M7 5l6 5-6 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
