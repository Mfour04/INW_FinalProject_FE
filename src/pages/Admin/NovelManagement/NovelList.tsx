import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import SearchBar from "../AdminModal/SearchBar";
import DataTable from "../AdminModal/DataTable";
import Pagination from "../AdminModal/Pagination";
import NovelTopSection from "./NovelTopSection";
import ChapterManagementPopup from "./ChapterManagementPopup";
import { GetNovels, UpdateNovelLock } from "../../../api/Novels/novel.api";
import { GetChaptersAdmin } from "../../../api/Chapters/chapter.api";
import { formatTicksToDateString } from "../../../utils/date_format";
import { memo } from "react";
import type {
  ChapterAdmin,
  ChapterByNovel,
} from "../../../api/Chapters/chapter.type";
import type { NovelAdmin } from "../../../api/Novels/novel.type";

type SortKey = "created_at" | "total_views" | "rating_avg" | "followers";
type SortDirection = "asc" | "desc";
interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface DialogState {
  isOpen: boolean;
  type: "lock" | "unlock" | "delete" | null;
  title: string;
  novelId: string | null;
}

const novelsPerPage = 10;

const MemoizedNovelTopSection = memo(NovelTopSection);
const MemoizedPagination = memo(Pagination);

const NovelList = () => {
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: null,
    title: "",
    novelId: null,
  });
  const [isChapterPopupOpen, setIsChapterPopupOpen] = useState(false);
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  const threeDaysAgo = Date.now() - 3 * 24 * 3600 * 1000;

  const sortBy = `${sortConfig.key}:${sortConfig.direction}`;

  const {
    data: novelData,
    isLoading: isLoadingNovels,
    error: novelError,
  } = useQuery({
    queryKey: ["novels", { searchTerm, currentPage, sortBy }],
    queryFn: () =>
      GetNovels({
        searchTerm: searchTerm.trim() || undefined,
        page: currentPage - 1,
        limit: novelsPerPage,
        sortBy,
      }).then((res) => res.data),
  });

  const {
    data: allNovelsData,
    isLoading: isLoadingAllNovels,
    error: allNovelsError,
  } = useQuery({
    queryKey: ["allNovels"],
    queryFn: () =>
      GetNovels({
        searchTerm: undefined,
        page: undefined,
        limit: undefined,
        sortBy: undefined,
      }).then((res) => res.data),
  });

  const mappedNovels: NovelAdmin[] =
    novelData?.data?.novels?.map((novel) => ({
      NovelId: novel.novelId,
      Title: novel.title,
      AuthorName: novel.authorName,
      NovelImage: novel.novelImage,
      Status:
        novel.status === 1
          ? "Hoàn thành"
          : novel.status === 2
          ? "Gián đoạn"
          : "Đang diễn ra",
      IsPublic: novel.isPublic,
      IsLock: novel.isLock,
      TotalViews: novel.totalViews,
      Followers: novel.followers,
      RatingAvg: novel.ratingAvg,
      CreateAt: formatTicksToDateString(novel.createAt),
      UpdateAt: formatTicksToDateString(novel.updateAt),
      description: novel.description,
      authorId: novel.authorId,
      tags: novel.tags,
      isPaid: novel.isPaid,
      price: novel.price,
      totalChapters: novel.totalChapters,
      ratingCount: novel.ratingCount,
      Slug: novel.slug,
    })) || [];

  const mappedAllNovels: NovelAdmin[] = useMemo(
    () =>
      allNovelsData?.data?.novels?.map((novel) => ({
        NovelId: novel.novelId,
        Title: novel.title,
        AuthorName: novel.authorName,
        NovelImage: novel.novelImage,
        Status:
          novel.status === 1
            ? "Hoàn thành"
            : novel.status === 2
            ? "Gián đoạn"
            : "Đang diễn ra",
        IsPublic: novel.isPublic,
        IsLock: novel.isLock,
        TotalViews: novel.totalViews,
        Followers: novel.followers,
        RatingAvg: novel.ratingAvg,
        CreateAt: formatTicksToDateString(novel.createAt),
        UpdateAt: formatTicksToDateString(novel.updateAt),
        description: novel.description,
        authorId: novel.authorId,
        tags: novel.tags,
        isPaid: novel.isPaid,
        price: novel.price,
        totalChapters: novel.totalChapters,
        ratingCount: novel.ratingCount,
        Slug: novel.slug,
      })) || [],
    [allNovelsData]
  );

  const {
    data: chapterData,
    isLoading: isLoadingChapters,
    error: chapterError,
  } = useQuery({
    queryKey: ["chapters", selectedNovelId],
    queryFn: async () => {
      const res = await GetChaptersAdmin(selectedNovelId!);
      return res.data.data;
    },
    enabled: !!selectedNovelId && isChapterPopupOpen,
  });

  const updateNovelLockMutation = useMutation({
    mutationFn: ({
      novelId,
      isLocked,
    }: {
      novelId: string;
      isLocked: boolean;
    }) => UpdateNovelLock(novelId, isLocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["novels"] });
      queryClient.invalidateQueries({ queryKey: ["allNovels"] });
      setDialog({ isOpen: false, type: null, title: "", novelId: null });
    },
    onError: () => {
      setDialog({ isOpen: false, type: null, title: "", novelId: null });
    },
  });

  const mappedChapters: ChapterByNovel[] =
    chapterData?.map((chapter: ChapterAdmin) => ({
      id: chapter.chapterId,
      novel_id: chapter.novelId,
      title: chapter.title,
      content: chapter.content,
      chapter_number: chapter.chapterNumber,
      is_paid: chapter.isPaid,
      price: chapter.price,
      scheduled_at: chapter.scheduledAt,
      is_lock: chapter.isLock,
      is_draft: chapter.isDraft,
      is_public: chapter.isPublic,
      created_at: chapter.createAt,
      updated_at: chapter.updateAt,
    })) || [];

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key: key as SortKey,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (novelData?.data?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleLockUnlock = (novelId: string, isLocked: boolean) => {
    const novel = mappedNovels.find((n) => n.NovelId === novelId);
    const action = isLocked ? "unlock" : "lock";
    const title = `Bạn muốn ${action === "lock" ? "khóa" : "mở khóa"} truyện: ${
      novel?.Title
    } ?`;
    setDialog({ isOpen: true, type: action, title, novelId });
  };

  const handleConfirmDialog = (_?: { duration?: string; note?: string }) => {
    if (dialog.novelId && dialog.type) {
      const isLocked = dialog.type === "lock";
      updateNovelLockMutation.mutate({ novelId: dialog.novelId, isLocked });
    }
  };

  const handleOpenChapterPopup = (novelId: string) => {
    setSelectedNovelId(novelId);
    setIsChapterPopupOpen(true);
  };

  const SkeletonTable = () => (
    <div className="space-y-3">
      {[...Array(novelsPerPage)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[22%_16%_10%_8%_8%_10%_10%_10%_16%] h-12 animate-pulse"
        >
          <div className="px-3 py-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
          </div>
          <div className="px-3 py-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto"></div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto"></div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="px-3 py-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
          </div>
          <div className="px-3 py-2 text-center">
            <div className="inline-flex gap-2">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
              <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`p-6 min-h-screen ${
        darkMode ? "bg-[#0f0f11] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý truyện</h1>
      </div>
      {isLoadingAllNovels ? (
        <p
          className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Đang tải...
        </p>
      ) : allNovelsError ? (
        <p
          className={`text-center ${
            darkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          Không thể tải danh sách truyện
        </p>
      ) : (
        <>
          <MemoizedNovelTopSection
            novels={mappedAllNovels}
            threeDaysAgo={threeDaysAgo}
          />
          <div className="flex justify-end items-center mb-4 flex-wrap gap-2">
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
          {isLoadingNovels ? (
            <div className="p-6">
              <SkeletonTable />
            </div>
          ) : novelError ? (
            <p
              className={`text-center ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              Không thể tải danh sách truyện
            </p>
          ) : mappedNovels.length === 0 ? (
            <div className="p-8">
              <div
                className={[
                  "rounded-xl border p-4",
                  darkMode
                    ? "border-white/10 bg-white/5 text-zinc-300"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700",
                ].join(" ")}
              >
                <div className="text-sm font-semibold">Không có kết quả</div>
                <div className="text-sm mt-0.5">Thử từ khóa khác.</div>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={mappedNovels}
                sortConfig={sortConfig}
                onSort={handleSort}
                type="novel"
                onOpenChapterPopup={handleOpenChapterPopup}
                onLockUnlockNovel={handleLockUnlock}
              />
              <div className="mt-4">
                <MemoizedPagination
                  currentPage={currentPage}
                  totalPages={novelData?.data?.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </>
      )}
      {chapterData && (
        <ChapterManagementPopup
          isOpen={isChapterPopupOpen}
          onClose={() => setIsChapterPopupOpen(false)}
          novelId={selectedNovelId || ""}
          chapters={mappedChapters}
          isLoading={isLoadingChapters}
          error={chapterError}
        />
      )}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={() =>
          setDialog({ isOpen: false, type: null, title: "", novelId: null })
        }
        onConfirm={handleConfirmDialog}
        title={dialog.title}
        variant={dialog.type === "lock" ? "danger" : "success"}
        showDuration={false}
        showNote={false}
        loading={updateNovelLockMutation.isPending}
      />
    </motion.div>
  );
};

export default NovelList;
