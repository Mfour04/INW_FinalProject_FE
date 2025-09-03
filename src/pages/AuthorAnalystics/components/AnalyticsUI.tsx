import {
  useMemo,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { BarChart3 } from "lucide-react";

/* ============ Shell & Layout ============ */

export const Shell = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen text-zinc-900 dark:text-white">
    {/* Light overlay */}
    <div
      className="fixed inset-0 -z-10 opacity-70 pointer-events-none dark:hidden"
      style={{
        background:
          "radial-gradient(70rem 32rem at 110% -10%, rgba(255,103,64,0.08), transparent 60%), radial-gradient(60rem 26rem at -20% 40%, rgba(120,170,255,0.08), transparent 60%)",
      }}
    />
    {/* Dark overlay */}
    <div
      className="fixed inset-0 -z-10 opacity-60 pointer-events-none hidden dark:block"
      style={{
        background:
          "radial-gradient(70rem 32rem at 110% -10%, rgba(255,103,64,0.10), transparent 60%), radial-gradient(60rem 26rem at -20% 40%, rgba(120,170,255,0.10), transparent 60%)",
      }}
    />
    {children}
  </div>
);

export const Container = ({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) => (
  <div className={`max-w-screen-2xl mx-auto px-4 md:px-6 ${className}`}>
    {children}
  </div>
);

export const Card = ({
  className = "",
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={`rounded-2xl ring-1 bg-white ring-zinc-200 
                dark:bg-white/[0.035] dark:ring-white/10 ${className}`}
  >
    {children}
  </div>
);

/* ============ Inputs ============ */

export const SoftInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`h-9 rounded-xl px-3 text-sm outline-none
      bg-white ring-1 ring-zinc-200 text-zinc-900 placeholder:text-zinc-500
      dark:bg-white/5 dark:ring-white/10 dark:text-white dark:placeholder:text-white/40
      ${props.className ?? ""}`}
  />
);

export const SoftSelect = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`h-9 rounded-xl px-3 text-sm outline-none
      bg-white ring-1 ring-zinc-200 text-zinc-900
      dark:bg-white/5 dark:ring-white/10 dark:text-white
      ${props.className ?? ""}`}
  />
);

/* ============ KPI Pill ============ */

export const KpiPill = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) => (
  <div
    className="flex items-center gap-3 rounded-xl px-4 py-3
               bg-white ring-1 ring-zinc-200
               dark:bg-white/[0.04] dark:ring-white/10"
  >
    <div
      className="h-8 w-8 rounded-lg grid place-items-center
                 bg-zinc-100 ring-1 ring-zinc-200 text-zinc-800
                 dark:bg-white/5 dark:ring-white/10 dark:text-white"
    >
      {icon}
    </div>
    <div>
      <div className="text-xs text-zinc-600 dark:text-white/60">{label}</div>
      <div className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </div>
    </div>
  </div>
);

/* ============ AreaChart (SVG) ============ */

export const AreaChart = ({
  series,
  yKey,
  height = 220,
}: {
  series: any[];
  yKey: string;
  height?: number;
}) => {
  const { dArea, dLine, ticks } = useMemo(() => {
    if (!series.length) return { dArea: "", dLine: "", ticks: [] as string[] };
    const w = 800,
      h = height,
      pad = 24;
    const xs = series.map((_: any, i: number) => i);
    const ys = series.map((d: any) => Number(d[yKey]) as number);
    const maxX = xs[xs.length - 1] || 1;
    const maxY = Math.max(...ys, 1);
    const sx = (i: number) => pad + (i / Math.max(1, maxX)) * (w - pad * 2);
    const sy = (v: number) => h - pad - (v / maxY) * (h - pad * 2);

    const a: (string | number)[] = ["M", sx(0), sy(ys[0])];
    const l: (string | number)[] = ["M", sx(0), sy(ys[0])];
    for (let i = 1; i < xs.length; i++) {
      a.push("L", sx(xs[i]), sy(ys[i]));
      l.push("L", sx(xs[i]), sy(ys[i]));
    }
    a.push("L", sx(maxX), sy(0), "L", sx(0), sy(0), "Z");

    const step = Math.max(1, Math.floor(series.length / 6));
    const tks: string[] = [];
    for (let i = 0; i < series.length; i += step) tks.push(series[i].ts);
    return { dArea: a.join(" "), dLine: l.join(" "), ticks: tks };
  }, [series, yKey, height]);

  return (
    <svg viewBox={`0 0 800 ${height}`} className="w-full h-[220px]">
      <defs>
        <linearGradient id="g-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff6740" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff6740" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={dArea} fill="url(#g-area)" />
      <path d={dLine} stroke="#ff6740" strokeWidth="2" fill="none" />
      <g className="text-[10px] fill-zinc-500 dark:fill-white/60">
        {ticks.map((t, i) => (
          <text
            key={i}
            x={24 + (i / Math.max(1, ticks.length - 1)) * (800 - 48)}
            y={height - 6}
            textAnchor="middle"
          >
            {t}
          </text>
        ))}
      </g>
    </svg>
  );
};

export const ChartToolbar = ({
  granularity,
  onGranularity,
}: {
  granularity: "day" | "month" | "year";
  onGranularity: (g: "day" | "month" | "year") => void;
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/70">
      <span
        className="h-6 w-6 grid place-items-center rounded-md
                       bg-zinc-100 ring-1 ring-zinc-200
                       dark:bg-white/5 dark:ring-white/10"
      >
        <BarChart3 className="h-3.5 w-3.5 text-zinc-700 dark:text-white" />
      </span>
      Chế độ hiển thị
    </div>
    <div className="flex items-center gap-2">
      <select
        value={granularity}
        onChange={(e) => onGranularity(e.target.value as any)}
        className="h-9 rounded-xl px-3 text-sm outline-none
                   bg-white ring-1 ring-zinc-200 text-zinc-900
                   dark:bg-white/5 dark:ring-white/10 dark:text-white"
        title="Hiển thị theo"
      >
        <option value="day">Theo ngày</option>
      </select>
    </div>
  </div>
);
