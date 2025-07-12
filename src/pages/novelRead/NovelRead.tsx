import { useState } from "react";
import "../../pages/novelRead/NovelRead.css";
import { novelData } from "../../pages/novelRead/Content";
import { useQuery } from "@tanstack/react-query";
import { GetChapter } from "../../api/Chapters/chapter.api";
import { GetChapters } from "../../api/Chapters/chapter.api";
import { useNavigate, useParams } from "react-router-dom";
import type { ChapterByNovel } from "../../api/Chapters/chapter.type";
import { useToast } from "../../context/ToastContext/toast-context";
import { ChapterListModal } from "../../pages/novelRead/ChapterListModal";
// import { CommentUser } from "../../pages/commentUser/CommentUser";

export const NovelRead = () => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div>
          <h1 style={{ color: "#ff4500", marginTop: "-30px" }}>
            {data?.chapter.chapterNumber}
          </h1>
          <h2>{data?.chapter.title}</h2>
        </div>

        <div style={{ lineHeight: "4" }}>
          <hr
            style={{
              marginLeft: "-50px",
              marginRight: "-50px",
              marginTop: "20px",
              width: "calc(100% + 100px)",
              borderTop: "1px solid #4B5563",
            }}
          />
          {data?.chapter.content}
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
