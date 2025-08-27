// RequestFilterButton.tsx (no border outside)
import React from "react";
import { PaymentStatus } from "../../../api/Admin/Request/request.type";

interface FilterOption {
  label: string;
  value: PaymentStatus | "All";
  badge?: number;
}

interface Props {
  filters: FilterOption[];
  activeFilter: PaymentStatus | "All";
  onFilter: (value: PaymentStatus | "All") => void;
}

const RequestFilterButtons = ({ filters, activeFilter, onFilter }: Props) => {
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-2xl 
                 bg-white/70 backdrop-blur 
                 dark:bg-zinc-900/60"
      role="tablist"
      aria-label="Bộ lọc yêu cầu rút tiền"
    >
      {filters.map((f) => {
        const active = activeFilter === f.value;
        return (
          <button
            key={String(f.value)}
            onClick={() => onFilter(f.value)}
            role="tab"
            aria-selected={active}
            className={[
              "px-3.5 h-9 rounded-xl text-sm font-semibold transition-colors focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff6740]",
              "dark:focus-visible:ring-offset-zinc-900",
              active
                ? "text-white shadow-sm bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]"
                : "text-zinc-700 bg-white/70 hover:bg-white " +
                  "dark:text-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/70",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <span className="whitespace-nowrap">{f.label}</span>
              {typeof f.badge === "number" && (
                <span
                  className={[
                    "inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full",
                    "text-[11px] font-bold leading-none",
                    active
                      ? "bg-white/25 text-white"
                      : "bg-zinc-200/80 text-zinc-700 dark:bg-white/10 dark:text-zinc-200",
                  ].join(" ")}
                  aria-label={`${f.badge} mục`}
                >
                  {f.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RequestFilterButtons;
