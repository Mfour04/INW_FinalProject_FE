import { useEffect, useMemo, useRef, useState } from "react";
import { Star, Bookmark, MessageSquare } from "lucide-react";

type TagLike = { tagId?: string; tagName?: string; name?: string };

export type NovelInfoCardProps = {
  title?: string;
  description?: string;
  status?: number;
  novelImage?: string | null | undefined;
  tags?: TagLike[];
  stats?: { rating?: number; bookmark?: number; comment?: number };
};

const TagGhost = ({ label }: { label: string }) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] leading-none transition-colors",
      "border border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
      "dark:border-white/12 dark:bg-white/[0.045] dark:text-gray-200 dark:hover:bg-white/[0.08] dark:hover:border-white/20",
    ].join(" ")}
  >
    {label}
  </span>
);

export default function NovelInfoCard({
  title,
  description,
  status,
  novelImage,
  tags = [],
  stats = { rating: 0, bookmark: 0, comment: 0 },
}: NovelInfoCardProps) {
  const pills = useMemo<TagLike[]>(
    () =>
      (tags ?? []).map((t) => ({
        tagId: t.tagId,
        tagName: t.tagName ?? t.name,
        name: t.name ?? t.tagName,
      })),
    [tags]
  );

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
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
    <section className="grid grid-cols-1 md:grid-cols-[236px_1fr] gap-4 md:gap-5">
      {/* Cover */}
      <div
        className={[
          "relative rounded-2xl overflow-hidden ring-1 backdrop-blur-md",
          "ring-zinc-200 bg-white shadow-sm",
          "dark:ring-white/12 dark:bg-[#0b0c0e]/90 dark:shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)]",
        ].join(" ")}
      >
        <div className="relative">
          <div className="w-full h-80 overflow-hidden">
            {novelImage ? (
              <img
                src={novelImage ?? undefined}
                alt="Novel Cover"
                className="w-full h-full aspect-[1/1.05] object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-zinc-400 dark:text-white/30">
                Ảnh bìa
              </div>
            )}
          </div>
          <span
            className={[
              "absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold backdrop-blur-sm border",
              "text-white",
              status === 0
                ? "bg-emerald-500/85 border-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                : "bg-rose-500/85 border-rose-300 shadow-[0_8px_24px_rgba(244,63,94,0.35)]",
            ].join(" ")}
          >
            <span className={["h-1.5 w-1.5 rounded-full", "bg-white"].join(" ")} />
            {status === 0 ? "Hoàn thành" : "Đang diễn ra"}
          </span>
        </div>

        <div className="px-2.5 pt-2 pb-3">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              {
                icon: <Star size={14} fill="#facc15" stroke="#facc15" />,
                value: stats.rating ?? 0,
              },
              { icon: <Bookmark size={14} />, value: stats.bookmark ?? 0 },
              { icon: <MessageSquare size={14} />, value: stats.comment ?? 0 },
            ].map((it, i) => (
              <div
                key={i}
                className={[
                  "h-7 rounded-lg px-1.5 text-center",
                  "border border-zinc-200 bg-zinc-100",
                  "dark:border-white/10 dark:bg-white/[0.05]",
                ].join(" ")}
              >
                <div className="h-full inline-flex items-center justify-center gap-1 text-[11.5px] text-zinc-700 leading-none dark:text-gray-200">
                  {it.icon}
                  <span className="tabular-nums">{it.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        className={[
          "relative rounded-2xl overflow-hidden border backdrop-blur-md",
          "bg-white border-zinc-200 shadow-sm",
          "dark:bg-[#121212]/80 dark:border-white/10 dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.7)]",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/25" />
        <div className="pointer-events-none absolute -top-28 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,103,64,0.14),transparent_60%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(255,103,64,0.22),transparent_60%)]" />
        <div className="p-5 md:p-6">
          <h1
            className="text-[22px] md:text-[26px] leading-tight font-extrabold tracking-tight"
            style={{
              fontSynthesis: "none",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              fontFeatureSettings: '"kern" 1, "liga" 1, "clig" 1',
            }}
          >
            {title ?? "—"}
          </h1>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/15" />
          <div className="mt-[2px] h-px w-1/3 bg-gradient-to-r from-[#ff875f]/30 to-transparent blur-[0.5px] dark:from-[#ff875f]/40" />

          {pills.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {pills.map((t, i) => (
                <TagGhost key={(t.tagId ?? t.tagName ?? t.name ?? i).toString()} label={t.tagName ?? t.name ?? "Tag"} />
              ))}
            </div>
          )}

          <div className="mt-4 text-[14px] leading-7 text-zinc-700 dark:text-gray-200 relative">
            <div ref={contentRef} className={expanded ? "max-h-none" : "max-h-40 overflow-hidden"}>
              {description ?? "—"}
            </div>
            {!expanded && canExpand && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-[#121212]/95 dark:via-[#121212]/50" />
            )}
            {canExpand && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="relative mt-2 text-[12px] font-semibold text-[#ff6a3a] hover:text-[#ff6740] transition dark:text-[#ff875f] dark:hover:text-[#ff6740]"
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
