import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChapterByNovel } from "../../../api/Chapters/chapter.type";
import ActionButtons from "../AdminModal/ActionButtons";
import { formatTicksToDateString } from "../../../utils/date_format";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateChapterLock } from "../../../api/Chapters/chapter.api";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import { Search, X, Loader2, Lock, Unlock, Check, Coins } from "lucide-react";
import Pagination from "../AdminModal/Pagination";

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

type StatusFilter = "all" | "locked" | "unlocked";

const ChapterManagementPopup = ({
  isOpen,
  onClose,
  novelId,
  chapters,
  isLoading,
  error,
}: ChapterManagementPopupProps) => {
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [loadingChapterIds, setLoadingChapterIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>({ isOpen: false, type: null, title: "", chapterIds: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 10;

  const updateChapterLockMutation = useMutation({
    mutationFn: (request: { chapterIds: string[]; isLocked: boolean }) => UpdateChapterLock(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", novelId] });
      setLoadingChapterIds((prev) => prev.filter((id) => !variables.chapterIds.includes(id)));
      setSelectedChapterIds((prev) => prev.filter((id) => !variables.chapterIds.includes(id)));
    },
    onError: (_, variables) => {
      setLoadingChapterIds((prev) => prev.filter((id) => !variables.chapterIds.includes(id)));
    },
  });

  const filteredChapters = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return chapters.filter((chapter) => {
      if (!chapter.novel_id || !novelId) return false;
      if (chapter.novel_id.trim() !== novelId.trim()) return false;
      const matchText = term
        ? chapter.title.toLowerCase().includes(term) || chapter.chapter_number.toString().includes(term)
        : true;
      const matchStatus = status === "all" ? true : status === "locked" ? !!chapter.is_lock : !chapter.is_lock;
      return matchText && matchStatus;
    });
  }, [chapters, novelId, searchTerm, status]);

  const totalPages = Math.ceil(filteredChapters.length / chaptersPerPage) || 1;
  const paginatedChapters = useMemo(
    () => filteredChapters.slice((currentPage - 1) * chaptersPerPage, currentPage * chaptersPerPage),
    [filteredChapters, currentPage]
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setStatus("all");
      setSelectedChapterIds([]);
      setLoadingChapterIds([]);
      setDialog({ isOpen: false, type: null, title: "", chapterIds: [] });
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, status]);

  const toggleSelect = (id: string) => {
    setSelectedChapterIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const pageIds = useMemo(() => paginatedChapters.map((c) => c.id), [paginatedChapters]);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedChapterIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedChapterIds.includes(id));

  const toggleSelectPage = () => {
    setSelectedChapterIds((prev) => {
      if (allPageSelected) return prev.filter((id) => !pageIds.includes(id));
      const added = pageIds.filter((id) => !prev.includes(id));
      return [...prev, ...added];
    });
  };

  const openConfirm = (ids: string[], willLock: boolean) => {
    if (ids.length === 0) return;
    setDialog({
      isOpen: true,
      type: willLock ? "lock" : "unlock",
      title: `Bạn muốn ${willLock ? "khóa" : "mở khóa"} ${ids.length} chương?`,
      chapterIds: ids,
    });
  };

  const handleQuickToggle = (chapter: ChapterByNovel) => {
    openConfirm([chapter.id], !chapter.is_lock);
  };

  const handleBulkAction = () => {
    if (selectedChapterIds.length === 0) return;
    const anyUnlocked = selectedChapterIds.some((id) => !chapters.find((c) => c.id === id)?.is_lock);
    openConfirm(selectedChapterIds, anyUnlocked);
  };

  const handleConfirmDialog = () => {
    if (!dialog.type || dialog.chapterIds.length === 0) return;
    const ids = [...dialog.chapterIds];
    setLoadingChapterIds((prev) => [...prev, ...ids]);
    updateChapterLockMutation.mutate({ chapterIds: ids, isLocked: dialog.type === "lock" });
    setDialog({ isOpen: false, type: null, title: "", chapterIds: [] });
  };

  const canLock = selectedChapterIds.length > 0 && selectedChapterIds.some((id) => !chapters.find((c) => c.id === id)?.is_lock);
  const canUnlock = selectedChapterIds.length > 0 && selectedChapterIds.some((id) => chapters.find((c) => c.id === id)?.is_lock);

  const getChapterPrice = (chapter: ChapterByNovel): number | null => {
    const anyChapter = chapter as unknown as Record<string, any>;
    const price = anyChapter?.price ?? anyChapter?.coin_price ?? anyChapter?.chapter_price ?? null;
    return typeof price === "number" ? price : null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-[6vh] mx-auto w-[min(1040px,92vw)] rounded-2xl overflow-hidden shadow-2xl border-none bg-white/95 dark:bg-[#0f1116]/85 backdrop-blur-xl"
          >
            <div className="sticky top-0 z-10 px-5 py-4 border-b border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0f1116]/80 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">Quản lý chương</h2>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="gap-1 inline-flex rounded-xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-0.5">
                    {(
                      [
                        { v: "all", label: "Tất cả" },
                        { v: "unlocked", label: "Đang mở" },
                        { v: "locked", label: "Đang khóa" },
                      ] as { v: StatusFilter; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setStatus(opt.v)}
                        className={[
                          "px-3 py-1.5 text-xs font-medium rounded-lg transition",
                          status === opt.v
                            ? "bg-[#ff6740] text-white shadow"
                            : "text-zinc-700 hover:bg-zinc-100/70 dark:text-zinc-200 dark:hover:bg-white/10",
                        ].join(" ")}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-[min(360px,38vw)]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tiêu đề hoặc số chương…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 pl-9 pr-9 rounded-xl bg-white/80 dark:bg-[#141721]/80 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#ff6740]/30 focus:border-[#ff6740]/50"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-zinc-100/70 dark:hover:bg-white/10"
                        aria-label="Xóa tìm kiếm"
                      >
                        <X className="w-4 h-4 text-zinc-500" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 transition"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <span className="relative grid place-items-center h-5 w-5 rounded-md border-2 border-zinc-400/80 dark:border-zinc-500/70">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectPage}
                        className="peer absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Chọn tất cả trong trang"
                      />
                      <Check className={["h-3.5 w-3.5", allPageSelected || somePageSelected ? "opacity-100" : "opacity-0", "transition"].join(" ")} />
                    </span>
                    <span>Chọn tất cả trong trang ({pageIds.length})</span>
                  </label>

                  {selectedChapterIds.length > 0 && (
                    <button
                      onClick={() => setSelectedChapterIds([])}
                      className="rounded-md px-2 py-1 hover:bg-zinc-100/70 dark:hover:bg-white/10"
                    >
                      Bỏ chọn ({selectedChapterIds.length})
                    </button>
                  )}
                </div>

                <div>
                  <span>
                    Tổng kết quả: <span className="font-semibold">{filteredChapters.length}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              {isLoading ? (
                <div className="py-14">
                  <div className="mx-auto h-24 w-full max-w-[560px] rounded-2xl bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
                </div>
              ) : error ? (
                <p className="text-center py-10 text-rose-500">Không tải được danh sách chương</p>
              ) : filteredChapters.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-zinc-200/70 dark:bg-white/10 grid place-items-center">
                    <Search className="w-5 h-5 text-zinc-500" />
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Không tìm thấy chương phù hợp.</p>
                </div>
              ) : (
                <div
                  className={[
                    "max-h-[50vh] overflow-y-auto pr-2",
                    "scrollbar-thin",
                    darkMode ? "scrollbar-thumb-zinc-700/70 scrollbar-track-transparent" : "scrollbar-thumb-zinc-300 scrollbar-track-transparent",
                  ].join(" ")}
                >
                  <div className="grid gap-3">
                    {paginatedChapters.map((chapter) => {
                      const checked = selectedChapterIds.includes(chapter.id);
                      const isBusy = loadingChapterIds.includes(chapter.id);
                      const locked = !!chapter.is_lock;
                      const price = getChapterPrice(chapter);

                      return (
                        <motion.div
                          key={chapter.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={[
                            "group rounded-xl p-3 md:p-3.5 border transition-colors",
                            darkMode ? "bg-[#12151d]/70 border-white/10 hover:bg-[#161a23]" : "bg-white border-zinc-200 hover:bg-zinc-50/80",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <label className="relative mt-1 flex items-center cursor-pointer select-none">
                              <input type="checkbox" checked={checked} onChange={() => toggleSelect(chapter.id)} className="peer sr-only" />
                              <span
                                className={[
                                  "grid place-items-center h-5 w-5 rounded-md border-2 transition",
                                  checked ? "bg-[#ff6740] border-[#ff6740]" : darkMode ? "border-zinc-500/70" : "border-zinc-400/80",
                                ].join(" ")}
                              >
                                <Check className={["h-3.5 w-3.5 text-white", checked ? "opacity-100 scale-100" : "opacity-0 scale-75", "transition"].join(" ")} />
                              </span>
                            </label>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm md:text-[15px] font-medium truncate">
                                  Chương {chapter.chapter_number}: {chapter.title}
                                </span>

                                {isBusy && (
                                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang cập nhật…
                                  </span>
                                )}
                              </div>

                              <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                                <span>Ngày tạo: {formatTicksToDateString(chapter.created_at)}</span>

                                <span
                                  className={[
                                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold",
                                    locked
                                      ? "bg-zinc-200/70 text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                                  ].join(" ")}
                                  style={{ fontSize: 11 }}
                                >
                                  <span className={["inline-block h-1.5 w-1.5 rounded-full", locked ? "bg-zinc-500" : "bg-emerald-500"].join(" ")} />
                                  {locked ? "Đang khóa" : "Đang mở"}
                                </span>

                                {price !== null && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-zinc-300/70 dark:border-white/10 text-[10px] text-zinc-700 dark:text-zinc-300">
                                    <Coins className="h-3 w-3" />
                                    {price}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0">
                              <button
                                onClick={() => handleQuickToggle(chapter)}
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                                  locked
                                    ? "border border-emerald-500/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
                                    : "text-white bg-[#ff6740] hover:bg-[#e65d37]",
                                ].join(" ")}
                              >
                                {locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                {locked ? "Mở" : "Khóa"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredChapters.length > 0 && (
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="order-2 sm:order-1 basis-full sm:basis-0 grow flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>
                      Đã chọn:{" "}
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {selectedChapterIds.length}
                      </span>
                    </span>
                    <span className="text-[11px]">Chọn nhiều chương để khóa/mở khóa hàng loạt.</span>
                  </div>

                  <div className="order-1 sm:order-2 basis-full sm:basis-0 grow flex justify-center">
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </div>

                  <div className="order-3 sm:order-3 basis-full sm:basis-0 grow flex justify-start sm:justify-end">
                    <ActionButtons
                      canLock={canLock}
                      canUnlock={canUnlock}
                      selectedCount={selectedChapterIds.length}
                      onLockUnlock={handleBulkAction}
                      isLoading={updateChapterLockMutation.isPending}
                    />
                  </div>
                </div>
              )}
            </div>

            <ConfirmDialog
              isOpen={dialog.isOpen}
              onClose={() => setDialog({ isOpen: false, type: null, title: "", chapterIds: [] })}
              onConfirm={handleConfirmDialog}
              title={dialog.title}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChapterManagementPopup;
