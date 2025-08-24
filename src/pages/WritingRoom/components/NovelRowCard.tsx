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
  console.log(novel);
  const isCompleted = novel.status === 0;
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
  const maxTags = 8;
  const extraTags = Math.max(0, tags.length - maxTags);

  const updatedAt = formatVietnamTimeFromTicks(Number(novel.createAt));

  return (
    <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.03] transition shadow-[0_16px_50px_-28px_rgba(0,0,0,0.65)]">
      <div className="grid grid-cols-[120px_1fr] gap-4 p-4">
        <div className="relative">
          <div className="w-[120px] h-[160px] overflow-hidden rounded-xl bg-[#14161b] ring-1 ring-white/10">
            {novel.novelImage ? (
              <img
                src={novel.novelImage}
                alt={novel.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/30">
                Không ảnh
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[16px] font-semibold truncate max-w-full">
                {novel.title}
              </h3>

              <div className="flex gap-2">
                <div className="mt-2">
                  <span
                    className={[
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                      "text-[10.5px] font-semibold backdrop-blur-sm border text-white",
                      isCompleted
                        ? "bg-emerald-500/75 border-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.55)]"
                        : "bg-rose-500/75 border-rose-300 shadow-[0_8px_24px_rgba(244,63,94,0.55)]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1 w-1 rounded-full",
                        isCompleted ? "bg-emerald-100" : "bg-rose-100",
                      ].join(" ")}
                    />
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-2">
                  <span
                    className={[
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                      "text-[10.5px] font-semibold backdrop-blur-sm border text-white",
                      isPublic
                        ? "bg-emerald-500/75 border-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.55)]"
                        : "bg-rose-500/75 border-rose-300 shadow-[0_8px_24px_rgba(244,63,94,0.55)]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1 w-1 rounded-full",
                        isCompleted ? "bg-emerald-100" : "bg-rose-100",
                      ].join(" ")}
                    />
                    {publicLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
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

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12.5px]">
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
                <p className="font-medium">
                  {rating.toFixed(1)}
                  <span className="text-white/55"> / 5</span>
                </p>
                <p className="text-white/55 text-[11px]">
                  {Number(ratingCount).toLocaleString()} đánh giá
                </p>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {tags.slice(0, maxTags).map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2 py-[1px] text-[10.5px] text-white/80 border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition"
                >
                  {t}
                </span>
              ))}
              {extraTags > 0 && (
                <span className="rounded-full px-2 py-[1px] text-[10.5px] text-white/80 border border-white/10 bg-white/[0.05]">
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

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-white/55">{label}</p>
    <p className="mt-0.5 font-medium truncate">{value}</p>
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
      "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-[12.5px] font-medium ring-1 transition",
      tone === "danger"
        ? "bg-[rgba(255,80,80,0.12)] hover:bg-[rgba(255,80,80,0.22)] ring-[rgba(255,80,80,0.35)] text-red-300"
        : "bg-white/[0.06] hover:bg-white/[0.1] ring-white/15 text-white/90",
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
      <div className="flex gap-0.5 text-white/25">
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
        <div className="flex gap-0.5 text-yellow-300">
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
