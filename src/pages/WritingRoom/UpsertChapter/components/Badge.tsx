type Props = {
  children: React.ReactNode;
  tone: "zinc" | "emerald" | "amber" | "rose" | "sky";
};

export const Badge = ({ children, tone = "zinc" }: Props) => {
  const map: Record<string, string> = {
    zinc: "bg-white/[0.06] ring-white/10",
    emerald: "bg-emerald-500/20 ring-emerald-400/40 text-emerald-200",
    amber: "bg-amber-500/20 ring-amber-400/40 text-amber-200",
    rose: "bg-rose-500/20 ring-rose-400/40 text-rose-200",
    sky: "bg-sky-500/20 ring-sky-400/40 text-sky-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ring-1",
        map[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
};
