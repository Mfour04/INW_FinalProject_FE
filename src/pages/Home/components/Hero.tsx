import { useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "../../../components/TypographyComponent";
import ArrowLeftIcon from "../../../assets/svg/HomePage/arrow-left-01-stroke-rounded.svg";
import ArrowRightIcon from "../../../assets/svg/HomePage/arrow-right-01-stroke-rounded.svg";
import StarRate from "@mui/icons-material/StarRate";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import PencilEdit from "../../../assets/svg/HomePage/pencil-edit-01-stroke-rounded.svg";
import type { Novel } from "../../../entity/novel";

export type HeroProps = {
  title: string;
  hero?: Novel;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onRead?: () => void;
  fadeDescription?: boolean;
};

export const Hero = ({
  title,
  hero,
  index,
  onPrev,
  onNext,
  onRead,
  fadeDescription = false,
}: HeroProps) => {
  const bgUrl = useMemo(
    () => hero?.novelBanner ?? hero?.novelImage ?? "",
    [hero?.novelBanner, hero?.novelImage]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onPrev, onNext, onRead]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!hero) return null;

  const handleDragEnd = (
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const { x: dx } = info.offset;
    const { x: vx } = info.velocity;
    const distanceThreshold = 80;
    const velocityThreshold = 500;
    if (dx > distanceThreshold || vx > velocityThreshold) onPrev();
    else if (dx < -distanceThreshold || vx < -velocityThreshold) onNext();
  };

  return (
    <section aria-label={title} className="relative min-w-0">
      <motion.div
        className="relative h-[42vh] min-h-[360px] w-full overflow-hidden rounded-2xl sm:rounded-3xl sm:h-[50vh] sm:min-h-[420px] lg:h-[58vh] lg:min-h-[460px]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        <div
          aria-hidden
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/45 to-black/85" />

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 hidden items-center justify-between px-4 md:flex">
          <button
            onClick={onPrev}
            aria-label="Previous"
            className="pointer-events-auto rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-md shadow-lg transition hover:bg-white/15 active:scale-95"
          >
            <img src={ArrowLeftIcon} alt="left" className="h-6 w-6" />
          </button>
          <button
            onClick={onNext}
            aria-label="Next"
            className="pointer-events-auto rounded-full bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-md shadow-lg transition hover:bg-white/15 active:scale-95"
          >
            <img src={ArrowRightIcon} alt="right" className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute right-3 top-3 z-[15] select-none sm:right-4 sm:top-4 md:right-[4.25rem]">
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] tracking-wider text-white/90 ring-1 ring-white/20 backdrop-blur-md sm:text-xs">
            NO.{index + 1 || 1}
          </span>
        </div>

        <div className="absolute bottom-3 left-1/2 z-[15] -translate-x-1/2 select-none md:hidden">
          <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] text-white/90 ring-1 ring-white/15 backdrop-blur-md">
            Vuốt để xem tiếp
          </span>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-4">
          <AnimatePresence mode="popLayout">
            {hero && (
              <motion.div
                key={hero.novelId}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="min-w-0"
              >
                <div className="group h-auto max-w-[92vw] overflow-hidden rounded-2xl bg-black/40 p-4 ring-1 ring-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.45)] sm:max-w-3xl sm:rounded-3xl sm:p-6">
                  <div className="min-w-0">
                    <Typography
                      variant="h4"
                      size="small"
                      className="mb-1 text-white/95"
                    >
                      {title}
                    </Typography>
                    <div className="inline-block max-w-full align-top">
                      <h2 className="mb-1 truncate text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
                        {hero?.title ?? "Không có dữ liệu"}
                      </h2>
                      <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] opacity-80" />
                    </div>
                    {hero?.tags?.length ? (
                      <div className="my-2 flex flex-wrap gap-1.5 sm:gap-2">
                        {hero.tags.slice(0, 6).map((t) => (
                          <span
                            key={t.tagId}
                            className="select-none rounded-full bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-orange-200/40 shadow-[0_10px_24px_rgba(255,103,64,0.45)] sm:text-sm"
                          >
                            {t.name ?? ""}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="relative">
                      <p className="line-clamp-3 text-[13px] leading-relaxed opacity-90 sm:text-[15px]">
                        {hero?.description ?? ""}
                      </p>
                      {fadeDescription && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/10 to-transparent transition-all duration-[1000ms] ease-out" />
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col-reverse items-stretch gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-white/7 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur-md">
                        <RemoveRedEye sx={{ height: 18, width: 18 }} />
                        <span className="text-sm tabular-nums">
                          {hero?.totalViews ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-white/7 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur-md">
                        <StarRate sx={{ height: 18, width: 18 }} />
                        <span className="text-sm tabular-nums">
                          {hero?.ratingCount ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-white/7 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur-md">
                        <img className="h-4" src={PencilEdit} alt="edit" />
                        <span className="text-sm tabular-nums">
                          {(hero as any)?.chapterCount ?? "—"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRead?.();
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,103,64,0.45)] transition-colors hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff784f]/60"
                    >
                      Đọc ngay
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
