import { useEffect, useState } from "react";
import "../../pages/novelRead/NovelRead.css";
import { novelData } from "../../pages/novelRead/Content";
import { useQuery } from "@tanstack/react-query";
import { GetChapter } from "../../api/Chapters/chapter.api";
import { GetChapters } from "../../api/Chapters/chapter.api";
import { GetNovelByUrl } from "../../api/Novels/novel.api";
import { useNavigate, useParams } from "react-router-dom";
import type { ChapterByNovel } from "../../api/Chapters/chapter.type";
import { useToast } from "../../context/ToastContext/toast-context";
import { ChapterListModal } from "../../pages/novelRead/ChapterListModal";
import { CommentUser } from "../../pages/commentUser/CommentUser";
import { useSpeech } from "react-text-to-speech";
import Play from "../../assets/svg/NovelRead/play-stroke-rounded.svg";
import Pause from "../../assets/svg/NovelRead/pause-stroke-rounded.svg";
import Stop from "../../assets/svg/NovelRead/stop-stroke-rounded.svg";
import { htmlToPlainText } from "../../utils/text-speech";

type SpeechState = "started" | "paused" | "stopped";

export const NovelRead = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speechState, setSpeechState] = useState<SpeechState>("stopped");
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: novelInfo, error: novelError } = useQuery({
    queryKey: ["novel-by-slug", novelId],
    queryFn: async () => {
      try {
        const res = await GetNovelByUrl(novelId!);
        return res.data.data;
      } catch (error) {
        console.error("GetNovelByUrl error:", error);
        return null;
      }
    },
    enabled: !!novelId,
  });

  const { data } = useQuery({
    queryKey: ["chapters", chapterId],
    queryFn: async () => {
      const res = await GetChapter(chapterId!);
      return res.data.data;
    },
    enabled: !!chapterId,
  });

  const { data: chapterList } = useQuery({
    queryKey: ["chapter-list", novelInfo?.novelInfo?.novelId || novelId],
    queryFn: async () => {
      const actualNovelId = novelInfo?.novelInfo?.novelId || novelId;
      try {
        const res = await GetChapters(actualNovelId!);
        return res.data.data as ChapterByNovel[];
      } catch (error) {
        console.error("GetChapters error:", error);
        return [];
      }
    },
    enabled: !!(novelInfo?.novelInfo?.novelId || novelId),
  });

  const finalChapterList = novelInfo?.allChapters || chapterList;

  const adaptedChapterList = finalChapterList?.map((chap) => {
    if ('id' in chap) {
      return chap;
    } else {
      return {
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
      };
    }
  });

  const currentChapter = finalChapterList?.find((chap) =>
    'id' in chap ? chap.id === chapterId : chap.chapterId === chapterId
  );

  const currentNumber = data?.chapter?.chapterNumber ||
    (currentChapter && ('chapter_number' in currentChapter ? currentChapter.chapter_number :
      (('chapterNumber' in currentChapter) ? (currentChapter as any).chapterNumber : 0))) || 0;

  const handleGoToChapterNumber = (offset: number) => {

    if (!finalChapterList || currentNumber === 0) {
      return;
    }

    const nextChapter = finalChapterList.find((chap) => {
      const chapterNum = 'chapter_number' in chap ? chap.chapter_number : chap.chapterNumber;
      return chapterNum === currentNumber + offset;
    });

    if (nextChapter) {
      const isPaid = 'is_paid' in nextChapter ? nextChapter.is_paid : nextChapter.isPaid;
      if (isPaid) {
        toast?.onOpen("Bạn không sở hữu chương này");
        return;
      }

      const nextChapterId = 'id' in nextChapter ? nextChapter.id : nextChapter.chapterId;
      const nextNovelId = 'novel_id' in nextChapter ? nextChapter.novel_id : nextChapter.novelId;
      navigate(`/novels/${nextNovelId}/${nextChapterId}`);
    } else {
    }
  };

  const cleanText = htmlToPlainText(data?.chapter.content ?? "");

  const { speechStatus, start, pause, stop } = useSpeech({
    text: cleanText,
    lang: "vi-VN",
  });

  const resume = () => {
    window.speechSynthesis.resume();
  };

  const handleStartSpeech = () => {
    setSpeechState("started");
    start();
  };

  const handlePauseSpeech = () => {
    setSpeechState("paused");
    pause();
  };

  const handleResumeSpeech = () => {
    setSpeechState("started");
    resume();
  };

  const handleStopSpeech = () => {
    setSpeechState("stopped");
    stop();
  };

  return (
    <div
      style={{
        border: "1px",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "-10px",
      }}
    >
      {adaptedChapterList && (
        <ChapterListModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          chapters={adaptedChapterList}
          novelId={novelId!}
          novelSlug={novelId!}
        />
      )}

      <div
        style={{
          backgroundColor: "#1e1e1e",
          color: "#ffffff",
          padding: "50px",
          fontFamily: "Arial, sans-serif",
          borderRadius: "10px",
        }}
      >
        <div className="flex justify-between content-center">
          <div>
            <h1 className="text-[#ff4500] text-2xl">
              Chương: {data?.chapter.chapterNumber}
            </h1>
            <h2>{data?.chapter.title}</h2>
          </div>
          <div className="gap-2.5 flex flex-col">
            <p className="text-sm">
              <strong>Đọc tiểu thuyết bằng giọng nói</strong>
            </p>
            <div className="flex gap-2.5">
              {speechState === "stopped" ? (
                <button onClick={handleStartSpeech}>
                  <img src={Play} />
                </button>
              ) : speechState === "started" ? (
                <div className="flex gap-2.5">
                  <button onClick={handlePauseSpeech}>
                    <img src={Pause} />
                  </button>
                  <button onClick={handleStopSpeech}>
                    <img src={Stop} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <button onClick={handleResumeSpeech}>
                    <img src={Play} />
                  </button>
                  <button onClick={handleStopSpeech}>
                    <img src={Stop} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <hr
            style={{
              marginLeft: "-50px",
              marginRight: "-50px",
              marginTop: "20px",
              width: "calc(100% + 100px)",
              borderTop: "1px solid #4B5563",
            }}
          />
          <div
            className="space-y-6 mt-4"
            dangerouslySetInnerHTML={{ __html: data?.chapter.content || "" }}
          />
        </div>

        <hr
          style={{
            marginLeft: "-50px",
            marginRight: "-50px",
            marginTop: "10px",
            width: "calc(100% + 100px)",
            borderTop: "1px solid #4B5563",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginTop: "30px",
            marginBottom: "-20px",
          }}
        >
          <button
            className="buttonStyle"
            onClick={() => handleGoToChapterNumber(-1)}
            disabled={!finalChapterList || finalChapterList.length === 0 || currentNumber <= 1}
          >
            &lt; Chương trước
          </button>

          <button
            className="buttonStyle"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Mục lục
          </button>

          <button
            className="buttonStyle"
            onClick={() => handleGoToChapterNumber(1)}
            disabled={!finalChapterList || finalChapterList.length === 0 || currentNumber >= finalChapterList.length}
          >
            Chương sau &gt;
          </button>
        </div>
      </div>

      {novelId && chapterId && (
        <CommentUser novelId={novelId} chapterId={chapterId} />
      )}
    </div>
  );
};
