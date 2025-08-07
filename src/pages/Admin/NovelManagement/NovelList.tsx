import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DarkModeToggler } from "../../../components/DarkModeToggler";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import SearchBar from "../AdminModal/SearchBar";
import ActionButtons from "../AdminModal/ActionButtons";
import DataTable from "../AdminModal/DataTable";
import Pagination from "../AdminModal/Pagination";
import NovelTopSection from "./NovelTopSection";
import ChapterManagementPopup from "./ChapterManagementPopup";
import { GetNovels, UpdateNovelLock } from "../../../api/Novels/novel.api";
import { GetChaptersAdmin } from "../../../api/Chapters/chapter.api";
import { formatTicksToDateString } from "../../../utils/date_format";
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
};

const NovelList = () => {
  const queryClient = useQueryClient();
  const [selectedNovels, setSelectedNovels] = useState<string[]>([]);
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
  });
  const [isChapterPopupOpen, setIsChapterPopupOpen] = useState(false);
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  const threeDaysAgo = Date.now() - 3 * 24 * 3600 * 1000;

  useEffect(() => {
    console.log(
      "selectedNovelId:",
      selectedNovelId,
      "isChapterPopupOpen:",
      isChapterPopupOpen
    );
  }, [selectedNovelId, isChapterPopupOpen]);

  const sortBy = `${keyToApiField[sortConfig.key]}:${sortConfig.direction}`;

  // Fetch novels
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

  // Map API novel data to NovelAdmin interface
  const mappedNovels: NovelAdmin[] =
    novelData?.data?.novels?.map((novel) => ({
      NovelId: novel.novelId,
      Title: novel.title,
      AuthorName: novel.authorName,
      NovelImage: novel.novelImage,
      Status:
        novel.status === 1
          ? "Completed"
          : novel.status === 2
          ? "Hiatus"
          : "Ongoing",
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
    })) || [];

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
    },
    onError: (error) => {
      console.error("Failed to update novel lock status:", error);
    },
  });

  // Mutation for delete
  // const deleteNovelMutation = useMutation({
  //   mutationFn: (novelId: string) => DeleteNovel(novelId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["novels"] });
  //   },
  //   onError: (error) => {
  //     console.error("Failed to delete novel:", error);
  //   },
  // });

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

  const handleSelectNovel = (novelId: string) => {
    setSelectedNovels((prev) =>
      prev.includes(novelId)
        ? prev.filter((id) => id !== novelId)
        : [...prev, novelId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNovels.length === mappedNovels.length) {
      setSelectedNovels([]);
    } else {
      setSelectedNovels(mappedNovels.map((novel) => novel.NovelId));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key: key as keyof NovelAdmin,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (novelData?.data?.totalPages || 1)) {
      setCurrentPage(page);
      setSelectedNovels([]);
    }
  };

  const handleLockUnlock = () => {
    const selectedNovelObjects = mappedNovels.filter((novel) =>
      selectedNovels.includes(novel.NovelId)
    );
    const allLocked = selectedNovelObjects.every((novel) => novel.IsLock);
    const action = allLocked ? "unlock" : "lock";
    const title = `Bạn muốn ${
      action === "lock" ? "khóa" : "mở khóa"
    } truyện: ${selectedNovelObjects.map((n) => n.Title).join(", ")} ?`;
    setDialog({ isOpen: true, type: action, title });
  };

  // const handleDelete = () => {
  //   const selectedNovelObjects = mappedNovels.filter((novel) =>
  //     selectedNovels.includes(novel.NovelId)
  //   );
  //   const title = `Bạn muốn xóa truyện: ${selectedNovelObjects
  //     .map((n) => n.Title)
  //     .join(", ")} ?`;
  //   setDialog({ isOpen: true, type: "delete", title });
  // };

  const handleConfirmDialog = () => {
    if (dialog.type === "lock") {
      selectedNovels.forEach((novelId) => {
        updateNovelLockMutation.mutate({ novelId, isLocked: true });
      });
      console.log(`Thực hiện lock cho truyện: ${selectedNovels.join(", ")}`);
    } else if (dialog.type === "unlock") {
      selectedNovels.forEach((novelId) => {
        updateNovelLockMutation.mutate({ novelId, isLocked: false });
      });
      console.log(`Thực hiện unlock cho truyện: ${selectedNovels.join(", ")}`);
    }
    // else if (dialog.type === "delete") {
    //   selectedNovels.forEach((novelId) => {
    //     deleteNovelMutation.mutate(novelId);
    //   });
    //   console.log(`Xóa truyện: ${selectedNovels.join(", ")}`);
    // }
    setSelectedNovels([]);
    setDialog({ isOpen: false, type: null, title: "" });
  };

  const handleOpenChapterPopup = (novelId: string) => {
    setSelectedNovelId(novelId);
    setIsChapterPopupOpen(true);
    console.log("Opening popup with novelId:", novelId);
  };

  const handleLockChapter = (chapterId: string) => {
    console.log(`Khóa chương: ${chapterId}`);
  };

  const handleUnlockChapter = (chapterId: string) => {
    console.log(`Mở khóa chương: ${chapterId}`);
  };

  const selectedNovelObjects = mappedNovels.filter((novel) =>
    selectedNovels.includes(novel.NovelId)
  );
  const canLock = selectedNovelObjects.every((novel) => !novel.IsLock);
  const canUnlock = selectedNovelObjects.every((novel) => novel.IsLock);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý truyện
        </h1>
        <DarkModeToggler />
      </div>
      {isLoadingNovels ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : novelError ? (
        <p className="text-red-600">Failed to load novels</p>
      ) : (
        <>
          <NovelTopSection novels={mappedNovels} threeDaysAgo={threeDaysAgo} />
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <ActionButtons
              canLock={canLock}
              canUnlock={canUnlock}
              selectedCount={selectedNovels.length}
              onLockUnlock={handleLockUnlock}
            />
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
          <DataTable
            data={mappedNovels}
            selectedItems={selectedNovels}
            sortConfig={sortConfig}
            onSelectItem={handleSelectNovel}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            type="novel"
            onOpenChapterPopup={handleOpenChapterPopup}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={novelData?.data?.totalPages || 1}
            onPageChange={handlePageChange}
          />
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
          onLockChapter={handleLockChapter}
          onUnlockChapter={handleUnlockChapter}
        />
      )}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, type: null, title: "" })}
        onConfirm={handleConfirmDialog}
        title={dialog.title}
        isLockAction={dialog.type === "lock"}
        type="novel"
      />
    </motion.div>
  );
};

export default NovelList;
