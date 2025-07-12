import type { HTMLAttributes } from "react";
import type { Tag } from "../../api/Tags/tag.type";
import cn from "../../utils/cn";

interface TagProps extends HTMLAttributes<HTMLDivElement> {
  tag: Tag;
}

export const TagView = ({ tag, className, ...props }: TagProps) => {
  return (
    <div
      {...props}
      className={cn(
        "border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm",
        className
      )}
    >
      {tag.name}
    </div>
  );
};
