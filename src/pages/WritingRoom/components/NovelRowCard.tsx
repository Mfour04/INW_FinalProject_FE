import { useEffect, useState } from "react";
import { PencilLine, BookOpenCheck, Trash2, Star } from "lucide-react";
import { formatVietnamTimeFromTicks } from "../../../utils/date_format";
import type { Novel } from "../../../entity/novel";

export const NovelRowCard = ({
  novel,
  onEdit,
  onChapters,
  onDelete,
}: {
  novel: Novel;
  onEdit: () => void;
  onChapters: () => void;
  onDelete: () => void;
}) => {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 639.5px)");
    const update = () => setIsSmall(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  const isCompleted = novel.status === 1;
  const isPublic = novel.isPublic;
  const statusLabel = isCompleted ? "Hoàn thành" : "Đang diễn ra";
  const publicLabel = isPublic ? "Công khai" : "Chỉ mình tôi";

  const ratingRaw = novel.ratingAvg ?? 0;
  const rating = Math.max(0, Math.min(5, Number(ratingRaw) || 0));
  const ratingCount = novel.ratingCount ?? 0;

  const rawTags: any[] = novel.tags ?? [];
  const tags = (rawTags || [])
    .map((t) => (typeof t === "string" ? t : t?.name || t?.title || ""))
    .filter(Boolean);
  const maxTags = isSmall ? 5 : 8;
  const extraTags = Math.max(0, tags.length - maxTags);

  const updatedAt = formatVietnamTimeFromTicks(Number(novel.createAt));

  return (
    <div
      className={[
        "rounded-2xl backdrop-blur-md transition",
        "ring-1 ring-zinc-200 bg-white hover:bg-zinc-50 shadow-sm",
        "dark:ring-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.03] dark:shadow-[0_16px_50px_-28px_rgba(0,0,0,0.65)]",
      ].join(" ")}
    >
      <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] gap-3 sm:gap-4 p-3 sm:p-4">
        <div className="relative">
          <div
            className={[
              "w-[88px] h-[118px] sm:w-[120px] sm:h-[160px] overflow-hidden rounded-xl ring-1",
              "bg-zinc-100 ring-zinc-200",
              "dark:bg-[#14161b] dark:ring-white/10",
            ].join(" ")}
          >
            {novel.novelImage ? (
              <img
                src={novel.novelImage}
                alt={novel.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-zinc-400 dark:text-white/30">
                Không ảnh
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h3 className="text-[14px] sm:text-[16px] font-semibold truncate max-w-full text-zinc-900 dark:text-white">
                {novel.title}
              </h3>

              <div className="mt-1.5 flex gap-1.5 sm:gap-2">
                <Pill tone={isCompleted ? "ok" : "warn"}>{statusLabel}</Pill>
                <Pill tone={isPublic ? "ok" : "warn"}>{publicLabel}</Pill>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 sm:gap-2">
              <ActionBtn onClick={onEdit} label="Sửa">
                <PencilLine className="h-4 w-4" />
              </ActionBtn>
              <ActionBtn onClick={onChapters} label="Chương">
                <BookOpenCheck className="h-4 w-4" />
              </ActionBtn>
              <ActionBtn onClick={onDelete} label="Xóa" tone="danger">
                <Trash2 className="h-4 w-4" />
              </ActionBtn>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-[11.5px] sm:text-[12.5px]">
            <Meta label="Cập nhật" value={updatedAt} />
            <Meta
              label="Lượt xem"
              value={(novel.totalViews ?? 0).toLocaleString()}
            />
            <Meta
              label="Theo dõi"
              value={(novel.followers ?? 0).toLocaleString()}
            />
            <div className="min-w-0 flex items-center gap-2">
              <StarRating rating={rating} />
              <div className="leading-tight">
                <p className="font-medium text-zinc-900 dark:text-white">
                  {rating.toFixed(1)}
                  <span className="text-zinc-500 dark:text-white/55"> / 5</span>
                </p>
                <p className="text-zinc-500 dark:text-white/55 text-[10.5px] sm:text-[11px]">
                  {Number(ratingCount).toLocaleString()} đánh giá
                </p>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1">
              {tags.slice(0, maxTags).map((t) => (
                <span
                  key={t}
                  className={[
                    "rounded-full px-2 py-[1px] text-[10px] sm:text-[10.5px] transition",
                    "text-zinc-700 border border-zinc-200 bg-zinc-100 hover:bg-zinc-200",
                    "dark:text-white/80 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]",
                  ].join(" ")}
                >
                  {t}
                </span>
              ))}
              {extraTags > 0 && (
                <span
                  className={[
                    "rounded-full px-2 py-[1px] text-[10px] sm:text-[10.5px]",
                    "text-zinc-700 border border-zinc-200 bg-zinc-100",
                    "dark:text-white/80 dark:border-white/10 dark:bg-white/[0.05]",
                  ].join(" ")}
                >
                  +{extraTags}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Pill = ({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "ok" | "warn";
}) => (
  <span
    className={[
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[10.5px] font-semibold backdrop-blur-sm border",
      "text-white",
      tone === "ok"
        ? "bg-emerald-500/85 border-emerald-300 shadow-[0_6px_20px_rgba(16,185,129,0.25)]"
        : "bg-rose-500/85 border-rose-300 shadow-[0_6px_20px_rgba(244,63,94,0.25)]",
    ].join(" ")}
  >
    <span className="h-1 w-1 rounded-full bg-white" />
    {children}
  </span>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-zinc-500 dark:text-white/55">{label}</p>
    <p className="mt-0.5 font-medium truncate text-zinc-900 dark:text-white">
      {value}
    </p>
  </div>
);

const ActionBtn = ({
  children,
  label,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={[
      "inline-flex items-center gap-2 h-8 sm:h-9 rounded-xl px-2 sm:px-3 text-[12px] sm:text-[12.5px] font-medium ring-1 transition",
      tone === "danger"
        ? [
            "text-red-600 ring-red-200 bg-red-50 hover:bg-red-100",
            "dark:text-red-300 dark:ring-[rgba(255,80,80,0.35)] dark:bg-[rgba(255,80,80,0.12)] dark:hover:bg-[rgba(255,80,80,0.22)]",
          ].join(" ")
        : [
            "text-zinc-800 ring-zinc-200 bg-zinc-100 hover:bg-zinc-200",
            "dark:text-white/90 dark:ring-white/15 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]",
          ].join(" "),
    ].join(" ")}
    title={label}
    aria-label={label}
  >
    {children}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const StarRating = ({ rating }: { rating: number }) => {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="relative inline-flex items-center">
      <div className="flex gap-0.5 text-zinc-300 dark:text-white/25">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`bg-${i}`}
            className="h-4 w-4"
            stroke="currentColor"
            fill="currentColor"
          />
        ))}
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${percent}%` }}
        aria-hidden
      >
        <div className="flex gap-0.5 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={`fg-${i}`}
              className="h-4 w-4"
              stroke="currentColor"
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
