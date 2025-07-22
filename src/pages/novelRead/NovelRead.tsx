import { useEffect, useState } from "react";
import "../../pages/novelRead/NovelRead.css";
import { novelData } from "../../pages/novelRead/Content";
import { useQuery } from "@tanstack/react-query";
import { GetChapter } from "../../api/Chapters/chapter.api";
import { GetChapters } from "../../api/Chapters/chapter.api";
import { useNavigate, useParams } from "react-router-dom";
import type { ChapterByNovel } from "../../api/Chapters/chapter.type";
import { useToast } from "../../context/ToastContext/toast-context";
import { ChapterListModal } from "../../pages/novelRead/ChapterListModal";
import { useSpeech } from "react-text-to-speech";
import Play from "../../assets/svg/NovelRead/play-stroke-rounded.svg";
import Pause from "../../assets/svg/NovelRead/pause-stroke-rounded.svg";
import Stop from "../../assets/svg/NovelRead/stop-stroke-rounded.svg";
import { htmlToPlainText } from "../../utils/text-speech";
// import { CommentUser } from "../../pages/commentUser/CommentUser";

type SpeechState = "started" | "paused" | "stopped";

export const NovelRead = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speechState, setSpeechState] = useState<SpeechState>("stopped");

  const { novelId, chapterId } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useQuery({
    queryKey: ["chapters", chapterId],
    queryFn: async () => {
      const res = await GetChapter(chapterId!);
      return res.data.data;
    },
    enabled: !!chapterId,
  });

  const { data: chapterList } = useQuery({
    queryKey: ["chapter-list", novelId],
    queryFn: async () => {
      const res = await GetChapters(novelId!);
      return res.data.data as ChapterByNovel[];
    },
    enabled: !!novelId,
  });

  const currentChapter = chapterList?.find((chap) => chap.id === chapterId);

  const currentNumber = currentChapter?.chapter_number ?? 0;

  const handleGoToChapterNumber = (offset: number) => {
    if (!chapterList || currentNumber === 0) return;

    const nextChapter = chapterList.find(
      (chap) => chap.chapter_number === currentNumber + offset
    );

    if (nextChapter?.is_paid) {
      toast?.onOpen("Bạn không sở hữu chương này");
      return;
    }

    if (nextChapter) {
      navigate(`/novels/${nextChapter.novel_id}/${nextChapter.id}`);
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

  useEffect(() => {
    console.log(speechStatus);
  }, [speechStatus]);

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
          novelId={novelId!}
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
            disabled={currentNumber <= 1}
          >
            &lt; Chương trước
          </button>

          <button className="buttonStyle" onClick={() => setIsModalOpen(true)}>
            Mục lục
          </button>

          <button
            className="buttonStyle"
            onClick={() => handleGoToChapterNumber(1)}
            disabled={currentNumber >= (chapterList?.length ?? 1)}
          >
            Chương sau &gt;
          </button>
        </div>
      </div>

      {/* <CommentUser /> */}
    </div>
  );
};
