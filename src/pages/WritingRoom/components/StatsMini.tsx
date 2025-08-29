import React from "react";

export const StatsMini = ({
  label,
  value,
  icon,
  size = "normal", // "normal" | "compact"
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  size?: "normal" | "compact";
}) => {
  const pad = size === "compact" ? "p-3 sm:p-4" : "p-4";
  const labelText =
    size === "compact" ? "text-[11px] sm:text-[12px]" : "text-[12px]";
  const valueText =
    size === "compact" ? "text-lg sm:text-xl" : "text-xl";

  return (
    <div
      className={[
        "rounded-2xl backdrop-blur-md",
        pad,
        "ring-1 ring-zinc-200 bg-white shadow-sm",
        "dark:ring-white/10 dark:bg-white/[0.02]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <p className={`${labelText} text-zinc-500 dark:text-white/60`}>
          {label}
        </p>
        {icon ? (
          <span className="text-zinc-500 dark:text-white/60">{icon}</span>
        ) : null}
      </div>
      <p
        className={[
          "mt-1.5 font-bold tabular-nums text-zinc-900 dark:text-white",
          valueText,
        ].join(" ")}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
};
