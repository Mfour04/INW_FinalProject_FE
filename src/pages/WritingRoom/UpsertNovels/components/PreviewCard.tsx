import React from "react";

type PreviewCardProps = {
  title: string;
  description: string;
  slug: string;
  imagePreview: string | null;
  bannerPreview: string | null;
};

export const PreviewCard: React.FC<PreviewCardProps> = ({
  title,
  description,
  slug,
  imagePreview,
  bannerPreview,
}) => {
  const fullSlug = `inkwave.io/novels/${slug || "ten-truyen"}`;

  return (
    <div className="rounded-lg bg-[#0e1117]/95 ring-1 ring-white/10 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)]" />

      <div className="flex items-center justify-between px-3.5 py-2.5 mt-1">
        <div className="text-[12px] font-semibold text-white/85 tracking-wide">Xem trước</div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/15 to-white/5" />

      <div className="p-4">
        <div className="flex gap-4">
          <figure className="relative w-[88px] h-[120px] rounded-md overflow-hidden ring-1 ring-white/10 bg-white/[0.04] flex-shrink-0">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[12px] text-white/60">No cover</div>
            )}
          </figure>

          <div className="min-w-0 flex-1">
            <h3 className="text-[15.5px] font-semibold leading-tight truncate text-white">
              {title || "Tên truyện"}
            </h3>

            <p
              className="mt-1.5 text-[13px] text-white/70 leading-relaxed break-words"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={description}
            >
              {description?.trim() || "Mô tả ngắn gọn hiển thị ở đây."}
            </p>

            <div className="mt-2 max-w-full rounded-md ring-1 ring-white/10 bg-white/[0.06] px-2 py-1">
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] ring-1 ring-white/10 bg-white/[0.06] text-white/80">
              <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 7h16M4 12h10M4 17h8" />
              </svg>
              <span
                  className="text-[10px] text-white/80"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                  title={fullSlug}
                >
                  inkwave.io/novels/<span className="text-white">{slug || "ten-truyen"}</span>
                </span>
            </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {bannerPreview ? (
            <div className="rounded-md overflow-hidden ring-1 ring-white/10 bg-white/[0.04]">
              <img src={bannerPreview} alt="" className="w-full h-[110px] object-cover" />
            </div>
          ) : (
            <div className="rounded-md ring-1 ring-dashed ring-white/12 bg-white/[0.03] p-3">
              <div className="text-[12px] text-white/65">Chưa có banner xem trước.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
