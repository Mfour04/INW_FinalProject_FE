import React, { useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "../../../components/TypographyComponent";
import type { Novel } from "../types";
import ArrowLeftIcon from "../../../assets/svg/HomePage/arrow-left-01-stroke-rounded.svg";
import ArrowRightIcon from "../../../assets/svg/HomePage/arrow-right-01-stroke-rounded.svg";
import StarRate from "@mui/icons-material/StarRate";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import PencilEdit from "../../../assets/svg/HomePage/pencil-edit-01-stroke-rounded.svg";

export const Hero: React.FC<{
  title: string;
  hero?: Novel;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onRead?: () => void;
  fadeDescription?: boolean;
}> = ({ title, hero, index, onPrev, onNext, onRead, fadeDescription = false }) => {
  const bgUrl = useMemo(() => hero?.novelImage || "", [hero?.novelImage]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Enter") onRead?.();
    },
    [onPrev, onNext, onRead]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <section aria-label={title} className="relative">
      <div className="relative h-[58vh] min-h-[460px] w-full overflow-hidden rounded-3xl">
        <div
          aria-hidden
          className="absolute inset-0 bg-center bg-cover scale-105"
          style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/85" />

       <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-6 z-10 pointer-events-none">
         <button
            onClick={onPrev}
            aria-label="Previous"
            className="pointer-events-auto rounded-full backdrop-blur-md bg-white/10 hover:bg-white/15 p-2 sm:p-3 ring-1 ring-white/20 transition active:scale-95 shadow-lg"
          >
            <img src={ArrowLeftIcon} alt="left" />
          </button>

          <button
            onClick={onNext}
            aria-label="Next"
            className="pointer-events-auto rounded-full backdrop-blur-md bg-white/10 hover:bg-white/15 p-2 sm:p-3 ring-1 ring-white/20 transition active:scale-95 shadow-lg"
          >
            <img src={ArrowRightIcon} alt="right" />
          </button>

        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 select-none z-[5]">
          <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs tracking-wider ring-1 ring-white/20 text-white/90">
            NO.{(index + 1) || 1}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={hero?.novelId || "empty"}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="z-20"
            >
              <div className="group cursor-default pointer-events-none w-[90vw] max-w-3xl h-[300px] flex flex-col justify-between rounded-3xl bg-black/40 backdrop-blur-xl ring-1 ring-white/15 p-6 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.45)]">
                <div>
                  <Typography variant="h4" size="small" className="mb-1.5 text-white/95">
                    {title}
                  </Typography>
                  <div className="inline-block max-w-full align-top">
                    <h2 className="truncate whitespace-nowrap overflow-hidden text-ellipsis text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                      {hero?.title ?? "Không có dữ liệu"}
                    </h2>
                    <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] opacity-80" />
                  </div>
                  <div className="flex flex-wrap gap-2 my-3">
                    {hero?.tags?.map((t) => (
                      <span
                        key={t.tagId}
                        className="relative inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-sm text-white font-semibold select-none border-none !bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177] shadow-[0_10px_24px_rgba(255,103,64,0.45)] hover:shadow-[0_14px_32px_rgba(255,103,64,0.60)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff784f]/60 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300"
                      >
                        {t.name ?? ""}
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <p className="opacity-90 leading-relaxed line-clamp-3">
                      {hero?.description ?? ""}
                    </p>
                    {fadeDescription && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14
                                      bg-gradient-to-t from-black/5 to-transparent
                                      transition-all duration-[1000ms] ease-out" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pt-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/7 backdrop-blur-md ring-1 ring-white/15 px-3 py-2 flex items-center gap-2">
                      <RemoveRedEye sx={{ height: 18, width: 18 }} />
                      <span className="text-sm tabular-nums">{hero?.totalViews ?? "—"}</span>
                    </div>
                    <div className="rounded-2xl bg-white/7 backdrop-blur-md ring-1 ring-white/15 px-3 py-2 flex items-center gap-2">
                      <StarRate sx={{ height: 18, width: 18 }} />
                      <span className="text-sm tabular-nums">{hero?.ratingCount ?? "—"}</span>
                    </div>
                    <div className="rounded-2xl bg-white/7 backdrop-blur-md ring-1 ring-white/15 px-3 py-2 flex items-center gap-2">
                      <img className="h-4" src={PencilEdit} alt="edit" />
                      <span className="text-sm tabular-nums">{(hero as any)?.chapterCount ?? "—"}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRead?.(); }}
                    className={[
                      "pointer-events-auto",
                      "relative inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5",
                      "text-white font-semibold text-sm border-none select-none",
                      "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
                      "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
                      "shadow-[0_10px_24px_rgba(255,103,64,0.45)] hover:shadow-[0_14px_32px_rgba(255,103,64,0.60)]",
                      "transition-colors duration-300",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff784f]/60",
                      "overflow-hidden before:content-[''] before:absolute before:inset-0",
                      "before:bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]",
                      "before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300",
                    ].join(" ")}
                  >
                    Đọc ngay
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};