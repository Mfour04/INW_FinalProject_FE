import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Star, UserPlus } from "lucide-react";

interface NovelTopSectionProps<T> {
  novels: T[];
  threeDaysAgo: number;
}

type ValueFormatter = (value: number) => React.ReactNode;

interface MetricCardProps<T extends Record<string, unknown>> {
  title: string;
  icon: React.ReactNode;
  items: T[];
  itemKey: keyof T;
  imageKey: keyof T;
  valueKey: keyof T;
  valueFormatter: ValueFormatter;
}

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

function MetricCard<T extends Record<string, unknown>>({
  title,
  icon,
  items,
  itemKey,
  imageKey,
  valueKey,
  valueFormatter,
}: MetricCardProps<T>) {
  return (
    <section className="rounded-2xl border bg-white/90 dark:bg-[#0b0f15]/80 border-zinc-200 dark:border-white/10 shadow-sm backdrop-blur p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff512f]/15 via-[#ff6740]/15 to-[#ff9966]/15 text-[#ff6740] dark:text-[#ff9966]">
          {icon}
        </div>
        <h3 className="text-[15px] font-semibold tracking-wide">{title}</h3>
      </div>

      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {items.map((n, i) => {
            const titleText = String(n[itemKey] ?? "");
            const img = String(n[imageKey] ?? "");
            const valueNum = Number(n[valueKey] ?? 0);

            return (
              <motion.li
                key={`${titleText}-${i}`}
                variants={rowVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{
                  delay: i * 0.05,
                  duration: 0.16,
                  ease: "easeOut",
                }}
                className="group flex items-center gap-3 rounded-xl border border-zinc-200/80 dark:border-white/10 p-2.5 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                <div
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-white ${
                    i === 0
                      ? "bg-gradient-to-br from-[#ff512f] to-[#ff6740]"
                      : i === 1
                      ? "bg-zinc-400 dark:bg-zinc-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                >
                  {i + 1}
                </div>

                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800">
                  {img && (
                    <img
                      src={img}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium">
                    {titleText}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums text-zinc-700 dark:text-zinc-200 leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                  {valueFormatter(valueNum)}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}

const NovelTopSection = <T extends Record<string, unknown>>({
  novels,
}: NovelTopSectionProps<T>) => {
  const mostViewedNovels = useMemo(
    () =>
      [...novels]
        .sort((a, b) => Number(b.TotalViews) - Number(a.TotalViews))
        .slice(0, 3),
    [novels]
  );

  const topRatedNovels = useMemo(
    () =>
      [...novels]
        .sort((a, b) => Number(b.RatingAvg) - Number(a.RatingAvg))
        .slice(0, 3),
    [novels]
  );

  const viewFollowerTrend = useMemo(
    () =>
      [...novels]
        .sort((a, b) => Number(b.Followers) - Number(a.Followers))
        .slice(0, 3),
    [novels]
  );

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard<T>
        title="Truyện xem nhiều"
        icon={<Eye className="h-5 w-5" />}
        items={mostViewedNovels}
        itemKey={"Title" as keyof T}
        imageKey={"NovelImage" as keyof T}
        valueKey={"TotalViews" as keyof T}
        valueFormatter={(v) => (
          <>
            {v.toLocaleString()}
            <Eye className="w-4 h-4 ml-1 text-zinc-900 dark:text-zinc-100" />
          </>
        )}
      />

      <MetricCard<T>
        title="Truyện đánh giá cao"
        icon={<Star className="h-5 w-5" />}
        items={topRatedNovels}
        itemKey={"Title" as keyof T}
        imageKey={"NovelImage" as keyof T}
        valueKey={"RatingAvg" as keyof T}
        valueFormatter={(v) => (
          <>
            <span className="leading-none">{v.toFixed(1)}</span>
            <Star className="w-4 h-4 ml-1 text-yellow-500 fill-yellow-500 translate-y-[1px]" />
          </>
        )}
      />

      <MetricCard<T>
        title="Lượt theo dõi nhiều"
        icon={<UserPlus className="h-5 w-5" />}
        items={viewFollowerTrend}
        itemKey={"Title" as keyof T}
        imageKey={"NovelImage" as keyof T}
        valueKey={"Followers" as keyof T}
        valueFormatter={(v) => (
          <>
            {v.toLocaleString()}
            <UserPlus className="w-4 h-4 ml-1 text-zinc-900 dark:text-zinc-100" />
          </>
        )}
      />
    </div>
  );
};

export default memo(NovelTopSection);
