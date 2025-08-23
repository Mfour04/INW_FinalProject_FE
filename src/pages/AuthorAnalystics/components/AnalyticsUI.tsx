import React from "react";
import { BarChart3 } from "lucide-react";

export const Shell = ({ children }: React.PropsWithChildren) => (
  <div className="min-h-screen bg-[#0a0f16] text-white">
    <div
      className="fixed inset-0 -z-10 opacity-60 pointer-events-none"
      style={{
        background:
          "radial-gradient(70rem 32rem at 110% -10%, rgba(255,103,64,0.10), transparent 60%), radial-gradient(60rem 26rem at -20% 40%, rgba(120,170,255,0.10), transparent 60%)",
      }}
    />
    {children}
  </div>
);

export const Container = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`max-w-screen-2xl mx-auto px-4 md:px-6 ${className}`}>{children}</div>
);

export const Card = ({ className = "", children }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`rounded-2xl ring-1 ring-white/10 bg-white/[0.035] ${className}`}>{children}</div>
);

export const SoftInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`h-9 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 text-sm placeholder:text-white/40 outline-none ${props.className ?? ""}`}
  />
);

export const SoftSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`h-9 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 text-sm outline-none ${props.className ?? ""}`}
  />
);

export const KpiPill = ({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-4 py-3">
    <div className="h-8 w-8 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center">{icon}</div>
    <div>
      <div className="text-xs text-white/60">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  </div>
);

export const AreaChart = ({ series, yKey, height = 220 }: { series: any[]; yKey: string; height?: number }) => {
  const { dArea, dLine, ticks } = React.useMemo(() => {
    if (!series.length) return { dArea: "", dLine: "", ticks: [] as string[] };
    const w = 800, h = height, pad = 24;
    const xs = series.map((_: any, i: number) => i);
    const ys = series.map((d: any) => d[yKey] as number);
    const maxX = xs[xs.length - 1] || 1;
    const maxY = Math.max(...ys, 1);
    const sx = (i: number) => pad + (i / Math.max(1, maxX)) * (w - pad * 2);
    const sy = (v: number) => h - pad - (v / maxY) * (h - pad * 2);
    const a: (string | number)[] = ["M", sx(0), sy(ys[0])];
    const l: (string | number)[] = ["M", sx(0), sy(ys[0])];
    for (let i = 1; i < xs.length; i++) { a.push("L", sx(xs[i]), sy(ys[i])); l.push("L", sx(xs[i]), sy(ys[i])); }
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
      <g className="text-[10px] fill-white/60">
        {ticks.map((t, i) => (
          <text key={i} x={24 + (i / Math.max(1, ticks.length - 1)) * (800 - 48)} y={height - 6} textAnchor="middle">{t}</text>
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
    <div className="flex items-center gap-2 text-sm text-white/70">
      <span className="h-6 w-6 grid place-items-center rounded-md bg-white/5 ring-1 ring-white/10">
        <BarChart3 className="h-3.5 w-3.5" />
      </span>
      Chế độ hiển thị
    </div>
    <div className="flex items-center gap-2">
      <select
        value={granularity}
        onChange={(e) => onGranularity(e.target.value as any)}
        className="h-9 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 text-sm outline-none"
        title="Hiển thị theo"
      >
        <option value="day">Theo ngày</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>
    </div>
  </div>
);
