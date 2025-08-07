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
        // Call optional callback if provided
        onLockChapter?.(dialog.chapterId);
        console.log(`Khóa chương: ${dialog.chapterId}`);
      } else if (dialog.type === "unlock") {
        updateChapterLockMutation.mutate({
          chapterId: dialog.chapterId,
          isLocked: false,
        });
        // Call optional callback if provided
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
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1e1e21] rounded-[10px] shadow-lg p-6 w-full max-w-4xl mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Quản lý chương</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200"
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

            <div className="mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc số chương..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 border border-gray-700 rounded-[10px] bg-[#2e2e2e] text-white focus:ring-[#ff4d4f] focus:border-[#ff4d4f]"
              />
            </div>

            {isLoading ? (
              <p className="text-gray-400 text-center">Đang tải chương...</p>
            ) : error ? (
              <p className="text-red-600 text-center">
                Không tải được danh sách chương
              </p>
            ) : filteredChapters.length === 0 ? (
              <p className="text-gray-400 text-center">Không có chương nào</p>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredChapters.map((chapter) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[120px] bg-[#2e2e2e] rounded-[10px] p-4 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 rounded-full inline-block ${
                              chapter.is_lock ? "bg-gray-400" : "bg-green-400"
                            }`}
                          />
                          <span className="text-[18px] text-white">
                            Chương {chapter.chapter_number}: {chapter.title}
                          </span>
                          {loadingChapterIds.includes(chapter.id) && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          )}
                        </div>
                        <ActionButtons
                          canLock={!chapter.is_lock}
                          canUnlock={chapter.is_lock}
                          selectedCount={1}
                          onLockUnlock={() => handleLockUnlock(chapter)}
                        />
                      </div>
                      <div className="flex gap-10 text-sm text-gray-400">
                        <div className="flex gap-4">
                          <span>Ngày tạo:</span>
                          <span>
                            {formatTicksToDateString(chapter.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
