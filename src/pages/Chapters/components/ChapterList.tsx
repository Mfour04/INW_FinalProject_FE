import { useMemo, useState, useEffect } from "react";
import type { GetNovelChaptersParams } from "../../../api/Novels/novel.api";
import type { NovelChaptersResponse } from "../../../api/Novels/novel.type";
import ArrowLeft02 from "../../../assets/svg/Novels/arrow-left-02-stroke-rounded.svg";
import ArrowRight02 from "../../../assets/svg/Novels/arrow-right-02-stroke-rounded.svg";
import Lock from "@mui/icons-material/Lock";
import { formatTicksToRelativeTime } from "../../../utils/date_format";

export type ChapterListProps = {
  novelData?: NovelChaptersResponse;
  handleClickChapter: (id: string, isPaid: boolean, price: number) => void;
  params: GetNovelChaptersParams;
  setParams: React.Dispatch<React.SetStateAction<GetNovelChaptersParams>>;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

const MiniPager = ({
  totalPages,
  currentPage,
  onChange,
}: {
  totalPages: number;
  currentPage: number;
  onChange: (p1: number) => void;
}) => {
  const [valStr, setValStr] = useState(String(currentPage));
  useEffect(() => setValStr(String(currentPage)), [currentPage]);

  const commit = () => {
    const onlyDigits = valStr.replace(/\D+/g, "");
    const asNum = onlyDigits === "" ? currentPage : parseInt(onlyDigits, 10);
    const next = clamp(asNum, 1, totalPages);
    if (next !== currentPage) onChange(next);
    setValStr(String(next));
  };

  return (
    <div className="flex justify-center">
      <div
        className={[
          "inline-flex items-center gap-2 rounded-full",
          "border border-white/12 bg-[#141517]/85 backdrop-blur-xl",
          "px-2.5 py-2 shadow-[0_16px_44px_-22px_rgba(0,0,0,0.75)]",
        ].join(" ")}
        role="group"
        aria-label="Phân trang"
      >
        <button
          onClick={() => onChange(clamp(currentPage - 1, 1, totalPages))}
          disabled={currentPage === 1}
          className="h-8 w-8 grid place-items-center rounded-full border border-white/14 bg-white/[0.06] hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Trang trước"
          aria-label="Trang trước"
        >
          <img src={ArrowLeft02} alt="prev" />
        </button>

        <div className="inline-flex items-center gap-1.5 text-[12px] text-white/85">
          <span className="hidden sm:inline">Trang</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={valStr}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              setValStr(v);
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className={[
              "w-12 h-8 text-center rounded-md tabular-nums",
              "bg-black/25 border border-white/12 text-white text-[13px]",
              "focus:outline-none focus:ring-2 focus:ring-[#ff784f]/40",
              "appearance-none", 
            ].join(" ")}
            aria-label="Đi tới trang"
          />
          <span className="text-white/60">/ {totalPages}</span>
        </div>

        <button
          onClick={() => onChange(clamp(currentPage + 1, 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 grid place-items-center rounded-full border border-white/14 bg-white/[0.06] hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Trang sau"
          aria-label="Trang sau"
        >
          <img src={ArrowRight02} alt="next" />
        </button>
      </div>
    </div>
  );
};

export const ChapterList = ({
  novelData,
  handleClickChapter,
  params,
  setParams,
}: ChapterListProps) => {
  const chapters = novelData?.allChapters ?? [];
  const lastChapter = chapters[chapters.length - 1];

  const acceptedChapterIds = useMemo(
    () => [
      ...(novelData?.purchasedChapterIds ?? []),
      ...(novelData?.freeChapters ?? []),
    ],
    [novelData?.purchasedChapterIds, novelData?.freeChapters]
  );

  const totalPages = Math.max(novelData?.totalPages ?? 1, 1);
  const currentPage = (params.page ?? 0) + 1;

  return (
    <div className="space-y-5">
      {/* Header cập nhật gần nhất */}
      <div className="rounded-xl border border-white/12 bg-[#151618]/85 backdrop-blur px-4 py-3 flex flex-wrap items-center gap-3 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.7)]">
        <span className="text-[12px] font-semibold tracking-wide text-white/85 uppercase">
          Cập nhật gần nhất
        </span>
        <span className="text-[13px] text-[#ff8a5f]">
          {lastChapter ? `Chương ${lastChapter.chapterNumber}: ${lastChapter.title}` : "—"}
        </span>
        <span className="text-[12px] text-gray-400">
          {lastChapter?.updateAt
            ? formatTicksToRelativeTime(lastChapter.updateAt!)
            : lastChapter?.createAt
            ? formatTicksToRelativeTime(lastChapter.createAt)
            : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chapters
          .filter((c) => !c.isDraft)
          .map((chapter) => {
            const locked =
              chapter.isPaid &&
              !novelData?.isAccessFull &&
              !acceptedChapterIds.includes(chapter.chapterId);

            return (
              <button
                key={chapter.chapterId}
                onClick={() =>
                  handleClickChapter(chapter.chapterId, chapter.isPaid, chapter.price)
                }
                className={[
                  "group relative w-full overflow-hidden text-left",
                  "rounded-2xl border border-white/12",
                  "bg-[#141416]/92 hover:bg-[#17181b]/92 backdrop-blur",
                  "px-4 py-3 transition",
                  "shadow-[0_18px_52px_-24px_rgba(0,0,0,0.75)] hover:shadow-[0_26px_72px_-28px_rgba(0,0,0,0.78)]",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_150deg_at_50%_0%,rgba(255,255,255,0.06),transparent_30%)]" />
                </div>

                <div className="relative flex items-center gap-3">
                  <div className="shrink-0 grid place-items-center h-9 w-9 rounded-xl bg-white/[0.08] border border-white/14 text-[12px] font-semibold">
                    {chapter.chapterNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-white">
                      {chapter.title}
                    </p>
                    <p className="mt-1 text-[12px] text-gray-400">
                      {chapter.updateAt
                        ? formatTicksToRelativeTime(chapter.updateAt)
                        : formatTicksToRelativeTime(chapter.createAt)}
                    </p>
                  </div>

                  <div className="ml-2 flex items-center gap-2">
                    {chapter.isPaid && (
                      <span className="rounded-full px-2 py-1 text-[11px] leading-none border border-amber-300/35 bg-amber-300/12 text-amber-200">
                        {chapter.price?.toLocaleString?.("vi-VN") ?? chapter.price} xu
                      </span>
                    )}
                    {locked ? (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/45 border border-white/14">
                        <Lock sx={{ width: 16, height: 16 }} />
                      </span>
                    ) : (
                      <span className="rounded-full px-2 py-1 text-[11px] leading-none border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                        Mở
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      <MiniPager
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={(p) =>
          setParams((prev) => ({
            ...prev,
            page: clamp(p, 1, totalPages) - 1,
          }))
        }
      />
    </div>
  );
};
