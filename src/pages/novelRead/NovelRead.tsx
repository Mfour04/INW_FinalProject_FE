import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Type, Flag, Settings2 } from "lucide-react";

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
import { CommentUser } from "../CommentUser/CommentUser";
import { ChapterListModal } from "./ChapterListModal";
import { renderTextWithNewlines } from "./util";
import { SpeechControls } from "./components/SpeechControls";

import {
  REPORT_REASON_CODE,
  ReportChapterModal,
  type ReportPayload,
} from "../../components/ReportModal/ReportModal";
import { useReport } from "../../hooks/useReport";
import type { ReportRequest } from "../../api/Report/report.type";

const WIDTH_LEVELS = [880, 1080, 1320] as const;
const DEFAULTS = { fontSize: 18, lineHeight: 1.65, widthIdx: 1 as number };

const calcScale = (available: number, base: number) => {
  const minScale = 0.24;
  const minW = base * 0.4;
  if (available >= base) return 1;
  if (available <= minW) return minScale;
  const t = (available - minW) / (base - minW);
  return Math.max(minScale, Math.min(1, minScale + t * (1 - minScale)));
};
const TOOL_BASE_W = 56;

export const NovelRead = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speechState, setSpeechState] = useState<
    "started" | "paused" | "stopped"
  >("stopped");
  const [openPrefs, setOpenPrefs] = useState(false);
  const [openReport, setOpenReport] = useState(false);

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

  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const contentWrapRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const report = useReport();

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
    if (!chapterId || isChapterLoading) return;
    const el = pageTopRef.current;
    requestAnimationFrame(() => {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [chapterId, isChapterLoading]);

  const toolBtn =
    "h-9 w-9 grid place-items-center rounded-xl border border-black/5 bg-white hover:bg-white/90 text-gray-800 shadow-sm transition " +
    "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white";
  const toolGroup =
    "flex flex-col items-stretch gap-1 rounded-2xl p-2 bg-white/90 ring-1 ring-black/5 shadow-[0_10px_26px_rgba(0,0,0,.08)] backdrop-blur " +
    "dark:bg-[#0b0c0e]/80 dark:ring-white/10 dark:shadow-[0_10px_26px_rgba(0,0,0,.5)]";

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const s = sectionRef.current;
      const c = contentWrapRef.current;
      if (!s || !c) return;
      const sr = s.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      const gutter = Math.max(0, sr.right - cr.right - 12);
      const available = gutter + TOOL_BASE_W;
      setScale(calcScale(available, TOOL_BASE_W));
    };
    update();
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (contentWrapRef.current) ro.observe(contentWrapRef.current);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleStart = () => {
    setSpeechState("started");
    start();
  };
  const handlePause = () => {
    setSpeechState("paused");
    pause();
  };
  const handleResume = () => {
    setSpeechState("started");
    try {
      (window as any)?.speechSynthesis?.resume?.();
    } catch {
      start();
    }
  };
  const handleStop = () => {
    setSpeechState("stopped");
    stop();
  };

  const chapterTitle = data?.chapter?.title ?? "";
  const chapterNumber = data?.chapter?.chapterNumber ?? "—";
  const novelTitle = novelInfo?.novelInfo?.title ?? "Tiểu thuyết";

  const handleReportChapter = (payload: ReportPayload) => {
    const reportRequest: ReportRequest = {
      scope: 1,
      novelId: payload.novelId,
      chapterId: payload.chapterId,
      reason: REPORT_REASON_CODE[payload.reason],
      message: payload.message,
    };
    report.mutate(reportRequest);
  };

  return (
    <div className="min-h-screen antialiased bg-[#f7f7f9] text-gray-900 dark:bg-[#090a0c] dark:text-white">
      <div ref={pageTopRef} />

      <div className="relative mx-auto w-full px-4 py-6">
        {/* SECTION */}
        <section
          ref={sectionRef}
          className="relative rounded-2xl backdrop-blur-md bg-white ring-1 ring-gray-200 shadow-md dark:bg-[#0b0c0e]/90 dark:ring-white/12"
        >
          <header className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[13px]">
                  <Link
                    to={`/novels/${novelId}`}
                    className="truncate max-w-[50vw] rounded-full px-3 py-1 border bg-gray-50 hover:bg-gray-200 border-gray-300 text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    title={novelTitle}
                  >
                    {novelTitle}
                  </Link>
                  <span className="text-gray-500 dark:text-white/50">/</span>
                  <span className="rounded-full px-3 py-1 border bg-gray-50 border-gray-300 text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white">
                    Chương {chapterNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="my-2 w-full flex justify-center">
              <h1 className="text-[22px] md:text-[24px] font-extrabold tracking-tight text-center max-w-[min(90vw,1100px)]">
                {chapterTitle || "Đang tải chương…"}
              </h1>
            </div>
          </header>

          {/* TOP NAV */}
          <div className="px-6 pb-2">
            <div
              className="mx-auto"
              style={{ maxWidth: `${WIDTH_LEVELS[widthIdx]}px` }}
            >
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

          {/* TOOLBAR */}
          <div className="hidden md:block sticky top-20 z-40">
            <div className="relative">
              <div
                className="absolute right-3"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top right",
                }}
              >
                <div className={toolGroup}>
                  <div className="relative">
                    <button
                      onClick={() => setOpenPrefs((s) => !s)}
                      className={toolBtn}
                      title="Thiết lập hiển thị (Aa)"
                      aria-haspopup="dialog"
                      aria-expanded={openPrefs}
                    >
                      <Type size={18} />
                    </button>
                    {openPrefs && (
                      <div className="absolute right-full top-0 mr-2 z-50">
                        <div className="rounded-xl ring-1 ring-black/5 shadow-xl bg-white dark:bg-[#0b0c0e] dark:ring-white/10">
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
                      </div>
                    )}
                  </div>

                  <SpeechControls
                    state={speechState}
                    onStart={handleStart}
                    onPause={handlePause}
                    onResume={handleResume}
                    onStop={handleStop}
                  />

                  <button
                    onClick={() => setOpenReport(true)}
                    className={toolBtn}
                    title="Báo cáo chương này"
                  >
                    <Flag size={18} />
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-gray-500 dark:text-white/50 text-right pr-1 select-none">
                  Công cụ
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-0 md:px-6 py-6 bg-white dark:bg-[#0f1013]/80">
            <div
              ref={contentWrapRef}
              className="mx-auto px-6"
              style={{ maxWidth: `${WIDTH_LEVELS[widthIdx]}px` }}
            >
              {isChapterLoading ? (
                <div className="w-full mx-auto space-y-3">
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
                  <div className="rounded-xl px-6 py-6 bg-white ring-1 ring-black/10 dark:bg-white/[0.03] dark:ring-white/15">
                    <div
                      className="[&>p]:mb-3.5 [&>p]:leading-relaxed [&_img]:rounded-xl [&_img]:my-4"
                      dangerouslySetInnerHTML={{
                        __html: renderTextWithNewlines(
                          data?.chapter?.content || ""
                        ),
                      }}
                    />
                  </div>
                </article>
              )}
            </div>
          </div>

          <div className="md:hidden sticky bottom-0 inset-x-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur px-3 py-2 dark:bg-[#0b0c0e]/90 dark:border-white/10">
            <div className="mx-auto max-w-[680px] flex items-center justify-between gap-2">
              <button
                onClick={() => setOpenPrefs((s) => !s)}
                className="flex-1 h-10 rounded-xl border border-black/5 bg-white text-gray-800 grid place-items-center dark:border-white/10 dark:bg-white/5 dark:text-white"
                title="Thiết lập hiển thị"
              >
                <Settings2 size={18} />
              </button>

              <div className="flex-1 grid place-items-center">
                <SpeechControls
                  state={speechState}
                  onStart={handleStart}
                  onPause={handlePause}
                  onResume={handleResume}
                  onStop={handleStop}
                />
              </div>

              <button
                onClick={() => setOpenReport(true)}
                className="flex-1 h-10 rounded-xl border border-black/5 bg-white text-gray-800 grid place-items-center dark:border-white/10 dark:bg-white/5 dark:text-white"
                title="Báo cáo chương này"
              >
                <Flag size={18} />
              </button>
            </div>
          </div>

          <div className="px-6 pt-2 pb-8">
            <div
              className="mx-auto"
              style={{ maxWidth: `${WIDTH_LEVELS[widthIdx]}px` }}
            >
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

      <ReportChapterModal
        isOpen={openReport}
        onClose={() => setOpenReport(false)}
        novelId={novelInfo?.novelInfo?.novelId || novelId!}
        novelTitle={novelTitle}
        chapterId={chapterId!}
        chapterTitle={chapterTitle}
        onSubmit={(payload: ReportPayload) => handleReportChapter(payload)}
      />
    </div>
  );
};
