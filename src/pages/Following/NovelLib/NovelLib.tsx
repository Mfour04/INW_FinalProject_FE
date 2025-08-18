import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LayoutGrid, List, BookOpenCheck, Clock, CheckCheck, ChevronDown } from "lucide-react";

import { GetFollowerNovels } from "../../../api/NovelFollow/novel-follow.api";
import { NListItem } from "../../../components/ui/cards/NListItem";
import { NCard } from "../../../components/ui/cards/NCard";
import { Pager } from "../../../components/ui/navigation/Pager";

type ViewAction = "Grid" | "List";
type FilterKey = "reading" | "wishlist" | "done";

type NovelLite = {
  novelId: string;
  slug: string;
  title: string;
  novelImage?: string | null;
  ratingAvg?: number;
  followers?: number;
  totalViews?: number;
  status: number;
  tags?: Array<{ tagId: string | number; name?: string }>;
  authorName?: string | null;
};

const FILTER_LABEL: Record<FilterKey, string> = {
  reading: "Đang đọc",
  wishlist: "Sẽ đọc",
  done: "Hoàn thành",
};

const FILTER_ICON: Record<FilterKey, React.ReactNode> = {
  reading: <BookOpenCheck size={16} />,
  wishlist: <Clock size={16} />,    
  done: <CheckCheck size={16} />,
};

function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

function FilterMenu({
  value,
  onChange,
}: {
  value: FilterKey;
  onChange: (v: FilterKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="group h-9 pl-3 pr-2 rounded-lg bg-white/[0.06] text-white ring-1 ring-white/10 hover:bg-white/[0.1] focus:outline-none inline-flex items-center gap-2 transition"
      >
        {FILTER_ICON[value]}
        <span className="text-sm">{FILTER_LABEL[value]}</span>
        <ChevronDown size={16} className="opacity-80 transition" />
      </button>

      {open && (
          <div
            className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md z-50"
            role="menu"
          >
          {(["reading", "wishlist", "done"] as FilterKey[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                onChange(k);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-white/[0.06] transition"
            >
              {FILTER_ICON[k]}
              <span>{FILTER_LABEL[k]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const NovelLib = () => {
  const [actionState, setActionState] = useState<ViewAction>("Grid");
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<FilterKey>("reading");
  const limit = 12;

  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["follower-novels", { page, limit, filter }],
    queryFn: () =>
      GetFollowerNovels({
        limit,
        page,
      }).then((res) => res.data.data),
    staleTime: 30_000,
  });

  const { novels, totalPages } = useMemo(() => {
    const list: NovelLite[] = Array.isArray(data?.novelFollows?.followedNovels)
      ? data.novelFollows.followedNovels.map((n: any) => ({
          novelId: String(n.novelId),
          slug: n.slug,
          title: n.title,
          novelImage: n.novelImage ?? null,
          ratingAvg: Number(n.ratingAvg ?? 0),
          followers: Number(n.followers ?? 0),
          totalViews: Number(n.totalViews ?? 0),
          status: Number(n.status ?? 0),
          tags: Array.isArray(n.tags) ? n.tags : [],
          authorName: n.authorName ?? null,
        }))
      : [];
    return {
      novels: list,
      totalPages: Number(data?.totalPages ?? 1),
    };
  }, [data]);

  const gridView = useMemo(
    () => (
      <div className="grid gap-x-8 gap-y-8 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {novels.map((novel) => (
          <div key={novel.novelId} className="aspect-[3/4]">
            <NCard
              title={novel.title}
              slug={novel.slug}
              image={novel.novelImage}
              rating={novel.ratingAvg ?? 0}
              bookmarks={novel.followers ?? 0}
              views={novel.totalViews ?? 0}
              status={novel.status}
              onClick={() => navigate(`/novels/${novel.slug}`)}
            />
          </div>
        ))}
        {isFetching &&
          Array.from({ length: Math.min(6, Math.max(0, limit - novels.length)) }).map(
            (_, i) => (
              <div key={`s-${i}`} className="aspect-[3/4]">
                <div className="w-full h-full rounded-xl bg-white/5 animate-pulse" />
              </div>
            )
          )}
      </div>
    ),
    [novels, isFetching, navigate]
  );

  const listView = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {novels.map((n) => (
          <NListItem
            key={n.novelId}
            title={n.title}
            slug={n.slug}
            author={n.authorName || "Tên tác giả"}
            image={n.novelImage}
            rating={n.ratingAvg ?? 0}
            bookmarks={n.followers ?? 0}
            views={n.totalViews ?? 0}
            status={n.status}
            tags={Array.isArray(n.tags) ? n.tags.slice(0, 8) : []}
            onClick={() => navigate(`/novels/${n.slug}`)}
          />
        ))}
        {isFetching &&
          Array.from({ length: Math.min(2, Math.max(0, limit - novels.length)) }).map(
            (_, i) => <div key={`sk-${i}`} className="h-[150px] rounded-xl bg-white/5 animate-pulse" />
          )}
      </div>
    ),
    [novels, isFetching, navigate]
  );

  const isEmpty = !isFetching && novels.length === 0;

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 py-4 bg-[#0b0d11] text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
        <div className="mb-8">
          <div className="w-full rounded-2xl backdrop-blur-md shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)] overflow-visible">
            <div className="relative py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-10">
                  <button
                    onClick={() => navigate(-1)}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.12] transition"
                    title="Quay lại"
                    aria-label="Quay lại"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-[18px] md:text-[20px] font-semibold leading-tight">
                    Thư viện của tôi
                  </h1>
                </div>

                <div className="flex items-center gap-5">
                  <FilterMenu value={filter} onChange={(v) => setFilter(v)} />

                  <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-white/10">
                    <button
                      onClick={() => setActionState("Grid")}
                      className={[
                        "h-9 w-9 grid place-items-center",
                        actionState === "Grid"
                          ? "bg-white/15 text-white"
                          : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1]",
                      ].join(" ")}
                      title="Xem dạng lưới"
                      aria-label="Xem dạng lưới"
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button
                      onClick={() => setActionState("List")}
                      className={[
                        "h-9 w-9 grid place-items-center border-l border-white/10",
                        actionState === "List"
                          ? "bg-white/15 text-white"
                          : "bg-white/[0.06] text-white/80 hover:bg-white/[0.1]",
                      ].join(" ")}
                      title="Xem dạng danh sách"
                      aria-label="Xem dạng danh sách"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="py-20 text-center text-white/80">
            <div className="mx-auto max-w-sm">
              <div className="mb-4 h-20 w-20 mx-auto rounded-2xl bg-[linear-gradient(135deg,#ff7a18_0%,#af002d_100%)] opacity-70" />
              <div className="text-lg font-medium mb-1">Chưa có truyện</div>
              <div className="text-sm text-white/60">
                Hãy theo dõi vài truyện để xuất hiện ở đây — hoặc đổi bộ lọc.
              </div>
            </div>
          </div>
        ) : actionState === "Grid" ? (
          <div className="mb-10">{gridView}</div>
        ) : (
          <div className="mb-10">{listView}</div>
        )}

        {!isEmpty && totalPages > 1 && (
          <Pager
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
        )}
      </div>
    </div>
  );
};
