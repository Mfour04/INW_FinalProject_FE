import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, Trash, ArrowLeft, CheckSquare, Square, X } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { GetReadingProcess } from "../../../api/ReadingHistory/reading.api";
// NOTE: Chưa có API xóa, nên không import DeleteReadingProcesses

import { NCard } from "../../../components/ui/cards/NCard";
import { NListItem } from "../../../components/ui/cards/NListItem";
import { Pager } from "../../../components/ui/navigation/Pager";
import { SkeletonCard } from "../../../components/ui/feedback/SkeletonCard";
import { EmptyState } from "../../../components/ui/feedback/EmptyState";
import type { Tag } from "../../NovelsExplore/types";

type ViewMode = "Grid" | "List";
type Props = { sidebarCollapsed?: boolean };

type ReadingItem = {
  readingProcessId?: string; // ID dùng để xóa (nếu backend trả về)
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
const PAGE_LIMIT = 20;

export const ReadingProcess = ({ sidebarCollapsed = false }: Props) => {
  const [view, setView] = useState<ViewMode>("Grid");
  const [page, setPage] = useState<number>(0);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  const items = Array.isArray(data) ? data : [];
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_LIMIT));

  const paged = useMemo(() => {
    const start = page * PAGE_LIMIT;
    return items.slice(start, start + PAGE_LIMIT);
  }, [items, page]);

  const isAllOnPageSelected = useMemo(() => {
    if (!selectionMode || paged.length === 0) return false;
    return paged.every((n) => {
      const rpid = n.readingProcessId ?? `${n.novelId}-${n.chapterId}`;
      return selected.has(rpid);
    });
  }, [selectionMode, paged, selected]);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    if (!selectionMode) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (isAllOnPageSelected) {
        paged.forEach((n) => {
          const rpid = n.readingProcessId ?? `${n.novelId}-${n.chapterId}`;
          next.delete(rpid);
        });
      } else {
        paged.forEach((n) => {
          const rpid = n.readingProcessId ?? `${n.novelId}-${n.chapterId}`;
          next.add(rpid);
        });
      }
      return next;
    });
  };

  const enterSelectionMode = () => {
    setSelectionMode(true);
    setSelected(new Set());
  };

  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelected(new Set());
  };

  const handleDeleteSelected = async () => {
    if (!selectionMode || selected.size === 0) return;
    if (!window.confirm(`Xóa ${selected.size} mục lịch sử đã chọn?`)) return;

    // Thu thập ID hợp lệ (nếu backend trả về readingProcessId)
    const all = items.map((n) => n.readingProcessId).filter((x): x is string => !!x);
    const toDelete = Array.from(selected).filter((id) => all.includes(id));

    // Nếu backend CHƯA trả về readingProcessId, bạn có thể
    // điều chỉnh payload thành { novelId, chapterId } theo yêu cầu hệ thống của bạn.

    // TODO: Gọi API xóa hàng loạt (khi bạn có API):
    // try {
    //   await DeleteReadingProcesses({ ReadingProcessIds: toDelete });
    //   // hoặc await http.delete("/reading-processes", { data: { ReadingProcessIds: toDelete } });
    //   cancelSelectionMode();
    //   refetch();
    // } catch (e) {
    //   console.error(e);
    //   alert("Xóa thất bại. Vui lòng thử lại.");
    // }

    // TẠM THỜI (chưa có API): giả lập xóa local để bạn xem flow
    // -> loại bỏ các mục đã chọn khỏi danh sách hiển thị bằng cách refetch lại
    // (ở đây chỉ reset UI cho bạn xem trải nghiệm)
    cancelSelectionMode();
    refetch();
  };

  const gridView = useMemo(
    () => (
      <div className="grid gap-x-8 gap-y-8 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {paged.map((n) => {
          const rpid = n.readingProcessId ?? `${n.novelId}-${n.chapterId}`;
          const checked = selected.has(rpid);
          return (
            <div key={`${n.novelId}-${n.chapterId}`} className="relative aspect-[3/4]">
              {/* Checkbox chỉ hiện khi selectionMode = true */}
              {selectionMode && (
                <label
                  className="absolute top-2 left-2 z-10 inline-flex items-center gap-2 px-2 py-1 rounded-md
                             bg-white shadow ring-1 ring-gray-200 cursor-pointer select-none
                             dark:bg-white/10 dark:text-white dark:ring-white/10 backdrop-blur"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(rpid)}
                    className="h-4 w-4 accent-current cursor-pointer"
                  />
                  <span className="text-xs">Chọn</span>
                </label>
              )}

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
          );
        })}

        {isFetching &&
          Array.from({
            length: Math.min(6, Math.max(0, PAGE_LIMIT - paged.length)),
          }).map((_, i) => (
            <div key={`s-${i}`} className="aspect-[3/4]">
              <SkeletonCard />
            </div>
          ))}
      </div>
    ),
    [paged, isFetching, navigate, selectionMode, selected]
  );

  // Lưu/đọc view mode
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

  // Reset page nếu vượt
  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
        {/* Header */}
        <div className="flex top-0 z-20 mb-10">
          <div className="w-full rounded-2xl backdrop-blur-md overflow-hidden
                          bg-white shadow-[0_16px_56px_-28px_rgba(0,0,0,0.18)]
                          dark:bg-transparent dark:ring-white/10 dark:shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)]">
            <div className="relative py-3 px-1 flex items-center justify-between">
              <div className="flex items-center gap-10">
                <button
                  onClick={() => navigate(-1)}
                  className="h-9 w-9 grid place-items-center rounded-lg
                             bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                             dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/[0.12]"
                  title="Quay lại"
                  aria-label="Quay lại"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="flex flex-col">
                  <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
                    Lịch sử đọc
                  </div>
                  <div className="text-xs opacity-70">
                    {selectionMode
                      ? `${selected.size} mục đã chọn`
                      : ``}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Khi đang selection mode: hiện Chọn trang / Hủy / Xóa đã chọn */}
                {selectionMode ? (
                  <>
                    <button
                      onClick={toggleAllOnPage}
                      className="h-9 px-3 inline-flex items-center gap-2 rounded-lg
                                 bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                                 dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/[0.1]"
                      title={isAllOnPageSelected ? "Bỏ chọn trang này" : "Chọn tất cả trang này"}
                      aria-label="Select all current page"
                    >
                      {isAllOnPageSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      <span className="text-sm">
                        {isAllOnPageSelected ? "Bỏ chọn trang" : "Chọn trang"}
                      </span>
                    </button>

                    <button
                      onClick={cancelSelectionMode}
                      className="h-9 px-3 inline-flex items-center gap-2 rounded-lg
                                 bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition
                                 dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/[0.1]"
                      title="Hủy"
                      aria-label="Hủy"
                    >
                      <X size={16} />
                      <span className="text-sm">Hủy</span>
                    </button>

                    <button
                      onClick={handleDeleteSelected}
                      disabled={selected.size === 0}
                      className={[
                        "h-9 px-3 inline-flex items-center gap-2 rounded-lg transition",
                        selected.size === 0
                          ? "cursor-not-allowed opacity-60 bg-gray-100 ring-1 ring-gray-200 dark:bg-white/[0.06] dark:ring-white/10"
                          : "text-red-600 bg-red-50 ring-1 ring-red-200 hover:bg-red-100 dark:text-red-400 dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-red-500/20",
                      ].join(" ")}
                      title="Xóa các mục đã chọn"
                      aria-label="Xóa các mục đã chọn"
                    >
                      <Trash size={16} />
                      <span className="text-sm">Xóa đã chọn</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* View toggle (giữ như cũ) */}
                    <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-white/10">
                      <button
                        onClick={() => setView("Grid")}
                        className={[
                          "h-9 w-9 grid place-items-center transition",
                          view === "Grid"
                            ? "bg-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                          view === "Grid"
                            ? "dark:bg-white/20 dark:text-white dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                            : "dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/[0.1]",
                        ].join(" ")}
                        title="Xem dạng lưới"
                        aria-label="Xem dạng lưới"
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        onClick={() => setView("List")}
                        className={[
                          "h-9 w-9 grid place-items-center border-l border-gray-200 transition dark:border-white/10",
                          view === "List"
                            ? "bg-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                          view === "List"
                            ? "dark:bg-white/20 dark:text-white dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                            : "dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/[0.1]",
                        ].join(" ")}
                        title="Xem dạng danh sách"
                        aria-label="Xem dạng danh sách"
                      >
                        <List size={18} />
                      </button>
                    </div>

                    {/* Nút vào Selection Mode: Xóa lịch sử */}
                    <button
                      onClick={enterSelectionMode}
                      className="h-9 px-3 inline-flex items-center gap-2 rounded-lg
                                 text-red-600 bg-red-50 ring-1 ring-red-200 hover:bg-red-100 transition
                                 dark:text-red-400 dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-red-500/20"
                      title="Xóa lịch sử"
                      aria-label="Xóa lịch sử"
                    >
                      <Trash size={16} />
                      <span className="text-sm">Xóa lịch sử</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
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
            {paged.map((n) => {
              const rpid = n.readingProcessId ?? `${n.novelId}-${n.chapterId}`;
              const checked = selected.has(rpid);
              return (
                <div key={`${n.novelId}-${n.chapterId}`} className="relative">
                  {/* Checkbox chỉ hiện khi selectionMode = true */}
                  {selectionMode && (
                    <label
                      className="absolute top-2 left-2 z-10 inline-flex items-center gap-2 px-2 py-1 rounded-md
                                 bg-white shadow ring-1 ring-gray-200 cursor-pointer select-none
                                 dark:bg-white/10 dark:text-white dark:ring-white/10 backdrop-blur"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(rpid)}
                        className="h-4 w-4 accent-current cursor-pointer"
                      />
                      <span className="text-xs">Chọn</span>
                    </label>
                  )}

                  <NListItem
                    title={n.title}
                    slug={n.slug}
                    author={n.authorName || "Tên tác giả"}
                    image={n.novelImage}
                    rating={Number(n.ratingAvg ?? 0)}
                    bookmarks={Number(n.followers ?? 0)}
                    views={Number(n.totalViews ?? 0)}
                    status={n.status}
                    tags={
                      Array.isArray(n.tags as Tag[])
                        ? (n.tags?.slice(0, 8) as Tag[])
                        : []
                    }
                    onClick={() => navigate(`/novels/${n.slug}/${n.chapterId}`)}
                  />
                </div>
              );
            })}
            {isFetching &&
              Array.from({
                length: Math.min(2, Math.max(0, PAGE_LIMIT - paged.length)),
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
