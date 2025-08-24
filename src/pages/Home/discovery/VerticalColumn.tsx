import React from "react";
import type { Novel } from "../types";
import { VerticalItem } from "./VerticalItem";

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
    className="rounded-2xl p-3 
              bg-white ring-1 ring-gray-200 shadow-sm 
              dark:bg-[#181818] dark:ring-[#2a2c2e]"
  >
  <div
  className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3
              bg-gradient-to-r ${ORANGE_GRAD} ring-1 ring-orange-200/40
              bg-[#2a2c2e] ring-[#3a3c3e]`}
  >
    {icon ? <span className="text-gray-700 dark:text-white">{icon}</span> : null}
    <h3 className="text-[16px] font-semibold tracking-wide text-gray-800 text-white">
      {title}
    </h3>
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
