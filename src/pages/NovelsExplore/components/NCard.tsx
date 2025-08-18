import React, { useMemo, useState } from "react";
import { Star, Bookmark, Eye } from "lucide-react";

export type Tag = { tagId: string | number; name: string; slug?: string };

type Props = {
  title: string;
  slug: string;
  image?: string | null;
  rating: number;
  bookmarks: number;
  views: number;
  status: number; 
  onClick?: () => void;
};

function variantFromSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const i = Math.abs(h) % 6;
  const ring = [
    "from-[#6ee7ff] via-[#3b82f6] to-[#0ea5e9]",
    "from-[#f472b6] via-[#a855f7] to-[#6366f1]",
    "from-[#f59e0b] via-[#f97316] to-[#ef4444]",
    "from-[#34d399] via-[#22c55e] to-[#16a34a]",
    "from-[#a3e635] via-[#22d3ee] to-[#60a5fa]",
    "from-[#fde68a] via-[#fca5a5] to-[#c4b5fd]",
  ][i];
  const chip = ["#7dd3fc", "#c4b5fd", "#fbbf24", "#86efac", "#93c5fd", "#fca5a5"][i];
  return { ring, chip };
}

const fmt = (n: number) => Intl.NumberFormat("en", { notation: "compact" }).format(n);

export const NCard: React.FC<Props> = ({
  title,
  slug,
  image,
  rating,
  bookmarks,
  views,
  status,
  onClick,
}) => {
  const v = useMemo(() => variantFromSeed(slug || title), [slug, title]);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isCompleted = status === 1;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer select-none h-[320px] w-full"
      title={title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
    >
      <div
        className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${v.ring} opacity-40 blur-[8px] group-hover:opacity-70 transition`}
      />
      <div className="relative z-0 h-full overflow-hidden rounded-2xl bg-[#0b0d11]/95 ring-1 ring-white/10 shadow-lg flex flex-col">
        <div className="relative h-[225px] overflow-hidden rounded-t-2xl">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.05] animate-pulse" />
          )}
          {image ? (
            <img
              src={image}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] rounded-t-2xl"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-white/55 text-xs bg-white/[0.04] rounded-t-2xl">
              No cover
            </div>
          )}

          <span
            className={[
              "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5",
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

          <div className="absolute left-2 right-2 bottom-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2 py-0.5 text-[11px] ring-1 ring-white/10 backdrop-blur-md">
              <Star size={13} className="text-yellow-400" fill="currentColor" />
              {Number.isFinite(rating) ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2 py-0.5 text-[11px] ring-1 ring-white/10 backdrop-blur-md">
              <Bookmark size={13} className="text-white/90" />
              {fmt(bookmarks)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2 py-0.5 text-[11px] ring-1 ring-white/10 backdrop-blur-md">
              <Eye size={13} className="text-white/90" />
              {fmt(views)}
            </span>
          </div>
        </div>

        <div className="flex-1 px-3 pb-3 pt-5 flex flex-col">
          <h3
            className="text-[15px] leading-[1.5] font-semibold text-white overflow-hidden break-words"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            title={title}
          >
            {title}
          </h3>
          <div className="mt-1 flex-1" />
        </div>
      </div>
    </div>
  );
};

export default NCard;
