import { useMemo } from "react";
import type { GetNovelChaptersParams } from "../../../../api/Novels/novel.api";
import type { NovelChaptersResponse } from "../../../../api/Novels/novel.type";

import Lock from "@mui/icons-material/Lock";
import { formatTicksToRelativeTime } from "../../../../utils/date_format";
import { clamp } from "../../utils";
import { MiniPager } from "./MiniPager";

export type ChapterListProps = {
  novelData?: NovelChaptersResponse;
  handleClickChapter: (id: string, isPaid: boolean, price: number) => void;
  params: GetNovelChaptersParams;
  setParams: React.Dispatch<React.SetStateAction<GetNovelChaptersParams>>;
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
          {lastChapter
            ? `Chương ${lastChapter.chapterNumber}: ${lastChapter.title}`
            : "—"}
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
                  handleClickChapter(
                    chapter.chapterId,
                    chapter.isPaid,
                    chapter.price
                  )
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
                        {chapter.price?.toLocaleString?.("vi-VN") ??
                          chapter.price}{" "}
                        xu
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
