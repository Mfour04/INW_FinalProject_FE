export const StatsMini = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) => (
  <div
    className={[
      "rounded-2xl p-4 backdrop-blur-md",
      "ring-1 ring-zinc-200 bg-white shadow-sm",
      "dark:ring-white/10 dark:bg-white/[0.02]",
    ].join(" ")}
  >
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-zinc-500 dark:text-white/60">{label}</p>
      {icon ? <span className="text-zinc-500 dark:text-white/60">{icon}</span> : null}
    </div>
    <p className="mt-1.5 text-xl font-bold tabular-nums text-zinc-900 dark:text-white">
      {value.toLocaleString()}
    </p>
  </div>
);
