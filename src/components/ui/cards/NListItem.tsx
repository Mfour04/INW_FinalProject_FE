import { useMemo, useState } from "react";
import { Star, Bookmark, Eye } from "lucide-react";
import type { Tag } from "../../../pages/NovelsExplore/types";
import { fmt, variantFromSeedRing } from "../../../pages/NovelsExplore/util";

type Props = {
  title: string;
  slug: string;
  image?: string | null;
  rating: number;
  bookmarks: number;
  views: number;
  status: number; 
  tags: Tag[];
  author?: string;
  onClick?: () => void;
};

export const NListItem = ({
  title,
  slug,
  image,
  rating,
  bookmarks,
  views,
  status,
  tags,
  author = "Mock Author",
  onClick,
}: Props) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isCompleted = status === 1;
  const v = useMemo(() => variantFromSeedRing(slug || title), [slug, title]);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      title={title}
      className="group relative cursor-pointer select-none rounded-2xl"
    >
      {/* glow ring */}
      <div
        className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${v.ring} opacity-30 blur-[8px] group-hover:opacity-60 transition`}
      />

      <div className="relative z-0 h-[150px] overflow-hidden rounded-2xl 
                      bg-white ring-1 ring-gray-200 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.18)] p-3 flex gap-3
                      dark:bg-[#0b0d11]/90 dark:ring-white/10 dark:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.75)]">
        {/* thumbnail */}
        <div className="relative w-[95px] aspect-[3/4] rounded-xl overflow-hidden shrink-0">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse 
                            bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                            dark:from-white/[0.06] dark:via-white/[0.09] dark:to-white/[0.06]" />
          )}
          {image ? (
            <img
              src={image}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs 
                            text-gray-500 bg-gray-100
                            dark:text-white/60 dark:bg-white/6">
              No cover
            </div>
          )}
        </div>

        {/* right content */}
        <div className="relative flex-1 min-w-0 grid grid-cols-[1fr_auto] grid-rows-[auto_auto_1fr] gap-x-3 gap-y-2">
          <div className="min-w-0 col-start-1 row-start-1">
            <h2
              className="text-[15px] font-semibold text-gray-900 leading-[1.3] min-h-[2.6em] overflow-hidden break-words
                         dark:text-white"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </h2>

            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[12.5px] text-gray-500 dark:text-white/55">Người đăng:</span>
              <span className="text-[12.5px] font-medium text-gray-900 truncate
                               dark:text-orange-300">
                {author}
              </span>
            </div>
          </div>

          {/* status pill */}
          <div className="col-start-2 row-start-1 self-start">
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                "text-[10.5px] font-semibold backdrop-blur-sm border text-white",
                isCompleted
                  ? "bg-emerald-500/75 border-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.55)]"
                  : "bg-rose-500/75 border-rose-300 shadow-[0_8px_24px_rgba(244,63,94,0.55)]",
              ].join(" ")}
            >
              <span
                className={["h-1 w-1 rounded-full", isCompleted ? "bg-emerald-100" : "bg-rose-100"].join(" ")}
              />
              {isCompleted ? "Hoàn thành" : "Đang diễn ra"}
            </span>
          </div>

          {/* tags */}
          {tags?.length > 0 && (
            <div className="col-span-2 row-start-2 w-full">
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 8).map((tg) => (
                  <span
                    key={tg.tagId}
                    className="rounded-full px-2 py-[1px] text-[10.5px]
                               text-gray-700 border border-gray-200 bg-gray-100 hover:bg-gray-200 transition
                               dark:text-white/80 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
                  >
                    {tg.name ?? String(tg.tagId)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* stats */}
          <div className="col-span-2 row-start-3 self-end">
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-gray-900 dark:text-white/90">
              <span className="inline-flex items-center gap-1">
                <Star size={16} className="text-yellow-400" fill="currentColor" />
                {Number.isFinite(rating) ? rating.toFixed(1) : "0.0"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Bookmark size={15} />
                {fmt(bookmarks)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={15} />
                {fmt(views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NListItem;
