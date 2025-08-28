type SidebarButtonProps = {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export const SidebarButton = ({
  active,
  onClick,
  children,
  icon,
  right,
  className,
}: SidebarButtonProps) => {
  const base =
    "w-full rounded-xl px-3 py-2 text-sm font-medium transition flex items-center justify-between gap-2";

  const activeCls = [
    "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_45%,#ff9966_100%)] text-white",
    "shadow-[0_6px_24px_-12px_rgba(255,103,64,0.45)]",
  ].join(" ");

  const idleCls = [
    "ring-1 ring-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800",
    "dark:bg-white/5 dark:ring-white/10 dark:text-zinc-200 dark:hover:bg-white/10",
  ].join(" ");

  return (
    <button
      onClick={onClick}
      className={[base, active ? activeCls : idleCls, className || ""].join(
        " "
      )}
      type="button"
    >
      <span className="inline-flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
      </span>

      {right && <span className="shrink-0">{right}</span>}
    </button>
  );
};
