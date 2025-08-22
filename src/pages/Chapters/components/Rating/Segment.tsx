import { Star as StarIcon } from "lucide-react";

type SegmentedProps = {
  value: number | "all";
  onChange: (v: number | "all") => void;
};

export const Segmented = ({ value, onChange }: SegmentedProps) => {
  const base =
    "px-2.5 py-1 rounded-full text-[12px] transition border";
  const active =
    "bg-gray-200 text-gray-900 border-gray-300 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] dark:bg-white/15 dark:text-white dark:border-white/12";
  const idle =
    "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:border-white/12";

  return (
    <div className="inline-flex items-center gap-1 rounded-full p-1 border bg-gray-100 border-gray-200 dark:bg-white/5 dark:border-white/12">
      <button
        className={`${base} ${value === "all" ? active : idle}`}
        onClick={() => onChange("all")}
      >
        Tất cả
      </button>
      {[5, 4, 3, 2, 1].map((s) => (
        <button
          key={s}
          className={`${base} ${value === s ? active : idle}`}
          onClick={() => onChange(s)}
          title={`${s} sao`}
        >
          <span className="inline-flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" fill="currentColor" />
            {s}
          </span>
        </button>
      ))}
    </div>
  );
};
