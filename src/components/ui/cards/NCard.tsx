import { useMemo, useState } from "react";
import { Star, Bookmark, Eye } from "lucide-react";
import { fmt, variantFromSeed } from "../../../pages/NovelsExplore/util";

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

export const NCard = ({
  title,
  slug,
  image,
  rating,
  bookmarks,
  views,
  status,
  onClick,
}: Props) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const isCompleted = status === 1;
  const v = useMemo(() => variantFromSeed(slug || title), [slug, title]);

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
      <div className="relative z-0 h-full overflow-hidden rounded-2xl 
                      bg-white ring-1 ring-gray-200 shadow-lg flex flex-col
                      dark:bg-[#0b0d11]/95 dark:ring-white/10">
        <div className="relative h-[225px] overflow-hidden rounded-t-2xl">
          {!imgLoaded && (
            <div className="absolute inset-0 
                            bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse
                            dark:from-white/[0.05] dark:via-white/[0.08] dark:to-white/[0.05]" />
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
            <div className="grid h-full w-full place-items-center text-gray-500 text-xs bg-gray-100 rounded-t-2xl dark:text-white/55 dark:bg-white/[0.04]">
              No cover
            </div>
          )}

          <span
            className={[
              "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5",
              "text-[10.5px] font-semibold backdrop-blur-sm border",
              isCompleted
                ? "bg-emerald-500/75 border-emerald-300 text-white shadow-[0_8px_24px_rgba(16,185,129,0.55)]"
                : "bg-rose-500/75 border-rose-300 text-white shadow-[0_8px_24px_rgba(244,63,94,0.55)]",
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
            <span className="inline-flex items-center gap-1.5 rounded-lg 
                             bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px] ring-1 ring-gray-200 backdrop-blur-md
                             dark:bg-black/55 dark:text-white/90 dark:ring-white/10">
              <Star size={13} className="text-yellow-400" fill="currentColor" />
              {Number.isFinite(rating) ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg 
                             bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px] ring-1 ring-gray-200 backdrop-blur-md
                             dark:bg-black/55 dark:text-white/90 dark:ring-white/10">
              <Bookmark size={13} />
              {fmt(bookmarks)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg 
                             bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px] ring-1 ring-gray-200 backdrop-blur-md
                             dark:bg-black/55 dark:text-white/90 dark:ring-white/10">
              <Eye size={13} />
              {fmt(views)}
            </span>
          </div>
        </div>

        <div className="flex-1 px-3 pb-3 pt-5 flex flex-col">
          <h3
            className="text-[15px] leading-[1.5] font-semibold text-gray-900 dark:text-white overflow-hidden break-words"
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
