import Lock from "@mui/icons-material/Lock";
import { formatTicksToRelativeTime } from "../../utils/date_format";
import { useNavigate } from "react-router-dom";
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
  novelId,
  novelSlug,
}: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { auth } = useAuth();

  if (!open) return null;

  const handleClickChapter = (chapterId: string, isPaid: boolean) => {
    if (!chapterId) {
      return;
    }

    if (isPaid) {
      !auth?.user
        ? toast?.onOpen("Bạn cần đăng nhập để đọc chương bị khóa")
        : toast?.onOpen("Bạn không sở hữu chương này!");
    } else {
      navigate(`/novels/${novelSlug}/${chapterId}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-[#1e1e1e] text-white p-6 rounded-xl w-[90%] max-w-[700px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📚 Danh sách chương</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl font-bold"
          >
            ✖
          </button>
        </div>
        <div className="space-y-3">
          {chapters
            ?.filter((chapter) => !chapter.is_draft)
            .map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => handleClickChapter(chapter.id, chapter.is_paid)}
                className={`p-3 rounded hover:bg-gray-700 border border-gray-600 flex justify-between items-center cursor-pointer ${
                  chapter.is_paid ? "opacity-60" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {chapter.chapter_number}. {chapter.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {chapter.created_at
                      ? formatTicksToRelativeTime(chapter.created_at)
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {chapter.is_paid && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Lock className="text-sm" />
                      <span className="text-xs">Khóa</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
