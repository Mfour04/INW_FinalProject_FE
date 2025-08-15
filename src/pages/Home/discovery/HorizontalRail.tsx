import React, { useRef } from "react";
import type { Novel } from "../types";
import { SeeMoreGradientBtn } from "./SeeMoreGradientBtn";

type HorizontalRailProps = {
  title: string;
  icon?: React.ReactNode;
  items: Novel[];
  onClickItem: (n: Novel) => void;
  onSeeMore?: () => void;
  seeMoreLabel?: string;
  scrollStep?: number;
};

export const HorizontalRail = ({
  title,
  icon,
  items,
  onClickItem,
  onSeeMore,
  seeMoreLabel = "Xem thêm",
  scrollStep = 320,
}: HorizontalRailProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) =>
    trackRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  const eat = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section className="relative md:col-span-2">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="inline-grid h-6 w-6 place-items-center [&>svg]:h-6 [&>svg]:w-6">
              {icon}
            </span>
          ) : null}
          <h3 className="text-xl font-bold leading-none">{title}</h3>
        </div>
        {onSeeMore && (
          <SeeMoreGradientBtn label={seeMoreLabel} onClick={onSeeMore} />
        )}
      </div>

      {/* Wrapper: overflow-hidden để không lộ ảnh dưới paddle */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Paddle trái – chỉ hiện khi hover vào chính nó */}
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

        {/* Paddle phải – chỉ hiện khi hover vào chính nó */}
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

        {/* Track: chừa gutter 2 bên đúng bằng bề rộng paddle để item không chui dưới */}
        <div
          ref={trackRef}
          className="relative flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 px-12
                     [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          <style>{`div::-webkit-scrollbar{display:none}`}</style>

          {items.map((n) => (
            <button
              key={n.novelId}
              onClick={() => onClickItem(n)}
              className="snap-start w-[150px] sm:w-[168px] shrink-0 text-left"
            >
              {/* Ảnh: fixed-size, tỉ lệ 3/4 */}
              <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl
                           border border-zinc-200/70 bg-white shadow-sm
                           hover:shadow-md transition-transform duration-300 hover:-translate-y-[2px]
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

              {/* Tiêu đề: đậm, cố định 2 dòng để đồng chiều cao */}
              <div className="mt-2 text-[13px] font-semibold leading-snug line-clamp-2 h-[2.6em]">
                {n.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalRail;
