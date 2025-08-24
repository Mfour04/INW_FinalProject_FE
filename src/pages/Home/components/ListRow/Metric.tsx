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
      "text-xs bg-white/5",
      "tabular-nums",
      "text-gray-700 ring-1 ring-gray-300",
      "dark:text-white/80 dark:ring-1 dark:ring-gray-400",
      className ?? "",
    ].join(" ")} 
  >
    {icon ? (
      <span className="inline-flex items-center opacity-90">{icon}</span>
    ) : null}
    <span className="font-bold text-gray-700 dark:text-white/80">
      {formatNumber(value)}
      {suffix ? ` ${suffix}` : ""}
    </span>
  </span>
);
