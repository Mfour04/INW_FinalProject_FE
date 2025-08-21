import type { Novel } from "../types";
import { ChevronRight } from "lucide-react";

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
    "bg-white border border-orange-100 shadow-sm",
    "hover:bg-orange-50/70 hover:shadow-md hover:-translate-y-0.5",
    "focus-visible:ring-2 focus-visible:ring-orange-300/60",
    "transition-transform duration-200",
  ].join(" "),
  thumb:
    "h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-orange-50 border border-orange-100 transition group-hover:brightness-105",
  chip: [
    "ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full",
    "bg-orange-50 border border-orange-200 text-orange-600",
    "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity self-center",
  ].join(" "),
  title:
    "mt-1 truncate text-[14px] font-bold leading-tight text-gray-900",
  meta:
    "mt-3 flex items-center gap-2 text-[12px] text-left font-bold text-gray-700",
};

export const VerticalItem = ({
  n,
  onClick,
  leftMeta,
  rightMeta,
}: VerticalItemProps) => {
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
        <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
      </span>
    </button>
  );
};
