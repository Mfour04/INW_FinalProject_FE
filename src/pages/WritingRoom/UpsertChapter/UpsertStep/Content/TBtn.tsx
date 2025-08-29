import React from "react";

type Props = {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
};

export const TBtn = ({ onClick, active, label, children }: Props) => {
  const base =
    "inline-flex items-center justify-center h-8 w-8 rounded-lg ring-1 transition";
  const activeCls =
    "bg-zinc-200 text-zinc-900 ring-zinc-300 dark:bg-white/[0.14] dark:text-white dark:ring-white/25";
  const inactiveCls =
    "bg-zinc-100 text-zinc-700 ring-zinc-200 hover:bg-zinc-200/80 dark:bg-white/[0.06] dark:text-white/90 dark:ring-white/10 dark:hover:bg-white/[0.1]";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`${base} ${active ? activeCls : inactiveCls}`}
    >
      {children}
    </button>
  );
};
