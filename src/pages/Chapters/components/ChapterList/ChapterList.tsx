import { useMemo } from "react";
import type { GetNovelChaptersParams } from "../../../../api/Novels/novel.api";
import type { NovelChaptersResponse } from "../../../../api/Novels/novel.type";

import { Lock } from "lucide-react";
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

  const acceptedChapterIds = useMemo(
    () => [
      ...(novelData?.purchasedChapterIds ?? []),
      ...(novelData?.freeChapters ?? []),
    ],
    [novelData?.purchasedChapterIds, novelData?.freeChapters]
  );

  const paidList = novelData?.purchasedChapterIds;

  const totalPages = Math.max(novelData?.totalPages ?? 1, 1);
  const currentPage = (params.page ?? 0) + 1;

  return (
    <div className="space-y-5">
      <div
        className="
          rounded-xl px-4 py-3 flex flex-wrap items-center gap-3
          border bg-gray-50 text-gray-800
          border-gray-200
          dark:bg-[#151618]/85 dark:text-white dark:border-white/12
          backdrop-blur shadow-[0_14px_40px_-22px_rgba(0,0,0,0.07)]
          dark:shadow-[0_14px_40px_-22px_rgba(0,0,0,0.7)]
        "
      >
        <span className="text-[12px] font-semibold tracking-wide uppercase text-gray-700 dark:text-white/85">
          Cập nhật gần nhất
        </span>
        <span className="text-[13px] text-[#e35d3b] dark:text-[#ff8a5f]">
          {novelData?.latestUpdatedChapter
            ? `Chương ${novelData?.latestUpdatedChapter.chapterNumber}: ${novelData?.latestUpdatedChapter.title}`
            : "—"}
        </span>
        <span className="text-[12px] text-gray-500 dark:text-gray-400">
          {novelData?.latestUpdatedChapter?.updateAt
            ? formatTicksToRelativeTime(
                novelData?.latestUpdatedChapter.updateAt!
              )
            : novelData?.latestUpdatedChapter?.createAt
            ? formatTicksToRelativeTime(
                novelData?.latestUpdatedChapter.createAt
              )
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
                  "group relative w-full overflow-hidden text-left rounded-2xl px-4 py-3 transition",
                  // light
                  "border bg-white hover:bg-gray-50 border-gray-200 text-gray-900",
                  "shadow-[0_18px_52px_-24px_rgba(0,0,0,0.06)] hover:shadow-[0_26px_72px_-28px_rgba(0,0,0,0.09)]",
                  // dark
                  "dark:border-white/12 dark:bg-[#141416]/92 dark:hover:bg-[#17181b]/92",
                  "dark:text-white dark:shadow-[0_18px_52px_-24px_rgba(0,0,0,0.75)] dark:hover:shadow-[0_26px_72px_-28px_rgba(0,0,0,0.78)]",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_150deg_at_50%_0%,rgba(0,0,0,0.03),transparent_30%)] dark:bg-[conic-gradient(from_150deg_at_50%_0%,rgba(255,255,255,0.06),transparent_30%)]" />
                </div>

                <div className="relative flex items-center gap-3">
                  <div
                    className="
                      shrink-0 grid place-items-center h-9 w-9 rounded-xl
                      bg-gray-100 border border-gray-200 text-[12px] font-semibold text-gray-800
                      dark:bg-white/[0.08] dark:border-white/14 dark:text-white
                    "
                  >
                    {chapter.chapterNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                      {chapter.title}
                    </p>
                    <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
                      {chapter.updateAt
                        ? formatTicksToRelativeTime(chapter.updateAt)
                        : formatTicksToRelativeTime(chapter.createAt)}
                    </p>
                  </div>

                  <div className="ml-2 flex items-center gap-2">
                    {chapter.isPaid &&
                      !novelData?.isAccessFull &&
                      !paidList?.includes(chapter.chapterId) && (
                        <span
                          className="
                            rounded-full px-2 py-1 text-[11px] leading-none
                            border border-amber-300/50 bg-amber-100 text-amber-800
                            dark:border-amber-300/35 dark:bg-amber-300/12 dark:text-amber-200
                          "
                        >
                          {chapter.price?.toLocaleString?.("vi-VN") ??
                            chapter.price}{" "}
                          xu
                        </span>
                      )}
                    {locked ? (
                      <span
                        className="
                          inline-flex h-8 w-8 items-center justify-center rounded-xl
                          bg-gray-100 border border-gray-200 text-gray-700
                          dark:bg-black/45 dark:border-white/14 dark:text-white/85
                        "
                      >
                        <Lock className="w-4 h-4" />
                      </span>
                    ) : (
                      <span
                        className="
                          rounded-full px-2 py-1 text-[11px] leading-none
                          border border-emerald-300/60 bg-emerald-100 text-emerald-800
                          dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-200
                        "
                      >
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
