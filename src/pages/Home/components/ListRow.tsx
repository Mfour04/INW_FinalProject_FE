import React from "react";

type BaseProps = {
  title: string;
  image?: string;
  onClick: () => void;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
};

export type ListRowProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;

const formatNumber = (n?: number | string) => {
  if (n === undefined || n === null) return "0";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "k";
  return String(num);
};

export const Metric: React.FC<{
  icon?: React.ReactNode;
  value?: number | string;
  suffix?: string;
  className?: string;
}> = ({ icon, value, suffix, className }) => (
  <span
    className={[
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
      "text-xs text-white/80 bg-white/5 ring-1 ring-white/10",
      "tabular-nums",
      className ?? "",
    ].join(" ")}
  >
    {icon ? <span className="inline-flex items-center opacity-90">{icon}</span> : null}
    <span>{formatNumber(value)}{suffix ? ` ${suffix}` : ""}</span>
  </span>
);

export const RowSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={["flex items-center gap-4 p-3 rounded-xl", "bg-white/5 animate-pulse", className ?? ""].join(" ")}>
    <div className="h-16 w-12 rounded-md bg-white/10" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-3 w-2/3 rounded bg-white/10" />
      <div className="h-3 w-1/3 rounded bg-white/10" />
    </div>
  </div>
);

export const ListRow: React.FC<ListRowProps> = ({
  title,
  image,
  onClick,
  primary,
  secondary,
  className,
  ...rest
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        "flex items-center gap-4 p-3 rounded-xl cursor-pointer",
        "bg-zinc-900/60 hover:bg-zinc-800/70 transition-colors",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {image ? (
        <img src={image} alt="cover" className="h-16 w-12 object-cover rounded-md" />
      ) : (
        <div className="h-16 w-12 rounded-md bg-white/10" />
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{title}</h4>

        <div className="mt-1 flex items-center gap-2">
          {primary}
          {secondary ? <span className="text-white/20">•</span> : null}
          {secondary}
        </div>
      </div>
    </div>
  );
};

export default ListRow;
