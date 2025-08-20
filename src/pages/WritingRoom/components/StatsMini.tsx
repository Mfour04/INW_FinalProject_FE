export const StatsMini = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.02] backdrop-blur-md p-4">
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-white/60">{label}</p>
      {icon ? <span className="text-white/60">{icon}</span> : null}
    </div>
    <p className="mt-1.5 text-xl font-bold tabular-nums">{value.toLocaleString()}</p>
  </div>
);
