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

interface SortConfig {
  key: keyof NovelAdmin;
  direction: "asc" | "desc";
}

interface DialogState {
  isOpen: boolean;
  type: "lock" | "unlock" | "delete" | null;
  title: string;
  novelId: string | null;
}

const novelsPerPage = 10;

const keyToApiField: Record<keyof NovelAdmin, string> = {
  NovelId: "novelId",
  Title: "title",
  AuthorName: "authorName",
  NovelImage: "novelImage",
  Status: "status",
  IsPublic: "isPublic",
  IsLock: "isLock",
  TotalViews: "totalViews",
  Followers: "followers",
  RatingAvg: "ratingAvg",
  CreateAt: "createAt",
  UpdateAt: "updateAt",
  description: "description",
  authorId: "authorId",
  tags: "tags",
  isPaid: "isPaid",
  price: "price",
  totalChapters: "totalChapters",
  ratingCount: "ratingCount",
  Slug: "slug",
};

// Memoize components
const MemoizedNovelTopSection = memo(NovelTopSection);
const MemoizedPagination = memo(Pagination);

const NovelList = () => {
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "Title",
    direction: "asc",
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

  const sortBy = `${keyToApiField[sortConfig.key]}:${sortConfig.direction}`;

  // Fetch novels for DataTable (paginated)
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

  // Fetch all novels for NovelTopSection (no pagination)
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

  // Map API novel data to NovelAdmin interface for DataTable
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

  // Memoize mappedAllNovels to avoid recalculation
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

  // Fetch chapters for selected novel
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

  // Mutation for lock/unlock
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
      key: key as keyof NovelAdmin,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
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

  const handleConfirmDialog = () => {
    if (dialog.novelId && dialog.type) {
      const isLocked = dialog.type === "lock";
      updateNovelLockMutation.mutate({ novelId: dialog.novelId, isLocked });
    }
  };

  const handleOpenChapterPopup = (novelId: string) => {
    setSelectedNovelId(novelId);
    setIsChapterPopupOpen(true);
  };

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
        {/* <DarkModeToggler /> */}
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
            <div className="text-center">
              <svg
                className={`animate-spin h-8 w-8 mx-auto ${
                  darkMode ? "text-[#ff4d4f]" : "text-[#ff4d4f]"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Đang tải...
              </p>
            </div>
          ) : novelError ? (
            <p
              className={`text-center ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              Không thể tải danh sách truyện
            </p>
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
              <MemoizedPagination
                currentPage={currentPage}
                totalPages={novelData?.data?.totalPages || 1}
                onPageChange={handlePageChange}
              />
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
        isLockAction={dialog.type === "lock"}
        type="novel"
        isLoading={updateNovelLockMutation.isPending}
      />
    </motion.div>
  );
};

export default NovelList;
