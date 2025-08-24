import { formatNumber } from "../../../../utils/number";

export type MetricProps = {
  icon?: React.ReactNode;
  value?: number | string;
  suffix?: string;
  className?: string;
};

export const Metric = ({ icon, value, suffix, className }: MetricProps) => (
  <span
    className={[
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
      "text-xs text-white/80 bg-white/5 ring-1 ring-white/10",
      "tabular-nums",
      className ?? "",
    ].join(" ")}
  >
    {icon ? (
      <span className="inline-flex items-center opacity-90">{icon}</span>
    ) : null}
    <span>
      {formatNumber(value)}
      {suffix ? ` ${suffix}` : ""}
    </span>
  </span>
);
