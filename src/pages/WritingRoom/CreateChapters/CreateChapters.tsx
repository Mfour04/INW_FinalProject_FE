import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GetNovelById } from "../../../api/Novels/novel.api";
import { DeleteChapter } from "../../../api/Chapters/chapter.api";

import { formatTicksToRelativeTime } from "../../../utils/date_format";
import { MiniPager } from "./MiniPager";
import NovelInfoCard from "./NovelInfoCard";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { useToast } from "../../../context/ToastContext/toast-context";

import {
  ChevronLeft,
  Bookmark,
  Pencil,
  ArrowUpDown,
  Delete as DeleteIcon,
} from "lucide-react";

type Tabs = "Chapter" | "Draft";

type Chapter = {
  chapterId: string;
  chapterNumber: number;
  title: string;
  createAt: number;
  updateAt?: number;
  isDraft: boolean;
  isPaid?: boolean;
  price?: number;
};

export const CreateChapters = () => {
  const [tab, setTab] = useState<Tabs>("Chapter");
  const [sortDesc, setSortDesc] = useState(false);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedChaptersId, setSelectedChaptersId] = useState<string>("");

  const { novelId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["novel", novelId],
    queryFn: () => GetNovelById(novelId!).then((res) => res.data.data),
    enabled: !!novelId,
  });

  const novel = data?.novelInfo;
  const chapters: Chapter[] = data?.allChapters ?? [];

  const { published, drafts } = useMemo(() => {
    const p = chapters.filter((c) => !c.isDraft);
    const d = chapters.filter((c) => c.isDraft);
    return { published: p, drafts: d };
  }, [chapters]);

  const activeList = tab === "Draft" ? drafts : published;

  const sortedList = useMemo(
    () =>
      [...activeList].sort((a, b) =>
        sortDesc
          ? b.chapterNumber - a.chapterNumber
          : a.chapterNumber - b.chapterNumber
      ),
    [activeList, sortDesc]
  );

  const DeleteChapterMutation = useMutation({
    mutationFn: (id: string) => DeleteChapter(id),
    onSuccess: () => {
      toast?.onOpen("Xóa chương truyện thành công!");
      setDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["novel", novelId] });
    },
  });

  const onDeleteClick = (id: string) => {
    setSelectedChaptersId(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedChaptersId) DeleteChapterMutation.mutate(selectedChaptersId);
  };

  const lastChapter = chapters.length
    ? chapters[chapters.length - 1]
    : undefined;

  // simple paging (client-side)
  const perPage = 20;
  const totalPages = Math.max(Math.ceil(sortedList.length / perPage), 1);
  const currentPage = 1;
  const pageItems = sortedList.slice(0, perPage);

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 space-y-5 text-zinc-900 dark:text-white">
      {/* Header */}
      <div className="flex top-0 z-20">
        <div className="relative py-2 sm:py-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => navigate(-1)}
                className={[
                  "h-9 w-9 grid place-items-center rounded-lg transition",
                  "bg-zinc-100 ring-1 ring-zinc-200 hover:bg-zinc-200",
                  "dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/12",
                ].join(" ")}
                title="Quay lại"
                aria-label="Quay lại"
              >
                <ChevronLeft className="w-[18px] h-[18px]" />
              </button>

              <div className="flex flex-col">
                <div className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-tight">
                  Quản lý chương
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Novel info */}
      <NovelInfoCard
        title={novel?.title}
        description={novel?.description}
        status={novel?.status}
        novelImage={novel?.novelImage || undefined}
        tags={novel?.tags ?? []}
        stats={{ rating: 0, bookmark: 0, comment: 0 }}
      />

      {/* List */}
      <section
        className={[
          "rounded-2xl ring-1 backdrop-blur-md shadow-[0_16px_52px_-20px_rgba(0,0,0,0.06)]",
          "bg-white ring-zinc-200",
          "dark:bg-[#121212]/80 dark:ring-white/12 dark:shadow-[0_16px_52px_-20px_rgba(0,0,0,0.6)]",
        ].join(" ")}
      >
        {/* Tabs + Actions */}
        <div className="px-3 md:px-4 pt-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Tabs */}
            <div
              className={[
                "inline-flex rounded-xl overflow-hidden ring-1",
                "ring-zinc-200",
                "dark:ring-white/10",
              ].join(" ")}
            >
              <button
                onClick={() => setTab("Chapter")}
                className={[
                  "px-3 sm:px-4 py-2 text-[13px] sm:text-[13.5px] md:text-[14px] transition",
                  "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
                  "dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/10",
                  tab === "Chapter"
                    ? "font-semibold bg-zinc-200 dark:bg-white/15 dark:text-white"
                    : "",
                ].join(" ")}
              >
                Đã đăng{" "}
                <span className="ml-1 text-zinc-600 dark:text-white/70">
                  ({published.length})
                </span>
              </button>
              <button
                onClick={() => setTab("Draft")}
                className={[
                  "px-3 sm:px-4 py-2 text-[13px] sm:text-[13.5px] md:text-[14px] border-l transition",
                  "border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
                  "dark:border-white/10 dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/10",
                  tab === "Draft"
                    ? "font-semibold bg-zinc-200 dark:bg-white/15 dark:text-white"
                    : "",
                ].join(" ")}
              >
                Bản nháp{" "}
                <span className="ml-1 text-zinc-600 dark:text-white/70">
                  ({drafts.length})
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortDesc((v) => !v)}
                className={[
                  "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] sm:text-[12.5px] transition",
                  "border border-zinc-200 bg-zinc-100 hover:bg-zinc-200",
                  "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                ].join(" ")}
                title="Đổi thứ tự chương"
              >
                <ArrowUpDown
                  className={`w-[18px] h-[18px] transition-transform ${
                    sortDesc ? "rotate-180" : "rotate-0"
                  }`}
                />
                <span className="hidden md:inline">
                  {sortDesc ? "Mới → Cũ" : "Cũ → Mới"}
                </span>
              </button>

              <button
                onClick={() =>
                  navigate(`/novels/writing-room/${novelId}/upsert-chapter`)
                }
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12.5px] sm:text-[13px] transition",
                  "text-white bg-gradient-to-r from-[#ff7a45] to-[#ff5e3a] hover:opacity-90",
                ].join(" ")}
              >
                <Bookmark className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">Chương mới</span>
                <span className="sm:hidden">Thêm</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-zinc-200 dark:border-white/10" />

        {/* Last updated */}
        <div className="px-3 md:px-4 mt-3">
          <div
            className={[
              "rounded-xl px-3 sm:px-4 py-3 flex flex-wrap items-center gap-2 sm:gap-3 backdrop-blur",
              "border border-zinc-200 bg-zinc-50",
              "dark:border-white/12 dark:bg-[#151618]/85 dark:shadow-[0_14px_40px_-22px_rgba(0,0,0,0.7)]",
            ].join(" ")}
          >
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-wide text-zinc-700 dark:text-white/85 uppercase">
              Cập nhật gần nhất
            </span>
            <span className="text-[12px] sm:text-[13px] text-[#ff7a45] dark:text-[#ff8a5f]">
              {lastChapter
                ? `Chương ${lastChapter.chapterNumber}: ${lastChapter.title}`
                : "—"}
            </span>
            <span className="hidden sm:inline text-zinc-400 dark:text-white/40">
              •
            </span>
            <span className="text-[11px] sm:text-[12px] text-zinc-500 dark:text-gray-400">
              {lastChapter?.updateAt
                ? formatTicksToRelativeTime(lastChapter.updateAt)
                : lastChapter?.createAt
                ? formatTicksToRelativeTime(lastChapter.createAt)
                : ""}
            </span>
          </div>
        </div>

        {/* List items */}
        <div className="p-3 md:p-4">
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-zinc-100 animate-pulse dark:bg-white/5"
                />
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-10 text-zinc-600 dark:text-white/60">
              {tab === "Draft"
                ? "Chưa có bản nháp nào."
                : "Chưa có chương đã đăng."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pageItems.map((chapter, idx) => {
                const isDraft = chapter.isDraft;
                const onCardClick = () => {
                  if (isDraft) {
                    navigate(
                      `/novels/writing-room/${novelId}/upsert-chapter/${chapter.chapterId}`
                    );
                  } else {
                    navigate(`/novels/${novel?.slug}/${chapter.chapterId}`);
                  }
                };
                const onEditClick = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  navigate(
                    `/novels/writing-room/${novelId}/upsert-chapter/${chapter.chapterId}`
                  );
                };

                const numberShown = isDraft ? idx + 1 : chapter.chapterNumber;

                return (
                  <div
                    key={chapter.chapterId}
                    onClick={onCardClick}
                    className={[
                      "group relative w-full overflow-hidden text-left rounded-2xl border px-4 py-3 transition backdrop-blur",
                      "bg-white hover:bg-zinc-50 border-zinc-200 shadow-sm",
                      "dark:bg-[#141416]/92 dark:hover:bg-[#17181b]/92 dark:border-white/12",
                      "dark:shadow-[0_18px_52px_-24px_rgba(0,0,0,0.75)] dark:hover:shadow-[0_26px_72px_-28px_rgba(0,0,0,0.78)]",
                    ].join(" ")}
                    title={isDraft ? "Sửa chương nháp" : "Đọc chương"}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_150deg_at_50%_0%,rgba(0,0,0,0.03),transparent_30%)] dark:bg-[conic-gradient(from_150deg_at_50%_0%,rgba(255,255,255,0.06),transparent_30%)]" />
                    </div>

                    <div className="relative flex items-center gap-3">
                      <div
                        className={[
                          "shrink-0 grid place-items-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border text-[11.5px] sm:text-[12px] font-semibold",
                          "bg-zinc-100 border-zinc-200 text-zinc-900",
                          "dark:bg-white/[0.06] dark:border-white/10 dark:text-white/85",
                        ].join(" ")}
                      >
                        {numberShown}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] sm:text-[14px] font-medium">
                          {chapter.title}
                        </p>
                        <p className="mt-1 text-[11.5px] sm:text-[12px] text-zinc-500 dark:text-gray-400">
                          {chapter.updateAt
                            ? formatTicksToRelativeTime(chapter.updateAt)
                            : formatTicksToRelativeTime(chapter.createAt)}
                        </p>
                      </div>

                      {!isDraft && (
                        <div className="ml-2 flex items-center gap-2">
                          {typeof chapter.price === "number" &&
                            chapter.price > 0 && (
                              <span className="rounded-full px-2 py-1 text-[10.5px] leading-none border bg-amber-100 text-amber-700 border-amber-300/60 dark:border-amber-300/35 dark:bg-amber-300/12 dark:text-amber-200">
                                {chapter.price.toLocaleString("vi-VN")} xu
                              </span>
                            )}
                          <button
                            onClick={onEditClick}
                            className={[
                              "inline-flex h-8 w-8 items-center justify-center rounded-xl transition",
                              "border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800",
                              "dark:bg-white/[0.06] dark:border-white/14 dark:text-white/90 dark:hover:bg-white/[0.14]",
                            ].join(" ")}
                            title="Chỉnh sửa chương"
                            aria-label="Chỉnh sửa chương"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteClick(chapter.chapterId);
                            }}
                            className={[
                              "inline-flex h-8 w-8 items-center justify-center rounded-xl transition",
                              "border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800",
                              "dark:bg-white/[0.06] dark:border-white/14 dark:text-white/90 dark:hover:bg-white/[0.14]",
                            ].join(" ")}
                            title="Xóa"
                            aria-label="Xóa"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {isDraft && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span
                            className={[
                              "rounded-md px-2 py-1 text-[10.5px] sm:text-[11px] font-semibold",
                              "bg-zinc-200 text-zinc-800 ring-1 ring-zinc-300 shadow-sm",
                              "dark:text-white dark:bg-gradient-to-r dark:from-[#6a6f78] dark:to-[#545b66] dark:ring-1 dark:ring-white/10 dark:shadow-md",
                            ].join(" ")}
                            title="Nháp"
                          >
                            Nháp
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteClick(chapter.chapterId);
                            }}
                            className={[
                              "inline-flex h-8 w-8 items-center justify-center rounded-xl transition",
                              "border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800",
                              "dark:bg-white/[0.06] dark:border-white/14 dark:text-white/90 dark:hover:bg-white/[0.14]",
                            ].join(" ")}
                            title="Xóa"
                            aria-label="Xóa"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <MiniPager
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={(p) => {
                console.log("goto page", p);
              }}
            />
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={deleteModal}
        title="Xóa Chương truyện"
        message="Bạn có chắc chắc muốn xóa chương truyện không?"
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
