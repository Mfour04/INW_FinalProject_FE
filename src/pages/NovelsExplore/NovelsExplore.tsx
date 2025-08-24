import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ArrowLeft02 from "../../assets/svg/Novels/arrow-left-02-stroke-rounded.svg";
import { GetNovels } from "../../api/Novels/novel.api";

import { NCard } from "../../components/ui/cards/NCard";
import { NListItem } from "../../components/ui/cards/NListItem";
import { Pager } from "../../components/ui/navigation/Pager";
import { SkeletonCard } from "../../components/ui/feedback/SkeletonCard";
import { EmptyState } from "../../components/ui/feedback/EmptyState";

import type { ViewMode } from "./types";
import { LayoutGrid, List, RotateCcw } from "lucide-react";
import type { Novel } from "../../entity/novel";

type Props = { sidebarCollapsed?: boolean };

const VIEW_LS_KEY = "novels:view";

export const NovelsExplore = ({}: Props) => {
  const [view, setView] = useState<ViewMode>("Grid");
  const [page, setPage] = useState<number>(0);
  const limit = 20;

  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const searchTerm = sp.get("query") || "";
  const sortBy = sp.get("selectedSort") || "";
  const searchTagTerm = sp.get("tag") || "";

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["novels", { searchTerm, page, limit, sortBy, searchTagTerm }],
    queryFn: () =>
      GetNovels({
        ...(searchTerm.trim() ? { searchTerm } : {}),
        page,
        limit,
        ...(sortBy ? { sortBy } : {}),
        ...(searchTagTerm ? { searchTagTerm } : {}),
      }),
    staleTime: 30_000,
  });

  const novels: Novel[] = Array.isArray(data?.data?.data?.novels)
    ? data!.data.data.novels
    : [];

  const totalPages: number = data?.data?.data?.totalPages ?? 1;

  const gridView = useMemo(
    () => (
      <div
        className="
          grid gap-x-8 gap-y-8 auto-rows-fr
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
    <div className="flex flex-wrap items-center gap-2">
      {searchTerm && (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] bg-white/[0.07] border border-white/10 text-white/90">
          Từ khóa:
          <span className="font-medium text-white">{searchTerm}</span>
        </span>
      )}
      {searchTagTerm && (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] bg-white/[0.07] border border-white/10 text-white/90">
          Thẻ:
          <span className="font-medium text-white">{searchTagTerm}</span>
        </span>
      )}
      {sortBy && (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] bg-white/[0.07] border border-white/10 text-white/90">
          Sắp xếp:
          <span className="font-medium text-white">{sortBy}</span>
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-[#0b0d11] text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
        {/* Header */}
        <div className="flex top-0 z-20 mb-10">
          <div className="w-full rounded-2xl backdrop-blur-md shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)] overflow-hidden">
            <div className="relative py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-10">
                  <button
                    onClick={() => navigate(-1)}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.12] transition"
                    title="Quay lại"
                    aria-label="Quay lại"
                  >
                    <img src={ArrowLeft02} className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col">
                    <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
                      Khám phá tiểu thuyết
                    </div>
                    {(searchTerm || searchTagTerm || sortBy) && (
                      <div className="mt-1">{filterChips}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-white/10">
                    <button
                      onClick={() => setView("Grid")}
                      className={[
                        "h-9 w-9 grid place-items-center",
                        view === "Grid"
                          ? "bg-white/15 text-white"
                          : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1]",
                      ].join(" ")}
                      title="Xem dạng lưới"
                      aria-label="Xem dạng lưới"
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button
                      onClick={() => setView("List")}
                      className={[
                        "h-9 w-9 grid place-items-center border-l border-white/10",
                        view === "List"
                          ? "bg-white/15 text-white"
                          : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1]",
                      ].join(" ")}
                      title="Xem dạng danh sách"
                      aria-label="Xem dạng danh sách"
                    >
                      <List size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => refetch()}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.12] transition"
                    title="Làm mới"
                    aria-label="Làm mới"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
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
