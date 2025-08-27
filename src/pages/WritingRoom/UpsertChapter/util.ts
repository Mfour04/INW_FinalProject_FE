function pad2(n: number) {
  return String(n).padStart(2, "0");
}
export function formatHumanDate(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export const pct = (x: number) => Math.round(x * 100);
export const badge = (s: number) =>
  s >= 0.8
    ? "bg-red-50 text-red-700 ring-red-200"
    : s >= 0.6
    ? "bg-orange-50 text-orange-700 ring-orange-200"
    : s >= 0.4
    ? "bg-amber-50 text-amber-700 ring-amber-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
