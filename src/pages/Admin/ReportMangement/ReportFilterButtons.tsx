interface FilterOption<T> {
  label: string;
  value: T;
}

interface FilterButtonsProps<T> {
  filters: FilterOption<T>[];
  activeFilter: T;
  onFilter: (value: T) => void;
}

/**
 * UI:
 * - Segmented control bo tròn, nền trung tính (không màu cam).
 * - Nút đang chọn nổi bật (nền đậm, chữ trắng), còn lại chữ trung tính, hover có nền mờ.
 * - Có border ngăn cách nhẹ giữa các nút (không quá “khứa”).
 * - Hỗ trợ bàn phím (Enter/Space) & aria roles (tablist/tab).
 * - Tự cuộn ngang khi thiếu chỗ (mobile), scrollbar mảnh.
 */
const ReportFilterButtons = <T extends string | number>({
  filters,
  activeFilter,
  onFilter,
}: FilterButtonsProps<T>) => {
  return (
    <div
      role="tablist"
      aria-label="Bộ lọc trạng thái"
      className="
        relative inline-flex max-w-full overflow-x-auto scrollbar-thin
        rounded-2xl bg-white/80 dark:bg-white/5
        ring-1 ring-zinc-200 dark:ring-white/10 shadow-sm
      "
    >
      {filters.map((f, idx) => {
        const isActive = activeFilter === f.value;
        return (
          <button
            key={String(f.value)}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onFilter(f.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFilter(f.value);
              }
            }}
            className={[
              // layout
              "px-3.5 md:px-4 h-9 md:h-10 inline-flex items-center gap-2",
              "whitespace-nowrap select-none",
              // border separator giữa các item
              idx > 0 ? "border-l border-zinc-200/70 dark:border-white/10" : "",
              // shape
              "text-sm font-medium",
              // color states
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-white/10",
              // focus
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/70",
              // smooth
              "transition-colors"
            ].join(" ")}
            title={f.label}
          >
            {/* Dot trạng thái nhỏ (nhẹ, không bắt buộc) */}
            <span
              className={[
                "w-1.5 h-1.5 rounded-full",
                isActive
                  ? "bg-zinc-200 dark:bg-zinc-800"
                  : "bg-zinc-400/70 dark:bg-zinc-400/70"
              ].join(" ")}
              aria-hidden
            />
            <span className="truncate">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReportFilterButtons;
