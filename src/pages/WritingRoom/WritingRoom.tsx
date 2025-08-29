import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { useToast } from "../../context/ToastContext/toast-context";

import { DeleteNovel, GetAuthorNovels } from "../../api/Novels/novel.api";
import { Plus, BookOpenCheck, Eye, Users } from "lucide-react";

import type { SortKey, StatusFilter } from "./types";
import { ControlsBar } from "./components/ControlsBar";
import { StatsMini } from "./components/StatsMini";
import { NovelRowCard } from "./components/NovelRowCard";
import type { Novel } from "../../entity/novel";

export const WritingRoom = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [novelIdToDelete, setNovelIdToDelete] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("updated");

  const { data, isLoading } = useQuery({
    queryKey: ["authorNovels"],
    queryFn: () => GetAuthorNovels().then((res) => res.data.data),
  });

  const novels: Novel[] = data?.novels ?? [];

  const deleteNovelMutation = useMutation({
    mutationFn: (id: string) => DeleteNovel(id),
    onSuccess: () => {
      toast?.onOpen("Xóa truyện thành công!");
      queryClient.invalidateQueries({ queryKey: ["authorNovels"] });
    },
  });

  const filtered = useMemo(() => {
    let list = [...novels];

    const q = query.trim().toLowerCase();
    if (q) list = list.filter((n) => n.title.toLowerCase().includes(q));

    if (status !== "all") {
      list = list.filter((n) =>
        status === "finished" ? n.status === 0 : n.status !== 0
      );
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.totalViews ?? 0) - (a.totalViews ?? 0);
        case "followers":
          return (b.followers ?? 0) - (a.followers ?? 0);
        case "title":
          return a.title.localeCompare(b.title, "vi");
        case "updated":
        default:
          return (b.createAt ?? 0) - (a.createAt ?? 0);
      }
    });

    return list;
  }, [novels, query, status, sortBy]);

  const stats = useMemo(() => {
    const total = novels.length;
    const views = novels.reduce((s, n) => s + (n.totalViews || 0), 0);
    const followers = novels.reduce((s, n) => s + (n.followers || 0), 0);
    return { total, views, followers };
  }, [novels]);

  const askDelete = (id: string) => {
    setNovelIdToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (novelIdToDelete) deleteNovelMutation.mutate(novelIdToDelete);
    setConfirmOpen(false);
    setNovelIdToDelete(null);
  };

  const goCreate = () => navigate("upsert-novel");
  const goEdit = (idOrSlug: string) => navigate(`upsert-novel/${idOrSlug}`);
  const goChapters = (novelId: string) => navigate(`${novelId}`);

  return (
    <div
      className="min-h-screen px-3 sm:px-4 md:px-6 py-4 bg-white text-zinc-900 dark:bg-[#0a0b0e] dark:text-white
                 pb-24 sm:pb-8"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 6rem)" }} // chừa chỗ cho bottom bar trên mobile
    >
      {/* Background overlay (light/dark) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 opacity-60 dark:opacity-0 transition-opacity"
          style={{
            background:
              "radial-gradient(900px 500px at 85% -10%, rgba(255,103,64,0.10), transparent 60%), radial-gradient(800px 500px at -10% 20%, rgba(120,170,255,0.10), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-0 dark:opacity-50 transition-opacity"
          style={{
            background:
              "radial-gradient(900px 500px at 85% -10%, rgba(255,103,64,0.16), transparent 60%), radial-gradient(800px 500px at -10% 20%, rgba(120,170,255,0.12), transparent 60%)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="max-w-screen-2xl mx-auto px-2 sm:px-4 pt-4 sm:pt-8 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-[18px] sm:text-[22px] md:text-[26px] font-bold tracking-tight truncate">
              Phòng sáng tác
            </h1>
            <p className="mt-0.5 sm:mt-1 text-zinc-600 dark:text-white/70 text-[13px] sm:text-[13.5px]">
              Hôm nay viết gì?
            </p>
          </div>

          {/* Mobile: full width, Desktop: tự nhiên */}
          <button
            onClick={goCreate}
            className="inline-flex items-center justify-center gap-2 h-10 rounded-xl px-4 text-sm font-semibold text-white shadow-sm shadow-black/10
                       bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]
                       hover:brightness-110 active:brightness-95 transition
                       w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tạo truyện mới
          </button>
        </div>
      </header>

      <section className="max-w-screen-2xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="lg:col-span-2">
            <ControlsBar
              query={query}
              setQuery={setQuery}
              status={status}
              setStatus={setStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

         <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatsMini size="compact" label="Truyện" value={stats.total} />
            <StatsMini
              size="compact"
              label="Lượt xem"
              value={stats.views}
              icon={<Eye className="h-4 w-4" />}
            />
            <StatsMini
              size="compact"
              label="Theo dõi"
              value={stats.followers}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        </div>
      </section>

      <main className="max-w-screen-2xl mx-auto px-2 sm:px-4 pt-6 sm:pt-8">
        {!isLoading && filtered.length === 0 && (
          <div
            className={[
              "rounded-2xl p-6 sm:p-8 text-center",
              "bg-white ring-1 ring-zinc-200 shadow-sm",
              "dark:bg-white/[0.02] dark:ring-1 dark:ring-white/10 dark:shadow-none dark:backdrop-blur-md",
            ].join(" ")}
          >
            <BookOpenCheck className="h-9 w-9 sm:h-10 sm:w-10 mx-auto text-zinc-400 dark:text-white/60" />
            <p className="mt-3 text-[14px] sm:text-[15px] text-zinc-700 dark:text-white/80">
              Không tìm thấy truyện phù hợp.
            </p>
            <p className="text-[12.5px] sm:text-[13px] text-zinc-500 dark:text-white/50">
              Hãy thử từ khóa khác, thay đổi bộ lọc hoặc tạo truyện mới.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={[
                  "h-[110px] sm:h-[130px] rounded-2xl animate-pulse",
                  "bg-zinc-100 ring-1 ring-zinc-200",
                  "dark:bg-white/[0.03] dark:ring-1 dark:ring-white/10",
                ].join(" ")}
              />
            ))}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map((n) => (
              <NovelRowCard
                key={n.novelId}
                novel={n}
                onEdit={() => goEdit(n.slug || n.novelId)}
                onChapters={() => goChapters(n.novelId)}
                onDelete={() => askDelete(n.novelId)}
              />
            ))}
          </div>
        )}

        {/* Pager phía dưới vẫn giữ khoảng trống để không bị bar dưới đè */}
        <div className="mt-8 mb-4 sm:mb-0" />
      </main>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Xóa truyện"
        message={
          "Bạn có chắc chắn muốn xóa truyện này không?\nThao tác này không thể hoàn tác."
        }
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default WritingRoom;
