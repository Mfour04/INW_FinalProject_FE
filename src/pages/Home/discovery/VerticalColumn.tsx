import React from "react";
import { VerticalItem } from "./VerticalItem";
import type { Novel } from "../../../entity/novel";

type VerticalColumnsProps = {
  title: string;
  icon?: React.ReactNode;
  items: Novel[];
  onClickItem: (n: Novel) => void;
  leftMeta?: (n: Novel) => React.ReactNode;
  rightMeta?: (n: Novel) => React.ReactNode;
};

export const ORANGE_GRAD = "from-[#ff512f] via-[#ff6740] to-[#ff9966]";

export const VerticalColumn = ({
  title,
  icon,
  items,
  onClickItem,
  leftMeta,
  rightMeta,
}: VerticalColumnsProps) => (
  <section
    className="min-w-0 rounded-2xl p-3 bg-white ring-1 ring-gray-200 shadow-sm 
               dark:bg-[#181818] dark:ring-[#2a2c2e]"
  >
    {/* Header */}
    <div
      className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ring-1
                  bg-gradient-to-r ${ORANGE_GRAD} ring-orange-200/40
                  dark:ring-white/10`}
    >
      {icon ? (
        <span className="text-white [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      ) : null}
      <h3 className="text-[15px] font-semibold tracking-wide text-white">
        {title}
      </h3>
    </div>

    {/* Items */}
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
