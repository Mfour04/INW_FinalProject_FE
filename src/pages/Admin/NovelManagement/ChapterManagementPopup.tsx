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
  chapterIds: string[];
}

interface ChapterManagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: string;
  chapters: ChapterByNovel[];
  isLoading: boolean;
  error: unknown;
}

const ChapterManagementPopup = ({
  isOpen,
  onClose,
  novelId,
  chapters,
  isLoading,
  error,
}: ChapterManagementPopupProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [loadingChapterIds, setLoadingChapterIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: null,
    title: "",
    chapterIds: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 10;

  // Mutation for chapter lock/unlock
  const updateChapterLockMutation = useMutation({
    mutationFn: (request: { chapterIds: string[]; isLocked: boolean }) =>
      UpdateChapterLock(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", novelId] });
      setLoadingChapterIds((prev) =>
        prev.filter((id) => !variables.chapterIds.includes(id))
      );
      setSelectedChapterIds([]);
    },
    onError: (error, variables) => {
      console.error("Failed to update chapter lock status:", error);
      setLoadingChapterIds((prev) =>
        prev.filter((id) => !variables.chapterIds.includes(id))
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
      setSelectedChapterIds([]);
      setLoadingChapterIds([]);
      setDialog({
        isOpen: false,
        type: null,
        title: "",
        chapterIds: [],
      });
      setCurrentPage(1); // Reset to first page when popup closes
    }
  }, [isOpen]);

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleLockUnlock = (chapter?: ChapterByNovel) => {
    const chapterIds = chapter ? [chapter.id] : selectedChapterIds;
    if (chapterIds.length === 0) return;

    const isLockAction = chapter
      ? !chapter.is_lock
      : chapters.find((c) => chapterIds.includes(c.id))?.is_lock === false;
    const action = isLockAction ? "lock" : "unlock";
    const title = `Bạn muốn ${action === "lock" ? "khóa" : "mở khóa"} ${
      chapterIds.length
    } chương${chapterIds.length > 1 ? "s" : ""}?`;

    setDialog({
      isOpen: true,
      type: action,
      title,
      chapterIds,
    });
  };

  const handleConfirmDialog = () => {
    if (dialog.chapterIds.length > 0) {
      const chapterIdsToProcess = [...dialog.chapterIds]; // Store chapter IDs before resetting dialog
      setLoadingChapterIds((prev) => [...prev, ...chapterIdsToProcess]);

      if (dialog.type === "lock") {
        updateChapterLockMutation.mutate({
          chapterIds: chapterIdsToProcess,
          isLocked: true,
        });
      } else if (dialog.type === "unlock") {
        updateChapterLockMutation.mutate({
          chapterIds: chapterIdsToProcess,
          isLocked: false,
        });
      }
    }

    setDialog({
      isOpen: false,
      type: null,
      title: "",
      chapterIds: [],
    });
  };

  // Determine if lock/unlock buttons should be enabled
  const canLock =
    selectedChapterIds.length > 0 &&
    selectedChapterIds.some(
      (id) => !chapters.find((c) => c.id === id)?.is_lock
    );
  const canUnlock =
    selectedChapterIds.length > 0 &&
    selectedChapterIds.some((id) => chapters.find((c) => c.id === id)?.is_lock);

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

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc số chương..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:flex-1 p-2.5 border border-gray-600 rounded-lg bg-[#2a2a2e] text-white focus:ring-2 focus:ring-[#ff4d4f] focus:border-[#ff4d4f] transition-all"
              />
              <div className="flex justify-end">
                <ActionButtons
                  canLock={canLock}
                  canUnlock={canUnlock}
                  selectedCount={selectedChapterIds.length}
                  onLockUnlock={() => handleLockUnlock()}
                  isLoading={updateChapterLockMutation.isPending}
                />
              </div>
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
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedChapterIds.includes(chapter.id)}
                          onChange={() => handleSelectChapter(chapter.id)}
                          className="absolute opacity-0 w-0 h-0"
                        />
                        <motion.div
                          className={`w-4 h-4 rounded flex items-center justify-center border-2 ${
                            selectedChapterIds.includes(chapter.id)
                              ? "bg-[#ff4d4f] border-[#ff4d4f]"
                              : "bg-[#2a2a2e] border-gray-400"
                          }`}
                          animate={{
                            scale: selectedChapterIds.includes(chapter.id)
                              ? 1.1
                              : 1,
                            transition: { duration: 0.2 },
                          }}
                          whileHover={{ scale: 1.15 }}
                        >
                          {selectedChapterIds.includes(chapter.id) && (
                            <motion.svg
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                          )}
                        </motion.div>
                      </label>
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
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"
                              />
                            )}
                          </div>
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
                chapterIds: [],
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
