import React from "react";
import type { Novel } from "../types";

type Props = {
  title: string;
  icon?: React.ReactNode;
  items: Novel[];
  onClickItem: (n: Novel) => void;
  leftMeta?: (n: Novel) => React.ReactNode;
  rightMeta?: (n: Novel) => React.ReactNode;
};

const VerticalItem: React.FC<{
  n: Novel;
  onClick: (n: Novel) => void;
  leftMeta?: React.ReactNode;
  rightMeta?: React.ReactNode;
}> = ({ n, onClick, leftMeta, rightMeta }) => (
  <button
    onClick={() => onClick(n)}
    className={[
      "group relative w-full rounded-2xl outline-none transition",
      "ring-1 ring-white/10 bg-white/5 backdrop-blur-sm",
      "hover:shadow-[0_10px_24px_rgba(255,103,64,0.22)] focus-visible:shadow-[0_12px_28px_rgba(255,103,64,0.28)]",
      "px-3 py-2.5",
      "flex gap-3 items-start",
      "overflow-hidden",
      "text-left",
    ].join(" ")}
  >
    <span
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 rounded-2xl",
        "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
        "transition-opacity duration-300",
      ].join(" ")}
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-[1px] rounded-2xl bg-[#0f0f11]/60"
    />

    <div className="relative z-10 flex gap-3 w-full items-start">
      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 transition group-hover:brightness-110 group-focus-visible:brightness-110">
        {n.novelImage ? (
          <img src={n.novelImage} alt={n.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full animate-pulse" />
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <div className="text-[14px] font-semibold leading-tight truncate text-left mt-1">
          {n.title}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-left mt-3">
          {leftMeta}
          {rightMeta}
        </div>
      </div>

      <span
        className={[
          "ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full",
          "bg-white/5 ring-1 ring-white/10 text-white/80",
          "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          "transition-opacity",
          "self-center",
        ].join(" ")}
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
          <path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" />
        </svg>
      </span>
    </div>
  </button>
);

export const VerticalColumn: React.FC<Props> = ({
  title,
  icon,
  items,
  onClickItem,
  leftMeta,
  rightMeta,
}) => (
  <section className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-3">
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl
                 bg-gradient-to-r from-[#ff512f]/10 via-[#ff6740]/10 to-[#ff9966]/10
                 ring-1 ring-white/10 mb-3"
    >
      {icon ? <span className="opacity-80">{icon}</span> : null}
      <h3 className="text-[16px] font-semibold tracking-wide mt-1 p">{title}</h3>
    </div>

    <div className="space-y-2">
      {items.map((n) => (
        <VerticalItem
          key={n.novelId}
          n={n}
          onClick={onClickItem}
          leftMeta={leftMeta?.(n)}
          rightMeta={rightMeta?.(n)}
        />
      ))}
    </div>
  </section>
);

export default VerticalColumn;
