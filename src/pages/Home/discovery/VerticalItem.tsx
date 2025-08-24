import { ChevronRight } from "lucide-react";
import type { Novel } from "../../../entity/novel";

export type VerticalItemProps = {
  n: Novel;
  onClick: (n: Novel) => void;
  leftMeta?: React.ReactNode;
  rightMeta?: React.ReactNode;
};

const base =
  "group relative w-full rounded-2xl outline-none text-left overflow-hidden transition px-3 py-2.5 flex items-start gap-3";

const styles = {
  container: [
    base,
    // Light
    "bg-white border border-gray-200 hover:bg-[#f5f5f5]",
    // Dark → sáng hơn Column để nổi khối
    "dark:bg-[#232023] dark:border-[#3a3d40]",
    "dark:hover:bg-[#36393c]",
    "dark:shadow-[0_4px_10px_rgba(0,0,0,0.6)]",
    "focus-visible:ring-2 focus-visible:ring-orange-300/60 dark:focus-visible:ring-[#4a4d50]",
    "transition-transform duration-200",
  ].join(" "),
  thumb: [
    "h-14 w-14 shrink-0 rounded-xl overflow-hidden",
    "bg-orange-50 border border-orange-100",
    "dark:bg-[#2a2c2e] dark:border-[#3a3c3e]",
    "transition group-hover:brightness-105",
  ].join(" "),
  chip: [
    "ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full shrink-0",
    "border border-gray-400 text-black",
    "dark:bg-[#2a2c2e] dark:border-white/50 dark:text-white/80",
    "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity self-center",
  ].join(" "),
  title:
    "mt-1 truncate text-[14px] font-semibold leading-tight text-gray-900 dark:text-white",
  meta: "mt-3 flex items-center gap-2 text-[12px] text-left text-gray-700 dark:text-gray-400",
};

export const VerticalItem = ({
  n,
  onClick,
  leftMeta,
  rightMeta,
}: VerticalItemProps) => {
  console.log(n);
  return (
    <button onClick={() => onClick(n)} className={styles.container}>
      <div className={styles.thumb}>
        {n.novelImage ? (
          <img
            src={n.novelImage}
            alt={n.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full animate-pulse" />
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <div className={styles.title}>{n.title}</div>
        <div className={styles.meta}>
          {leftMeta}
          {rightMeta}
        </div>
      </div>

      <span aria-hidden className={styles.chip}>
        <ChevronRight className="h-3.5 w-3.5 stroke-[1.75]" />
      </span>
    </button>
  );
};
