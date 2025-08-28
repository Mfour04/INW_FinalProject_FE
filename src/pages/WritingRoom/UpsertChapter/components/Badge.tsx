type Props = {
  children: React.ReactNode;
  tone?: "zinc" | "emerald" | "amber" | "rose" | "sky";
};

export const Badge = ({ children, tone = "zinc" }: Props) => {
  const map: Record<NonNullable<Props["tone"]>, string> = {
    // Light ↔ Dark
    zinc: [
      "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200",
      "dark:bg-white/10 dark:text-white/85 dark:ring-white/12",
    ].join(" "),
    emerald: [
      "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
      "dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/40",
    ].join(" "),
    amber: [
      "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
      "dark:bg-amber-500/20 dark:text-amber-200 dark:ring-amber-400/40",
    ].join(" "),
    rose: [
      "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
      "dark:bg-rose-500/20 dark:text-rose-200 dark:ring-rose-400/40",
    ].join(" "),
    sky: [
      "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
      "dark:bg-sky-500/20 dark:text-sky-200 dark:ring-sky-400/40",
    ].join(" "),
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px]",
        map[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
};
