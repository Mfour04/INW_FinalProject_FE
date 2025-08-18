import { useMemo, useState } from "react";
import StarRate from "@mui/icons-material/StarRate";
import Bookmark from "@mui/icons-material/Bookmark";
import Visibility from "@mui/icons-material/Visibility";
import type { Tag } from "../types";
import { fmt, variantFromSeedRing } from "../util";

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
      <div
        className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${v.ring} opacity-30 blur-[8px] group-hover:opacity-60 transition`}
      />
      <div className="relative z-0 h-[150px] overflow-hidden rounded-2xl bg-[#0b0d11]/90 ring-1 ring-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.75)] p-3 flex gap-3">
        <div className="relative w-[95px] aspect-[3/4] rounded-xl overflow-hidden shrink-0">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/[0.06] via-white/[0.09] to-white/[0.06]" />
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
            <div className="absolute inset-0 grid place-items-center text-xs text-white/60 bg-white/6">
              No cover
            </div>
          )}
        </div>

        <div className="relative flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-3">
          <div className="min-w-0 flex flex-col justify-between">
            <div className="min-w-0">
              <h2
                className="text-[15px] font-semibold text-white overflow-hidden break-words min-h-[2.6em] leading-[1.3]"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {title}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 min-h-[1.25em]">
                <span className="text-[12.5px] text-white/55">Người đăng:</span>
                <span className="text-[12.5px] font-medium text-orange-300 truncate">
                  {author}
                </span>
              </div>

              {tags?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tg) => (
                    <span
                      key={tg.tagId}
                      className="rounded-full px-2 py-[1px] text-[10.5px] text-white/80 border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition"
                    >
                      {tg.name ?? String(tg.tagId)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-white/90">
              <span className="inline-flex items-center gap-1">
                <StarRate sx={{ width: 16, height: 16, color: "#fbbf24" }} />
                {Number.isFinite(rating) ? rating.toFixed(1) : "0.0"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Bookmark sx={{ width: 15, height: 15 }} />
                {fmt(bookmarks)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Visibility sx={{ width: 15, height: 15 }} />
                {fmt(views)}
              </span>
            </div>
          </div>

          <div className="col-start-2 row-start-1">
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
                className={[
                  "h-1 w-1 rounded-full",
                  isCompleted ? "bg-emerald-100" : "bg-rose-100",
                ].join(" ")}
              />
              {isCompleted ? "Hoàn thành" : "Đang diễn ra"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NListItem;
