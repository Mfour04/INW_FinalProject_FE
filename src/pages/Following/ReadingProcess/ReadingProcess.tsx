import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, Trash , ArrowLeft } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { GetReadingProcess } from "../../../api/ReadingHistory/reading.api";

import { NCard } from "../../../components/ui/cards/NCard";
import { NListItem } from "../../../components/ui/cards/NListItem";
import { Pager } from "../../../components/ui/navigation/Pager";
import { SkeletonCard } from "../../../components/ui/feedback/SkeletonCard";
import { EmptyState } from "../../../components/ui/feedback/EmptyState";

type ViewMode = "Grid" | "List";
type Props = { sidebarCollapsed?: boolean };

type ReadingItem = {
  novelId: string;
  slug: string;
  chapterId: string;
  novelImage?: string | null;
  title: string;
  tags?: Array<{ tagId: string | number; name?: string }>;
  ratingAvg?: number;
  followers?: number;
  totalViews?: number;
  commentCount?: number;
  status: number;
  authorName?: string | null;
};

const VIEW_LS_KEY = "reading:view";

export const ReadingProcess = ({ sidebarCollapsed = false }: Props) => {
  const [view, setView] = useState<ViewMode>("Grid");
  const [page, setPage] = useState<number>(0);
  const limit = 20;

  const navigate = useNavigate();
  const { auth } = useAuth();

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["reading:history", { userId: auth?.user.userId }],
    queryFn: async () =>
      GetReadingProcess(auth!.user.userId).then((res) => {
        const arr = Array.isArray(res.data?.data) ? res.data.data : [];
        return arr as ReadingItem[];
      }),
    staleTime: 30_000,
    enabled: !!auth?.user.userId,
  });

  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử đọc?")) {
      // gọi API xóa ở đây
      console.log("Clearing reading history...");
      refetch(); // refresh lại để rỗng
    }
  };

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

  const items = Array.isArray(data) ? data : [];
  const totalPages = Math.max(1, Math.ceil(items.length / limit));

  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  const paged = useMemo(() => {
    const start = page * limit;
    return items.slice(start, start + limit);
  }, [items, page, limit]);

  const gridView = useMemo(
  () => (
    <div
      className={[
        "grid gap-x-8 gap-y-8",
        "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
      ].join(" ")}
    >
      {paged.map((n) => (
        <div key={`${n.novelId}-${n.chapterId}`} className="aspect-[3/4]">
          <NCard
            title={n.title}
            slug={n.slug}
            image={n.novelImage}
            rating={Number(n.ratingAvg ?? 0)}
            bookmarks={Number(n.followers ?? 0)}
            views={Number(n.totalViews ?? 0)}
            status={n.status}
            onClick={() => navigate(`/novels/${n.slug}/${n.chapterId}`)}
          />
        </div>
      ))}

      {isFetching &&
        Array.from({ length: Math.min(6, Math.max(0, limit - paged.length)) }).map(
          (_, i) => (
            <div key={`s-${i}`} className="aspect-[3/4]">
              <SkeletonCard />
            </div>
          )
        )}
    </div>
  ),
  [paged, isFetching, navigate, limit]
);


  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-[#0b0d11] text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
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
                    <ArrowLeft size={18} />
                  </button>

                  <div className="flex flex-col">
                    <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
                      Lịch sử đọc
                    </div>
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
                    onClick={handleClearHistory}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10 hover:bg-red-500/20 text-red-400 transition"
                    title="Xóa lịch sử"
                    aria-label="Xóa lịch sử"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isError ? (
          <EmptyState
            title="Không tải được lịch sử đọc"
            subtitle="Có lỗi khi tải dữ liệu. Hãy thử làm mới lại."
            actionText="Thử lại"
            onAction={refetch}
          />
        ) : items.length === 0 && !isFetching ? (
          <EmptyState
            title="Chưa có lịch sử đọc"
            subtitle="Bắt đầu đọc truyện và mình sẽ hiển thị lịch sử tại đây."
          />
        ) : view === "Grid" ? (
          <div className="mb-10">{gridView}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {paged.map((n) => (
              <NListItem
                key={`${n.novelId}-${n.chapterId}`}
                title={n.title}
                slug={n.slug}
                author={n.authorName || "Tên tác giả"}
                image={n.novelImage}
                rating={Number(n.ratingAvg ?? 0)}
                bookmarks={Number(n.followers ?? 0)}
                views={Number(n.totalViews ?? 0)}
                status={n.status}
                tags={Array.isArray(n.tags) ? n.tags.slice(0, 8) : []}
                onClick={() => navigate(`/novels/${n.slug}/${n.chapterId}`)}
              />
            ))}
            {isFetching &&
              Array.from({
                length: Math.min(2, Math.max(0, limit - paged.length)),
              }).map((_, i) => <SkeletonCard key={`ls-${i}`} />)}
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

export default ReadingProcess;
