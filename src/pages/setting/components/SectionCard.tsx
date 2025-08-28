type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  desc?: string;
  headerDivider?: boolean;
  actions?: React.ReactNode;
  bodyPadding?: boolean;
};

export const SectionCard = ({
  children,
  className,
  title,
  desc,
  headerDivider = false,
  actions,
  bodyPadding = true,
}: SectionCardProps) => (
  <div
    className={[
      "rounded-2xl",
      "bg-white ring-1 ring-zinc-200 shadow-sm",
      "dark:bg-[#121418]/90 dark:ring-white/10 backdrop-blur",
      className || "",
    ].join(" ")}
  >
    {(title || desc || actions) && (
      <div className="px-4 sm:px-5 pt-4 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="text-[15px] sm:text-base font-semibold text-zinc-900 dark:text-white">
                {title}
              </h3>
            )}
            {desc && (
              <p className="text-xs sm:text-[13px] mt-1 text-zinc-500 dark:text-zinc-400">
                {desc}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>

        {headerDivider && (
          <div className="mt-3 h-px bg-zinc-200/80 dark:bg-white/10 rounded" />
        )}
      </div>
    )}

    <div className={bodyPadding ? "p-4 sm:p-5" : undefined}>{children}</div>
  </div>
);
