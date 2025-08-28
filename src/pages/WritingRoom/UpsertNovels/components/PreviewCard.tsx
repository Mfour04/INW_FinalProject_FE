type PreviewCardProps = {
  title: string;
  description: string;
  slug: string;
  imagePreview: string | null;
  bannerPreview: string | null;
};

export const PreviewCard = ({
  title,
  description,
  slug,
  imagePreview,
  bannerPreview,
}: PreviewCardProps) => {
  const fullSlug = `inkwave.io/novels/${slug || "ten-truyen"}`;

  return (
    <div
      className={[
        "rounded-lg overflow-hidden",
        // light
        "bg-white ring-1 ring-zinc-200 shadow-sm",
        // dark
        "dark:bg-[#0e1117]/95 dark:ring-1 dark:ring-white/10 dark:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)]",
      ].join(" ")}
    >
      {/* Accent line */}
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)]" />

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 mt-1">
        <div className="text-[12px] font-semibold tracking-wide text-zinc-700 dark:text-white/85">
          Xem trước
        </div>
      </div>

      {/* Divider */}
      <div
        className={[
          "h-px w-full",
          // light
          "bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200",
          // dark
          "dark:from-white/5 dark:via-white/15 dark:to-white/5",
        ].join(" ")}
      />

      <div className="p-4">
        <div className="flex gap-4">
          {/* Cover */}
          <figure
            className={[
              "relative w-[88px] h-[120px] rounded-md overflow-hidden flex-shrink-0",
              // light
              "ring-1 ring-zinc-200 bg-zinc-100",
              // dark
              "dark:ring-1 dark:ring-white/10 dark:bg-white/[0.04]",
            ].join(" ")}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[12px] text-zinc-500 dark:text-white/60">
                No cover
              </div>
            )}
          </figure>

          {/* Texts */}
          <div className="min-w-0 flex-1">
            <h3 className="text-[15.5px] font-semibold leading-tight truncate text-zinc-900 dark:text-white">
              {title || "Tên truyện"}
            </h3>

            <p
              className="mt-1.5 text-[13px] leading-relaxed break-words text-zinc-600 dark:text-white/70"
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

            {/* Slug pill container */}
            <div
              className={[
                "mt-2 max-w-full rounded-md px-2 py-1",
                // light
                "ring-1 ring-zinc-200 bg-zinc-50",
                // dark
                "dark:ring-1 dark:ring-white/10 dark:bg-white/[0.06]",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px]",
                  // light
                  "ring-1 ring-zinc-200 bg-zinc-100 text-zinc-700",
                  // dark
                  "dark:ring-1 dark:ring-white/10 dark:bg-white/[0.06] dark:text-white/80",
                ].join(" ")}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[13px] w-[13px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M4 7h16M4 12h10M4 17h8" />
                </svg>
                <span
                  className="text-[10px] text-zinc-700 dark:text-white/80"
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
                  inkwave.io/novels/
                  <span className="text-zinc-900 dark:text-white">
                    {slug || "ten-truyen"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner preview */}
        <div className="mt-4">
          {bannerPreview ? (
            <div
              className={[
                "rounded-md overflow-hidden",
                // light
                "ring-1 ring-zinc-200 bg-zinc-100",
                // dark
                "dark:ring-1 dark:ring-white/10 dark:bg-white/[0.04]",
              ].join(" ")}
            >
              <img src={bannerPreview} alt="" className="w-full h-[110px] object-cover" />
            </div>
          ) : (
            <div
              className={[
                "rounded-md p-3",
                // light
                "ring-1 ring-dashed ring-zinc-300 bg-zinc-50",
                // dark
                "dark:ring-1 dark:ring-dashed dark:ring-white/12 dark:bg-white/[0.03]",
              ].join(" ")}
            >
              <div className="text-[12px] text-zinc-600 dark:text-white/65">
                Chưa có banner xem trước.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
