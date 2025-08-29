import React, { useRef } from "react";
import { SeeMoreGradientBtn } from "./SeeMoreGradientBtn";
import type { Novel } from "../../../entity/novel";

type HorizontalRailProps = {
  title: string;
  icon?: React.ReactNode;
  items: Novel[];
  onClickItem: (n: Novel) => void;
  onSeeMore?: () => void;
  seeMoreLabel?: string;
  scrollStep?: number;
  /** Mobile fallback → dùng list dọc (tránh X-scroll) */
  verticalOnMobile?: boolean;
};

export const HorizontalRail = ({
  title,
  icon,
  items,
  onClickItem,
  onSeeMore,
  seeMoreLabel = "Xem thêm",
  scrollStep = 320,
  verticalOnMobile = true,
}: HorizontalRailProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) =>
    trackRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  const eat = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section className="relative w-full min-w-0 px-2 sm:px-0">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {icon ? (
            <span className="inline-grid h-6 w-6 place-items-center [&>svg]:h-6 [&>svg]:w-6">
              {icon}
            </span>
          ) : null}
          <h3 className="truncate text-xl font-bold leading-none text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
        </div>
        {onSeeMore && (
          <SeeMoreGradientBtn label={seeMoreLabel} onClick={onSeeMore} />
        )}
      </div>

      {/* Mobile dọc (tránh X-scroll) */}
      {verticalOnMobile && (
        <div className="block sm:hidden">
          <div className="grid grid-cols-1 gap-3">
            {items.map((n) => (
              <button
                key={n.novelId}
                onClick={() => onClickItem(n)}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-2.5 text-left shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-[#1b1c20] dark:hover:bg-[#24262a]"
              >
                <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-white/10">
                  {n.novelImage ? (
                    <img
                      src={n.novelImage}
                      alt={n.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-zinc-200/50 dark:bg-zinc-800/50" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-zinc-800 dark:text-zinc-100">
                    {n.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rail ngang (>= sm) */}
      <div className={verticalOnMobile ? "hidden sm:block" : "block"}>
        <div className="relative overflow-hidden rounded-2xl">
          {/* Prev */}
          <button
            type="button"
            aria-label="Cuộn trái"
            onMouseDown={eat}
            onPointerDownCapture={eat}
            onClick={(e) => {
              eat(e);
              scrollBy(-scrollStep);
            }}
            className={[
              "hidden sm:flex absolute left-0 inset-y-0 w-12 z-20",
              "items-center justify-center cursor-pointer select-none",
              "bg-black/25 hover:bg-black/35 text-white backdrop-blur-sm",
              "ring-1 ring-white/10",
              "opacity-0 hover:opacity-100 transition-opacity",
            ].join(" ")}
          >
            <svg viewBox="0 0 20 20" className="h-6 w-6" aria-hidden>
              <path
                d="M12.5 4.5L7.5 10l5 5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Next */}
          <button
            type="button"
            aria-label="Cuộn phải"
            onMouseDown={eat}
            onPointerDownCapture={eat}
            onClick={(e) => {
              eat(e);
              scrollBy(scrollStep);
            }}
            className={[
              "hidden sm:flex absolute right-0 inset-y-0 w-12 z-20",
              "items-center justify-center cursor-pointer select-none",
              "bg-black/25 hover:bg-black/35 text-white backdrop-blur-sm",
              "ring-1 ring-white/10",
              "opacity-0 hover:opacity-100 transition-opacity",
            ].join(" ")}
          >
            <svg viewBox="0 0 20 20" className="h-6 w-6" aria-hidden>
              <path
                d="M7.5 4.5L12.5 10l-5 5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Track */}
          <div
            ref={trackRef}
            className="no-scrollbar relative flex gap-4 overflow-x-auto px-12 pb-2 scroll-px-4 snap-x snap-mandatory
                       [-ms-overflow-style:none] [scrollbar-width:none] min-w-0"
          >
            {/* Ẩn scrollbar cục bộ cho webkit */}
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

            {items.map((n) => (
              <button
                key={n.novelId}
                onClick={() => onClickItem(n)}
                className="snap-start w-[150px] sm:w-[168px] shrink-0 text-left"
              >
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-xl
                             border border-zinc-200/70 bg-white shadow-sm
                             transition-transform duration-300 hover:-translate-y-[2px] hover:shadow-md
                             dark:bg-zinc-950 dark:border-white/10"
                >
                  {n.novelImage ? (
                    <img
                      src={n.novelImage}
                      alt={n.title}
                      className="h-full w-full object-cover pointer-events-none"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-zinc-200/50 dark:bg-zinc-800/50" />
                  )}
                </div>

                <div className="mt-2 h-[2.6em] text-[13px] font-semibold leading-snug text-zinc-700 dark:text-zinc-200 line-clamp-2">
                  {n.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalRail;
