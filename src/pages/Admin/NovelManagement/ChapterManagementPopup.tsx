import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChapterByNovel } from "../../../api/Chapters/chapter.type";
import ActionButtons from "../AdminModal/ActionButtons";
import { formatTicksToDateString } from "../../../utils/date_format";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateChapterLock } from "../../../api/Chapters/chapter.api";

interface DialogState {
  isOpen: boolean;
  type: "lock" | "unlock" | null;
  title: string;
  chapterId: string | null;
}

interface ChapterManagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: string;
  chapters: ChapterByNovel[];
  isLoading: boolean;
  error: unknown;
  onLockChapter?: (chapterId: string) => void;
  onUnlockChapter?: (chapterId: string) => void;
}

const ChapterManagementPopup = ({
  isOpen,
  onClose,
  novelId,
  chapters,
  isLoading,
  error,
  onLockChapter,
  onUnlockChapter,
}: ChapterManagementPopupProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingChapterIds, setLoadingChapterIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: null,
    title: "",
    chapterId: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 10;

  // Mutation for chapter lock/unlock
  const updateChapterLockMutation = useMutation({
    mutationFn: ({
      chapterId,
      isLocked,
    }: {
      chapterId: string;
      isLocked: boolean;
    }) => UpdateChapterLock(chapterId, isLocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", novelId] });
      setLoadingChapterIds((prev) =>
        prev.filter((id) => id !== dialog.chapterId)
      );
    },
    onError: (error) => {
      console.error("Failed to update chapter lock status:", error);
      setLoadingChapterIds((prev) =>
        prev.filter((id) => id !== dialog.chapterId)
      );
    },
  });

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.novel_id &&
      novelId &&
      chapter.novel_id.trim() === novelId.trim() &&
      (chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.chapter_number.toString().includes(searchTerm))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredChapters.length / chaptersPerPage);
  const paginatedChapters = filteredChapters.slice(
    (currentPage - 1) * chaptersPerPage,
    currentPage * chaptersPerPage
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setLoadingChapterIds([]);
      setDialog({
        isOpen: false,
        type: null,
        title: "",
        chapterId: null,
      });
      setCurrentPage(1); // Reset to first page when popup closes
    }
  }, [isOpen]);

  const handleLockUnlock = (chapter: ChapterByNovel) => {
    const action = chapter.is_lock ? "unlock" : "lock";
    const title = `Bạn muốn ${action === "lock" ? "khóa" : "mở khóa"} chương: ${
      chapter.title
    } ?`;

    setDialog({
      isOpen: true,
      type: action,
      title,
      chapterId: chapter.id,
    });
  };

  const handleConfirmDialog = () => {
    if (dialog.chapterId) {
      setLoadingChapterIds((prev) => [...prev, dialog.chapterId!]);

      if (dialog.type === "lock") {
        updateChapterLockMutation.mutate({
          chapterId: dialog.chapterId,
          isLocked: true,
        });
        onLockChapter?.(dialog.chapterId);
        console.log(`Khóa chương: ${dialog.chapterId}`);
      } else if (dialog.type === "unlock") {
        updateChapterLockMutation.mutate({
          chapterId: dialog.chapterId,
          isLocked: false,
        });
        onUnlockChapter?.(dialog.chapterId);
        console.log(`Mở khóa chương: ${dialog.chapterId}`);
      }
    }

    setDialog({
      isOpen: false,
      type: null,
      title: "",
      chapterId: null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1e1e21] rounded-xl shadow-2xl p-6 w-full max-w-5xl mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">
                Quản lý chương
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc số chương..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 border border-gray-600 rounded-lg bg-[#2a2a2e] text-white focus:ring-2 focus:ring-[#ff4d4f] focus:border-[#ff4d4f] transition-all"
              />
            </div>

            {isLoading ? (
              <p className="text-gray-400 text-center py-8">
                Đang tải chương...
              </p>
            ) : error ? (
              <p className="text-red-500 text-center py-8">
                Không tải được danh sách chương
              </p>
            ) : filteredChapters.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Không có chương nào
              </p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
                <div className="flex flex-col gap-3">
                  {paginatedChapters.map((chapter) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#2a2a2e] rounded-lg p-3 flex items-center gap-3 hover:bg-[#333337] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                chapter.is_lock ? "bg-gray-400" : "bg-green-400"
                              }`}
                            />
                            <span className="text-base text-white font-medium">
                              Chương {chapter.chapter_number}: {chapter.title}
                            </span>
                            {loadingChapterIds.includes(chapter.id) && (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            )}
                          </div>
                          <ActionButtons
                            canLock={!chapter.is_lock}
                            canUnlock={chapter.is_lock}
                            selectedCount={1}
                            onLockUnlock={() => handleLockUnlock(chapter)}
                          />
                        </div>
                        <div className="text-sm text-gray-400">
                          <span>
                            Ngày tạo:{" "}
                            {formatTicksToDateString(chapter.created_at)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-[#2a2a2e] text-white rounded-lg hover:bg-[#333337] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                <span className="text-white">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-[#2a2a2e] text-white rounded-lg hover:bg-[#333337] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </motion.div>

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={dialog.isOpen}
            onClose={() =>
              setDialog({
                isOpen: false,
                type: null,
                title: "",
                chapterId: null,
              })
            }
            onConfirm={handleConfirmDialog}
            title={dialog.title}
            isLockAction={dialog.type === "lock"}
            type="novel"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChapterManagementPopup;
