// src/components/ChapterListModal.tsx
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
}

export const ChapterListModal = ({ open, onClose, chapters, novelId }: Props) => {
    const navigate = useNavigate();
    const toast = useToast();
    const { auth } = useAuth();

    if (!open) return null;

    const handleClickChapter = (chapterId: string, isPaid: boolean) => {
        if (isPaid) {
            !auth?.user
                ? toast?.onOpen("Bạn cần đăng nhập để đọc chương bị khóa")
                : toast?.onOpen("Bạn không sở hữu chương này!");
        } else {
            navigate(`/novels/${novelId}/${chapterId}`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(30,30,30,0.3)] backdrop-blur-[1px] flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] text-white p-6 rounded-xl w-[90%] max-w-[700px] max-h-[80vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">📚 Danh sách chương</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white text-xl font-bold">✖</button>
                </div>
                <div className="space-y-3">
                    {chapters.map((chapter) => (
                        <div
                            key={chapter.id}
                            onClick={() => handleClickChapter(chapter.id, chapter.is_paid)}
                            className="p-3 rounded hover:bg-gray-700 border border-gray-600 flex justify-between items-center cursor-pointer"
                        >
                            <div>
                                <p className="text-lg font-semibold">
                                    Chương {chapter.chapter_number}: {chapter.title}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {formatTicksToRelativeTime(chapter.created_at)}
                                </p>
                            </div>
                            {chapter.is_paid && <Lock />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
