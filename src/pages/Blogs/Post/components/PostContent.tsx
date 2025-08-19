import React, { useMemo, useState } from "react";

type Props = {
  content: string;
  clampLines?: number;    
  className?: string;      
  showMoreText?: string;   
  showLessText?: string;  
  collapsible?: boolean;   
};

export const PostContent: React.FC<Props> = ({
  content,
  clampLines = 3,
  className = "",
  showMoreText = "Xem thêm…",
  showLessText = "Rút gọn",
  collapsible = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const hasMore = useMemo(() => {
    if (!content) return false;
    const lines = content.split(/\r?\n/).length;
    return lines > clampLines || content.length > 220;
  }, [content, clampLines]);

  return (
    <div className={className}>
      <div
        className="whitespace-pre-wrap break-words text-[17px] text-white/95"
        style={
          expanded
            ? {}
            : {
                display: "-webkit-box",
                WebkitLineClamp: clampLines,
                WebkitBoxOrient: "vertical" as any,
                overflow: "hidden",
              }
        }
      >
        {content}
      </div>

      {!expanded && hasMore && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 text-sky-400 hover:text-sky-300 font-medium"
        >
          {showMoreText}
        </button>
      )}

      {expanded && collapsible && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-2 text-sky-400 hover:text-sky-300 font-medium"
        >
          {showLessText}
        </button>
      )}
    </div>
  );
};
