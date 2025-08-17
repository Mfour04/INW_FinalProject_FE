import { useEffect, useMemo, useRef, useState } from "react";
import Lock from "@mui/icons-material/Lock";
import { formatTicksToRelativeTime } from "../../utils/date_format";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext/toast-context";
import { useAuth } from "../../hooks/useAuth";
import type { ChapterByNovel } from "../../api/Chapters/chapter.type";

interface Props {
  open: boolean;
  onClose: () => void;
  chapters: ChapterByNovel[];
  novelId: string;
  novelSlug: string;
}

export const ChapterListModal = ({
  open,
  onClose,
  chapters,
  novelSlug,
}: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { auth } = useAuth();
  const { chapterId: readingChapterId } = useParams();

  const [q, setQ] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    onClose();
    setQ("");
    setSortDir("asc");
  };

  const data = useMemo(() => {
    const base = (chapters ?? []).filter((c) => !c.is_draft);
    const filtered = q.trim()
      ? base.filter(
          (c) =>
            c.title?.toLowerCase().includes(q.toLowerCase()) ||
            String(c.chapter_number).includes(q)
        )
      : base;
    const sorted = [...filtered].sort((a, b) =>
      sortDir === "asc"
        ? a.chapter_number - b.chapter_number
        : b.chapter_number - a.chapter_number
    );
    return sorted;
  }, [chapters, q, sortDir]);

  if (!open) return null;

  const handleClickChapter = (chapterId: string, isPaid: boolean) => {
    if (!chapterId) return;
    if (isPaid) {
      !auth?.user
        ? toast?.onOpen("Bạn cần đăng nhập để đọc chương bị khóa")
        : toast?.onOpen("Bạn không sở hữu chương này!");
      return;
    }
    navigate(`/novels/${novelSlug}/${chapterId}`);
    handleClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!dialogRef.current) return;
      if (!dialogRef.current.contains(target)) handleClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          ref={dialogRef}
          className="w-[92vw] max-w-[800px] max-h-[84vh] rounded-2xl bg-[#0b0c0e]/95 text-white shadow-[0_40px_120px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/10 backdrop-blur-md flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <div className="border-b border-white/10 px-5 pt-4 pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-bold tracking-tight">
                  Danh sách chương
                </h2>
                <p className="text-[12.5px] text-white/55">
                  {chapters?.filter((c) => !c.is_draft).length ?? 0} chương
                </p>
              </div>
              <button
                onClick={handleClose}
                className="h-9 w-9 grid place-items-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
                aria-label="Đóng"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tiêu đề hoặc số chương…"
                className="flex-1 h-[35px] rounded-md bg-white/[0.1] ring-1 ring-white/25 px-3 text-[13px] placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#ff6740]/40"
              />
              <button
                onClick={() =>
                  setSortDir((s) => (s === "asc" ? "desc" : "asc"))
                }
                className="h-[35px] rounded-md px-3.5 text-[13px] font-medium bg-white/[0.1] ring-1 ring-white/25 hover:bg-white/[0.16] transition focus:ring-2 focus:ring-[#ff6740]/40"
                title="Đổi thứ tự"
              >
                {sortDir === "asc" ? "↑ Tăng" : "↓ Giảm"}
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto px-5 py-5 scrollbar-strong scrollbar-neon"
            style={{ scrollbarGutter: "stable both-edges" }}
          >
            <div className="relative mx-[-2px] pl-3 pr-5">
              <ul className="divide-y divide-white/5">
                {data.map((chapter) => {
                  const isPaid = chapter.is_paid;
                  const price = chapter.price ?? 0;
                  const isReading =
                    readingChapterId &&
                    String(chapter.id) === String(readingChapterId);

                  return (
                    <li key={chapter.id} className="py-1">
                      <button
                        onClick={() => handleClickChapter(chapter.id, isPaid)}
                        className={[
                          "group relative w-full text-left mx-1 px-4 py-3 rounded-xl transition overflow-hidden",
                          "bg-[#141416]/92 hover:bg-[#17181b]/92",
                          "ring-1 ring-white/10 hover:ring-white/15",
                          "shadow-[0_18px_52px_-24px_rgba(0,0,0,0.75)] hover:shadow-[0_26px_72px_-28px_rgba(0,0,0,0.78)]",
                          isReading
                            ? "bg-white/[0.08] ring-2 ring-[#ff6a3d]/60"
                            : "",
                        ].join(" ")}
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 transition ${
                            isReading
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <div className="absolute -inset-[1px] rounded-xl bg-[conic-gradient(from_150deg_at_50%_0%,rgba(255,255,255,0.06),transparent_30%)]" />
                        </div>

                        <div className="relative flex items-center gap-3">
                          <div
                            className={`shrink-0 grid place-items-center h-9 w-9 rounded-lg ring-1 text-[12px] font-semibold tabular-nums ${
                              isReading
                                ? "bg-[#ff6a3d]/20 ring-[#ff6a3d]/40"
                                : "bg-white/[0.08] ring-white/14"
                            }`}
                          >
                            {chapter.chapter_number}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-medium">
                              {chapter.title}
                            </p>
                            <div
                              className={`mt-1 flex items-center gap-2 text-[12px] ${
                                isReading ? "text-white/70" : "text-white/55"
                              }`}
                            >
                              <span>
                                {chapter.updated_at
                                  ? formatTicksToRelativeTime(
                                      chapter.updated_at
                                    )
                                  : chapter.created_at
                                  ? formatTicksToRelativeTime(
                                      chapter.created_at
                                    )
                                  : "—"}
                              </span>
                            </div>
                          </div>

                          {isPaid ? (
                            <span className="flex items-center gap-2">
                              {price > 0 && (
                                <span className="rounded-full px-2 py-[3px] leading-none text-[11px] border border-amber-300/40 bg-amber-300/12 text-amber-200">
                                  {price.toLocaleString?.("vi-VN") ?? price} xu
                                </span>
                              )}
                              <span
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${
                                  isReading
                                    ? "bg-black/35 ring-white/20"
                                    : "bg-black/45 ring-white/14"
                                }`}
                              >
                                <Lock sx={{ width: 16, height: 16 }} />
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </button>
                    </li>
                  );
                })}

                {data.length === 0 && (
                  <li className="px-4 py-10 text-center text-white/60 text-sm">
                    Không tìm thấy chương phù hợp.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-4"></div>
        </div>
      </div>
    </div>
  );
};
