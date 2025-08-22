import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

import { GetChapter, GetChapters } from "../../api/Chapters/chapter.api";
import { GetNovelByUrl } from "../../api/Novels/novel.api";
import type { ChapterByNovel } from "../../api/Chapters/chapter.type";
import { useToast } from "../../context/ToastContext/toast-context";

import { useSpeech } from "react-text-to-speech";
import { htmlToPlainText } from "../../utils/text-speech";
import { useAuth } from "../../hooks/useAuth";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useReadingProcess } from "./hooks/useReadingProcess";
import { ReaderPrefs } from "./components/ReaderPrefs";
import { SpeechControls } from "./components/SpeechControls";
import { CommentUser } from "../CommentUser/CommentUser";
import { ChapterListModal } from "./ChapterListModal";
import { renderTextWithNewlines } from "../NovelRead/util";

const WIDTH_LEVELS = [880, 1080, 1320] as const;
const DEFAULTS = { fontSize: 18, lineHeight: 1.65, widthIdx: 1 as number };

export const NovelRead = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speechState, setSpeechState] = useState<
    "started" | "paused" | "stopped"
  >("stopped");
  const [openPrefs, setOpenPrefs] = useState(false);

  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { auth } = useAuth();

  const [fontSize, setFontSize] = useLocalStorageState<number>(
    "reader:fontSize",
    DEFAULTS.fontSize
  );
  const [lineHeight, setLineHeight] = useLocalStorageState<number>(
    "reader:lineHeight",
    DEFAULTS.lineHeight
  );
  const [widthIdx, setWidthIdx] = useLocalStorageState<number>(
    "reader:widthIdx",
    DEFAULTS.widthIdx
  );

  useEffect(() => {
    const prev = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {}
    return () => {
      try {
        history.scrollRestoration = prev as ScrollRestoration;
      } catch {}
    };
  }, []);

  const pageTopRef = useRef<HTMLDivElement | null>(null);

  const { data: novelInfo } = useQuery({
    queryKey: ["novel-by-slug", novelId],
    queryFn: async () => {
      try {
        const res = await GetNovelByUrl(novelId!);
        return res.data.data;
      } catch {
        return null;
      }
    },
    enabled: !!novelId,
  });

  const { data, isLoading: isChapterLoading } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: async () => (await GetChapter(chapterId!)).data.data,
    enabled: !!chapterId,
  });

  const { data: chapterList } = useQuery({
    queryKey: ["chapter-list", novelInfo?.novelInfo?.novelId || novelId],
    queryFn: async () => {
      const actualNovelId = novelInfo?.novelInfo?.novelId || novelId;
      try {
        const res = await GetChapters(actualNovelId!);
        return res.data.data as ChapterByNovel[];
      } catch {
        return [];
      }
    },
    enabled: !!(novelInfo?.novelInfo?.novelId || novelId),
  });

  const { data: ReadingProcess } = useQuery({
    queryKey: ["readingProcess", auth?.user?.userId],
    queryFn: () =>
      import("../../api/ReadingHistory/reading.api").then(
        ({ GetReadingProcess }) =>
          GetReadingProcess(auth?.user!.userId!).then((res) => res.data)
      ),
    enabled: !!auth?.user?.userId,
  });

  const isCurrentNovel = Array.isArray(ReadingProcess?.data)
    ? !!ReadingProcess.data.find(
        (p: any) => p.novelId === novelInfo?.novelInfo?.novelId
      )
    : false;

  useReadingProcess({
    isCurrentNovel,
    novelId: novelInfo?.novelInfo?.novelId,
    chapterId: chapterId!,
    userId: auth?.user?.userId,
  });

  const finalChapterList = novelInfo?.allChapters || chapterList || [];

  const adaptedChapterList = useMemo(
    () =>
      finalChapterList.map((chap: any) =>
        "id" in chap
          ? chap
          : {
              id: chap.chapterId,
              novel_id: chap.novelId,
              title: chap.title,
              content: chap.content,
              chapter_number: chap.chapterNumber,
              is_paid: chap.isPaid,
              price: chap.price,
              scheduled_at: chap.scheduledAt,
              is_lock: chap.isLock,
              is_draft: chap.isDraft,
              is_public: chap.isPublic,
              created_at: chap.createAt,
              updated_at: chap.updateAt,
            }
      ),
    [finalChapterList]
  );

  const currentChapter = finalChapterList.find((chap: any) =>
    "id" in chap ? chap.id === chapterId : chap.chapterId === chapterId
  );

  const currentNumber =
    data?.chapter?.chapterNumber ||
    (currentChapter &&
      ("chapter_number" in currentChapter
        ? (currentChapter as any).chapter_number
        : (currentChapter as any).chapterNumber)) ||
    0;

  const hasPrev = finalChapterList.some((chap: any) => {
    const n =
      "chapter_number" in chap ? chap.chapter_number : chap.chapterNumber;
    return n === currentNumber - 1;
  });
  const hasNext = finalChapterList.some((chap: any) => {
    const n =
      "chapter_number" in chap ? chap.chapter_number : chap.chapterNumber;
    return n === currentNumber + 1;
  });

  const handleGoToChapterNumber = (offset: number) => {
    if (!finalChapterList || currentNumber === 0) return;
    const next = finalChapterList.find((chap: any) => {
      const cnum =
        "chapter_number" in chap ? chap.chapter_number : chap.chapterNumber;
      return cnum === currentNumber + offset;
    });
    if (!next) return;
    const isPaid = "is_paid" in next ? next.is_paid : next.isPaid;
    if (isPaid) {
      toast?.onOpen("Bạn không sở hữu chương này");
      return;
    }
    const nextChapterId = "id" in next ? next.id : next.chapterId;
    navigate(`/novels/${novelId}/${nextChapterId}`);
  };

  const cleanText = htmlToPlainText(data?.chapter?.content ?? "");
  const { start, pause, stop } = useSpeech({ text: cleanText, lang: "vi-VN" });

  const ghostBtn =
    "inline-flex items-center justify-center rounded-full px-3.5 py-2 text-[13px] transition disabled:opacity-40 disabled:cursor-not-allowed border bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800 dark:border-white/12 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-white";
  const gradBtn =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-white !bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177] transition";

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest?.("[data-reader-prefs]") &&
        !target.closest?.("[data-reader-prefs-trigger]")
      ) {
        setOpenPrefs(false);
      }
    };
    if (openPrefs) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [openPrefs]);

  // Scroll to top when new chapter loaded
  useEffect(() => {
    if (!chapterId || isChapterLoading) return;
    const el = pageTopRef.current;
    requestAnimationFrame(() => {
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, [chapterId, isChapterLoading]);

  return (
    <div className="min-h-screen antialiased bg-[#f7f7f9] text-gray-900 dark:bg-[#090a0c] dark:text-white">
      {/* neo scroll */}
      <div ref={pageTopRef} />

      <div className="relative mx-auto w-full px-4 py-6">
        <section
          className="
            relative overflow-hidden rounded-2xl backdrop-blur-md
            bg-white ring-1 ring-gray-200 shadow-[0_32px_100px_-28px_rgba(0,0,0,0.12)]
            dark:bg-[#0b0c0e]/90 dark:ring-white/12 dark:shadow-[0_32px_100px_-28px_rgba(0,0,0,0.85)]
          "
        >
          <header
            className="px-6 pt-6 pb-4 dark:bg-[#0d0e12]/95 dark:border-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[13px]">
                  <Link
                    to={`/novels/${novelId}`}
                    className="
                      truncate max-w-[50vw] rounded-full px-3 py-1 transition
                      border bg-gray-50 hover:bg-gray-200 border-gray-300 text-gray-800
                      dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white
                    "
                    title={novelInfo?.novelInfo?.title}
                  >
                    {novelInfo?.novelInfo?.title ?? "Tiểu thuyết"}
                  </Link>
                  <span className="text-gray-500 dark:text-white/50">/</span>
                  <span
                    className="
                      rounded-full px-3 py-1
                      border bg-gray-50 border-gray-300 text-gray-800
                      dark:border-white/10 dark:bg-white/5 dark:text-white
                    "
                  >
                    Chương {data?.chapter?.chapterNumber ?? "—"}
                  </span>
                </div>
                <h1 className="mt-2 text-[22px] md:text-[24px] font-extrabold tracking-tight">
                  {data?.chapter?.title ?? "Đang tải chương…"}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" data-reader-prefs>
                  <button
                    data-reader-prefs-trigger
                    onClick={() => setOpenPrefs((s) => !s)}
                    className="
                      h-9 w-9 grid place-items-center rounded-full text-[13px]
                      border hover:bg-gray-200 border-gray-300 text-gray-800
                      dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white
                    "
                    aria-haspopup="dialog"
                    aria-expanded={openPrefs}
                  >
                    Aa
                  </button>

                  <ReaderPrefs
                    open={openPrefs}
                    onClose={() => setOpenPrefs(false)}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    lineHeight={lineHeight}
                    setLineHeight={setLineHeight}
                    widthIdx={widthIdx}
                    setWidthIdx={setWidthIdx}
                    widthLevels={WIDTH_LEVELS}
                    defaults={DEFAULTS}
                  />
                </div>

                <SpeechControls
                  state={speechState}
                  onStart={() => {
                    setSpeechState("started");
                    start();
                  }}
                  onPause={() => {
                    setSpeechState("paused");
                    pause();
                  }}
                  onResume={() => {
                    setSpeechState("started");
                    window.speechSynthesis.resume();
                  }}
                  onStop={() => {
                    setSpeechState("stopped");
                    stop();
                  }}
                />
              </div>
            </div>

            <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/12" />
          </header>

          <div className="px-0 md:px-6 py-6 bg-white dark:bg-[#0f1013]/80">
            {isChapterLoading ? (
              <div
                className="w-full mx-auto space-y-3 px-6"
                style={{ maxWidth: `${WIDTH_LEVELS[widthIdx]}px` }}
              >
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4.5 rounded bg-gray-200 animate-pulse dark:bg-white/5"
                  />
                ))}
              </div>
            ) : (
              <article
                className="w-full mx-auto text-gray-900 dark:text-gray-100"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
              >
                <div
                  className="mx-auto px-6"
                  style={{ maxWidth: `${WIDTH_LEVELS[widthIdx]}px` }}
                >
                  <div
                    className="
                      rounded-xl px-6 py-6
                      bg-white ring-1 ring-gray-200
                      dark:bg-white/[0.02] dark:ring-0 dark:ring-white/[0.06]
                    "
                  >
                    <div
                      className="[&>p]:mb-3.5 [&>p]:leading-relaxed [&>h2]:mt-6 [&>h2]:mb-2.5 [&>h3]:mt-5 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&_img]:rounded-xl [&_img]:my-4"
                      dangerouslySetInnerHTML={{
                        __html: renderTextWithNewlines(
                          data?.chapter?.content || ""
                        ),
                      }}
                    />
                  </div>
                </div>
              </article>
            )}
          </div>

          <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200 dark:bg-[#0d0e12]/95 dark:border-none">
            <div
              className="mx-auto"
              style={{ maxWidth: `${WIDTH_LEVELS[widthIdx]}px` }}
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4 dark:via-white/12" />
              <div className="flex items-center justify-center gap-2.5">
                <button
                  onClick={() => handleGoToChapterNumber(-1)}
                  disabled={!hasPrev}
                  className={ghostBtn}
                >
                  Chương trước
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={gradBtn}
                >
                  Mục lục
                </button>
                <button
                  onClick={() => handleGoToChapterNumber(1)}
                  disabled={!hasNext}
                  className={ghostBtn}
                >
                  Chương sau
                </button>
              </div>
            </div>
          </div>
        </section>

        {novelId && chapterId && (
          <div className="mt-6">
            <CommentUser novelId={novelId} chapterId={chapterId} />
          </div>
        )}

        {adaptedChapterList.length > 0 && (
          <ChapterListModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            chapters={adaptedChapterList}
            novelId={novelId!}
            novelSlug={novelId!}
          />
        )}
      </div>
    </div>
  );
};
