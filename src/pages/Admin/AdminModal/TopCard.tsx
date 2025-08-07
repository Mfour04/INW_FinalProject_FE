import { motion } from "framer-motion";

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
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white dark:bg-[#1a1a1c] rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase mb-4">
        {title}
      </h2>
      {items && itemKey && imageKey && valueKey ? (
        items.map((item) => (
          <div
            key={String(item[itemKey])}
            className="flex items-center gap-4 mb-3"
          >
            <img
              src={String(item[imageKey])}
              alt={String(item[itemKey])}
              className={`w-12 h-12 rounded-${
                itemKey === "NovelId" ? "md" : "full"
              } border-2 border-gray-200 dark:border-gray-700`}
            />
            <div>
              <p className="text-lg font-bold text-[#ff4d4f] truncate max-w-[150px]">
                {String(item[itemKey])}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                {valueFormatter
                  ? valueFormatter(Number(item[valueKey]))
                  : String(item[valueKey])}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center gap-4">
          <img
            src={String(items?.[0]?.[imageKey ?? ""])}
            alt={String(items?.[0]?.[itemKey ?? ""])}
            className={`w-12 h-12 rounded-${
              itemKey === "NovelId" ? "md" : "full"
            } border-2 border-gray-200 dark:border-gray-700`}
          />
          <div>
            <p className="text-lg font-bold text-[#ff4d4f] truncate max-w-[150px]">
              {String(items?.[0]?.[itemKey ?? ""])}
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {valueFormatter
                ? valueFormatter(Number(items?.[0]?.[valueKey ?? ""] ?? 0))
                : String(items?.[0]?.[valueKey ?? ""])}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TopCard;
