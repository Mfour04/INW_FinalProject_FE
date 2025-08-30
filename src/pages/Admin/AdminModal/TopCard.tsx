import { motion, AnimatePresence } from "framer-motion";

interface TopCardProps<T> {
  title: string;
  items?: T[];
  itemKey?: keyof T;
  imageKey?: keyof T;
  valueKey?: keyof T;
  valueFormatter?: (value: number) => string;
}

const TopCard = <T extends Record<string, unknown>>({
  title,
  items,
  itemKey,
  imageKey,
  valueKey,
  valueFormatter,
}: TopCardProps<T>) => {
  const hasData = items && items.length > 0 && itemKey && imageKey && valueKey;

  return (
    <motion.section
      whileHover={{ y: -1 }}
      transition={{ duration: 0.18 }}
      className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 
                 bg-white dark:bg-[#1a1a1c] shadow-sm p-4"
    >
      {/* Header */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        {title}
      </h2>

      {hasData ? (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items!.map((item, i) => {
              const name = String(item[itemKey as keyof T] ?? "");
              const img = String(item[imageKey as keyof T] ?? "");
              const rawVal = Number(item[valueKey as keyof T] ?? 0);
              const displayVal = valueFormatter ? valueFormatter(rawVal) : String(rawVal);

              return (
                <motion.li
                  key={`${name}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut", delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 
                             hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {/* Rank */}
                  <div className="w-6 text-center text-sm font-bold text-zinc-500 dark:text-zinc-400">
                    {i + 1}
                  </div>

                  {/* Thumb */}
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {name}
                    </div>
                  </div>

                  {/* Value */}
                  <div
                    className="text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200"
                    title={displayVal}
                  >
                    {displayVal}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="flex items-center justify-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
          Không có dữ liệu
        </div>
      )}
    </motion.section>
  );
};

export default TopCard;
