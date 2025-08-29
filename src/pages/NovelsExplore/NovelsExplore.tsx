import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { GetNovels } from "../../api/Novels/novel.api";

import { NCard } from "../../components/ui/cards/NCard";
import { NListItem } from "../../components/ui/cards/NListItem";
import { Pager } from "../../components/ui/navigation/Pager";
import { SkeletonCard } from "../../components/ui/feedback/SkeletonCard";
import { EmptyState } from "../../components/ui/feedback/EmptyState";

import type { ViewMode } from "./types";
import { LayoutGrid, List, RotateCcw, ChevronLeft } from "lucide-react";
import type { Novel } from "../../entity/novel";
import { getTags } from "../../api/Tags/tag.api";
import { sortOptions } from "../../components/common/Header/Header";

type Props = { sidebarCollapsed?: boolean };

const VIEW_LS_KEY = "novels:view";

export const NovelsExplore = ({}: Props) => {
  const [view, setView] = useState<ViewMode>("Grid");
  const [page, setPage] = useState<number>(0);
  const limit = 20;

  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const searchTerm = sp.get("query") || "";
  const sortBy = sp.get("sortBy") || "";
  const searchTags: string[] = sp.getAll("tag");

  const { data: tags } = useQuery({
    queryKey: ["tag_novel_explore"],
    queryFn: () => getTags().then((res) => res.data),
  });

  const mappedTagNames: string[] = searchTags
    .map((id) => tags?.data.find((t) => t.tagId === id)?.name)
    .filter((n): n is string => !!n);

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["novels", { searchTerm, page, limit, sortBy, searchTags }],
    queryFn: () => {
      const params = {
        page,
        limit,
        ...(searchTerm.trim() ? { searchTerm } : {}),
        ...(sortBy ? { sortBy } : {}),
        ...(searchTags && searchTags.length > 0
          ? { searchTagTerm: searchTags.join(",") }
          : {}),
      };
      return GetNovels(params);
    },
    staleTime: 0,
  });

  const novels: Novel[] = Array.isArray(data?.data?.data?.novels)
    ? data!.data.data.novels
    : [];

  const totalPages: number = data?.data?.data?.totalPages ?? 1;

  const gridView = useMemo(
    () => (
      <div
        className="
          grid gap-x-5 gap-y-6 sm:gap-x-8 sm:gap-y-8 auto-rows-fr
          [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
        "
      >
        {novels.map((n) => (
          <div key={n.novelId} className="h-full">
            <NCard
              title={n.title}
              slug={n.slug}
              image={n.novelImage}
              rating={Number(n.ratingAvg ?? 0)}
              bookmarks={n.followers ?? 0}
              views={n.totalViews ?? 0}
              status={n.status}
              onClick={() => navigate(`/novels/${n.slug}`)}
            />
          </div>
        ))}
        {isFetching &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`s-${i}`} className="h-full">
              <SkeletonCard />
            </div>
          ))}
      </div>
    ),
    [novels, isFetching, navigate]
  );

  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem(VIEW_LS_KEY)
          : null;
      if (saved === "Grid" || saved === "List") setView(saved as ViewMode);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        window.localStorage.setItem(VIEW_LS_KEY, view);
    } catch {}
  }, [view]);

  const filterChips = (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {searchTerm && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px]
                         bg-gray-100 border border-gray-200 text-gray-700
                         dark:bg-white/[0.07] dark:border-white/10 dark:text-white/90"
        >
          Từ khóa:
          <span className="font-medium text-gray-900 dark:text-white">
            {searchTerm}
          </span>
        </span>
      )}
      {searchTags.length > 0 && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px]
                         bg-gray-100 border border-gray-200 text-gray-700
                         dark:bg-white/[0.07] dark:border-white/10 dark:text-white/90"
        >
          Thẻ:
          <span className="font-medium text-gray-900 dark:text-white">
            {searchTags.join(", ")}
          </span>
        </span>
      )}

      {sortBy && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px]
                         bg-gray-100 border border-gray-200 text-gray-700
                         dark:bg-white/[0.07] dark:border-white/10 dark:text-white/90"
        >
          Sắp xếp:
          <span className="font-medium text-gray-900 dark:text-white">
            {sortOptions.find((option) => option.value === sortBy)?.label ||
              sortBy}
          </span>
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 px-3 sm:px-4 md:px-6 py-4 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full px-2 sm:px-4">
        {/* Header */}
        <div className="flex top-0 z-20 mb-6 sm:mb-8 md:mb-10">
          <div
            className="w-full rounded-2xl backdrop-blur-md overflow-hidden
                          dark:bg-transparent dark:ring-white/10 dark:shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)]"
          >
            <div className="relative py-2.5 sm:py-3 px-1 sm:px-2 flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-6 md:gap-10 min-w-0">
                <button
                  onClick={() => navigate(-1)}
                  className="h-8 w-8 sm:h-9 sm:w-9 grid place-items-center rounded-lg 
                              bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                              dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg:white/[0.12]"
                  title="Quay lại"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-[16px] sm:w-[16px]" />
                </button>

                <div className="flex flex-col min-w-0">
                  <div className="text-[15px] sm:text-[18px] md:text-[20px] font-semibold leading-tight truncate">
                    Khám phá tiểu thuyết
                  </div>
                  {(searchTerm || searchTags || sortBy) && (
                    <div className="mt-1">{filterChips}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-white/10">
                  <button
                    onClick={() => setView("Grid")}
                    className={[
                      "h-8 w-8 sm:h-9 sm:w-9 grid place-items-center",
                      view === "Grid"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      "dark:text-white dark:bg-white/[0.06] dark:hover:bg-white/[0.1]",
                      view === "Grid" ? "dark:bg-white/15 dark:text-white" : "",
                    ].join(" ")}
                    title="Xem dạng lưới"
                    aria-label="Xem dạng lưới"
                  >
                    <LayoutGrid className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </button>
                  <button
                    onClick={() => setView("List")}
                    className={[
                      "h-8 w-8 sm:h-9 sm:w-9 grid place-items-center border-l border-gray-200",
                      view === "List"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      "dark:border-white/10 dark:text-white dark:bg-white/[0.06] dark:hover:bg-white/[0.1]",
                      view === "List" ? "dark:bg:white/15 dark:text-white" : "",
                    ].join(" ")}
                    title="Xem dạng danh sách"
                    aria-label="Xem dạng danh sách"
                  >
                    <List className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </button>
                </div>

                <button
                  onClick={() => refetch()}
                  className="h-8 w-8 sm:h-9 sm:w-9 grid place-items-center rounded-lg
                              bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                              dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg:white/[0.12]"
                  title="Làm mới"
                  aria-label="Làm mới"
                >
                  <RotateCcw className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isError ? (
          <EmptyState
            title="Không tải được danh sách"
            subtitle="Có lỗi khi tải dữ liệu. Hãy thử làm mới lại."
            actionText="Thử lại"
            onAction={refetch}
          />
        ) : novels.length === 0 && !isFetching ? (
          <EmptyState
            title="Chưa có kết quả phù hợp"
            subtitle="Hãy thử thay đổi từ khóa / bộ lọc để khám phá thêm."
          />
        ) : view === "Grid" ? (
          <div className="mb-10">{gridView}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
            {novels.map((n) => (
              <NListItem
                key={n.novelId}
                title={n.title}
                slug={n.slug}
                author={n.authorName || "Tên Tác Giả"}
                image={n.novelImage}
                rating={Number(n.ratingAvg ?? 0)}
                bookmarks={n.followers ?? 0}
                views={n.totalViews ?? 0}
                status={n.status}
                tags={Array.isArray(n.tags) ? n.tags.slice(0, 8) : []}
                onClick={() => navigate(`/novels/${n.slug}`)}
              />
            ))}
            {isFetching &&
              Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={`ls-${i}`} />
              ))}
          </div>
        )}

        <Pager
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      </div>
    </div>
  );
};

export default NovelsExplore;
