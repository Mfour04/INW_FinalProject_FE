import React, { useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Typography from "../../../components/TypographyComponent";
import { PANEL, TOKENS } from "../ui/tokens";
import { ORANGE_GRAD } from "../constant";
import type { Novel } from "../../../entity/novel";

export type RecommendCarouselProps = {
  title: string;
  novels: Novel[];
  currentIndex: number;
  visibleCount: number;
  onPrev: () => void;
  onNext: () => void;
  onClickItem: (n: Novel) => void;
};

export const RecommendCarousel = ({
  title,
  novels,
  currentIndex,
  visibleCount,
  onPrev,
  onNext,
  onClickItem,
}: RecommendCarouselProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onPrev, onNext]
  );

  const visible = useMemo(
    () => novels.slice(currentIndex, currentIndex + visibleCount),
    [novels, currentIndex, visibleCount]
  );

  return (
    <section className="mt-10" aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-2 w-2 rounded-full bg-gradient-to-r ${ORANGE_GRAD}`}
          />
          <Typography
            variant="h4"
            size="large"
            className="dark:text-white text-black"
          >
            {title}
          </Typography>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            aria-label="Previous"
            className="rounded-full p-2 ring-1 ring-black dark:ring-white/15 bg-black dark:bg-white/5 hover:bg-white/10 transition"
          >
            ◀
          </button>
          <button
            onClick={onNext}
            aria-label="Next"
            className="rounded-full p-2 ring-1 ring-black dark:ring-white/15 bg-black dark:bg-white/5 hover:bg-white/10 transition"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        className={`${PANEL} relative p-4 overflow-hidden rounded-2xl`}
        onKeyDown={onKey}
        tabIndex={0}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/50 to-transparent" />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 16, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            ref={trackRef}
            className="flex gap-5"
          >
            {visible.map((n) => (
              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={n.novelId}
                onClick={() => onClickItem(n)}
                className={`${TOKENS.poster.h} ${TOKENS.poster.w} ${TOKENS.radius} ${TOKENS.ring} overflow-hidden bg-zinc-800/40 shrink-0 relative group`}
              >
                {n.novelImage ? (
                  <img
                    src={n.novelImage}
                    className="h-full w-full object-cover"
                    alt={n.title}
                  />
                ) : (
                  <div className="h-full w-full animate-pulse bg-white/5" />
                )}

                {/* Bottom gradient + title */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="h-16 rounded-xl bg-gradient-to-t from-black/80 to-black/0" />
                </div>
                <div className="absolute inset-x-3 bottom-3 flex items-end gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight line-clamp-2">
                      {n.title}
                    </p>
                  </div>
                  <span
                    className={`ml-auto inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r ${ORANGE_GRAD} opacity-80 group-hover:opacity-100 transition`}
                  />
                </div>

                <span
                  className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-0 group-focus-visible:ring-2 ring-offset-0 ring-white/40`}
                />
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
export default RecommendCarousel;
