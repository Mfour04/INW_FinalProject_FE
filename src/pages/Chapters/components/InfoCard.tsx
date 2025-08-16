import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeTags } from "../utils";

type Props = {
  title: string;
  author: string;
  tags: any[];
  description: string;
  expanded: boolean;
  onToggleExpand: () => void;
};

const TagGhost = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] leading-none border border-white/12 bg-white/[0.045] text-gray-200 hover:bg-white/[0.08] hover:border-white/20 transition-colors">
    {label}
  </span>
);

export const InfoCard = ({
  title,
  author,
  tags,
  description,
  expanded,
  onToggleExpand,
}: Props) => {
  const pills = useMemo(() => normalizeTags(tags), [tags]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [canExpand, setCanExpand] = useState(false);

  const checkOverflow = () => {
    const el = contentRef.current;
    if (!el) return;
    setCanExpand(el.scrollHeight - el.clientHeight > 1);
  };

  useEffect(() => {
    checkOverflow();
    const onRz = () => requestAnimationFrame(checkOverflow);
    window.addEventListener("resize", onRz);
    return () => window.removeEventListener("resize", onRz);
  }, [description, expanded]);

  return (
    <section className="relative rounded-2xl border border-white/10 bg-[#121212]/80 backdrop-blur-md shadow-[0_24px_64px_-28px_rgba(0,0,0,0.7)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute -top-28 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,103,64,0.22),transparent_60%)] blur-2xl" />

      <div className="p-5 md:p-6">
        <h1
          className="text-[22px] md:text-[26px] leading-tight font-extrabold tracking-tight font-sans antialiased text-white"
          style={{
            fontSynthesis: "none",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            fontFeatureSettings: '"kern" 1, "liga" 1, "clig" 1',
          }}
        >
          {title}
        </h1>

        <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="mt-[2px] h-px w-1/3 bg-gradient-to-r from-[#ff875f]/40 to-transparent blur-[0.5px]" />

        {author && (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[12px] font-medium tracking-wide text-[#ff875f]">
              Người đăng:
            </span>
            <span className="relative text-[13px] font-medium text-white">
              <span className="relative z-10">{author}</span>
            </span>
          </div>
        )}

        {pills.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {pills.map((t) => (
              <TagGhost key={t.id} label={t.label} />
            ))}
          </div>
        )}

        <div className="mt-4 text-[14px] leading-7 text-gray-200 relative">
          <div
            ref={contentRef}
            className={expanded ? "max-h-none" : "max-h-40 overflow-hidden"}
          >
            {description}
          </div>

          {!expanded && canExpand && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#121212]/95 via-[#121212]/50 to-transparent" />
          )}

          {canExpand && (
            <button
              onClick={onToggleExpand}
              className="relative mt-2 text-[12px] font-semibold text-[#ff875f] hover:text-[#ff6740] transition"
            >
              {expanded ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
