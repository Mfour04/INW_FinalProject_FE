import { useEffect, useState } from "react";
import "../../pages/novelRead/NovelRead.css";
import { novelData } from "../../pages/novelRead/Content";
import { useQuery } from "@tanstack/react-query";
import { GetChapter } from "../../api/Chapters/chapter.api";
import { GetChapters } from "../../api/Chapters/chapter.api";
import { GetNovelByUrl } from "../../api/Novels/novel.api";
import { useNavigate, useParams } from "react-router-dom";
import type { BackendChapterResponse } from "../../api/Chapters/chapter.type";
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

  const { data: novelData } = useQuery({
    queryKey: ["novel-by-slug", novelId],
    queryFn: async () => {
      const res = await GetNovelByUrl(novelId!);
      return res.data.data;
    },
    enabled: !!novelId,
  });

  const actualNovelId = novelData?.novelInfo?.novelId;

  const { data } = useQuery({
    queryKey: ["chapters", chapterId],
    queryFn: async () => {
      const res = await GetChapter(chapterId!);
      return res.data.data;
    },
    enabled: !!chapterId,
  });

  const { data: chapterList, isLoading: chapterListLoading, error: chapterListError } = useQuery({
    queryKey: ["chapter-list", actualNovelId],
    queryFn: async () => {
      const res = await GetChapters(actualNovelId!);

      if (res.data.success === false) {
        throw new Error(res.data.message || "Failed to fetch chapters");
      }

      return res.data.data as BackendChapterResponse[];
    },
    enabled: !!actualNovelId,
    retry: 1,
    retryDelay: 1000,
  });

  const currentChapter = chapterList?.find((chap) => chap.chapterId === chapterId);
  const currentNumber = currentChapter?.chapterNumber ?? 0;
  const currentNumberFromData = data?.chapter?.chapterNumber;
  const actualCurrentNumber = currentNumber || currentNumberFromData || 0;

  const handleGoToChapterNumber = (offset: number) => {
    if (!chapterList || chapterList.length === 0) {
      return;
    }

    const currentChapter = chapterList.find(chap => chap.chapterId === chapterId);
    let currentChapterNumber = 0;

    if (currentChapter) {
      currentChapterNumber = currentChapter.chapterNumber;
    } else {
      const currentNumberFromData = data?.chapter?.chapterNumber;
      if (currentNumberFromData) {
        const chapterByNumber = chapterList.find(chap => chap.chapterNumber === currentNumberFromData);
        if (chapterByNumber) {
          currentChapterNumber = chapterByNumber.chapterNumber;
        } else {
          return;
        }
      } else {
        return;
      }
    }

    const targetNumber = currentChapterNumber + offset;
    const nextChapter = chapterList.find(chap => chap.chapterNumber === targetNumber);

    if (!nextChapter) {
      return;
    }

    if (nextChapter.isPaid) {
      return;
    }

    navigate(`/novels/${novelId}/${nextChapter.chapterId}`);
  };

  const nextChapter = chapterList?.find(chap => chap.chapterNumber === actualCurrentNumber + 1);
  const isNextChapterLocked = nextChapter?.isPaid || false;

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
      {chapterList && (
        <ChapterListModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          chapters={chapterList}
          novelId={actualNovelId!}
          novelSlug={novelId!}
        />
      )}

      {chapterListLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-4 rounded-lg">
            <p>Đang tải danh sách chương...</p>
          </div>
        </div>
      )}

      {chapterListError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-red-600 font-bold mb-2">Lỗi tải danh sách chương</h3>
            <p className="text-gray-700 mb-4">
              {chapterListError.message === "Novel not found."
                ? "Không tìm thấy tiểu thuyết này. Vui lòng kiểm tra lại đường dẫn."
                : chapterListError.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </div>
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
            disabled={actualCurrentNumber <= 1 || chapterListLoading}
          >
            &lt; Chương trước
          </button>

          <button
            className="buttonStyle"
            onClick={() => setIsModalOpen(true)}
            disabled={chapterListLoading}
          >
            Mục lục
          </button>

          <button
            className="buttonStyle"
            onClick={() => handleGoToChapterNumber(1)}
            disabled={actualCurrentNumber >= (chapterList?.length ?? 1) || chapterListLoading || isNextChapterLocked}
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
