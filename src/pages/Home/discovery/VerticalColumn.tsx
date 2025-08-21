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

export const VerticalColumn = ({
  title,
  icon,
  items,
  onClickItem,
  leftMeta,
  rightMeta,
}: VerticalColumnsProps) => (
  // <section className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-3">
  //   <div
  //     className="flex items-center gap-2 px-3 py-2 rounded-xl
  //                bg-gradient-to-r from-[#ff512f]/10 via-[#ff6740]/10 to-[#ff9966]/10
  //                ring-1 ring-white/10 mb-3"
  //   >
  //     {icon ? <span className="opacity-80">{icon}</span> : null}
  //     <h3 className="text-[16px] font-semibold tracking-wide mt-1 p">
  //       {title}
  //     </h3>
  //   </div>

  //   <div className="space-y-2">
  //     {items.map((n) => (
  //       <VerticalItem
  //         key={n.novelId}
  //         n={n}
  //         onClick={onClickItem}
  //         leftMeta={leftMeta?.(n)}
  //         rightMeta={rightMeta?.(n)}
  //       />
  //     ))}
  //   </div>
  // </section>

  <section className="rounded-2xl bg-white ring-1 ring-gray-200 p-3 shadow-sm">
  <div
  className="flex items-center gap-2 px-3 py-2 rounded-xl
             bg-gradient-to-r from-[#ff7849]/20 via-[#ff9a76]/20 to-[#ffd180]/20
             ring-1 ring-orange-200/40 mb-3"
>
  {icon ? <span className="text-orange-500">{icon}</span> : null}
  <h3 className="text-[16px] font-semibold tracking-wide text-gray-800">
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
