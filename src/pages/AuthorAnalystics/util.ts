export type Granularity = "day" | "month" | "year";

export const keyByGranularity = (dateStr: string, g: Granularity) => {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  if (g === "day") return `${y}-${m}-${day}`;
  if (g === "month") return `${y}-${m}`;
  return `${y}`;
};

export const aggregateSeries = <T extends Record<string, any>>(
  arr: T[],
  xKey: string,
  yKeys: string[],
  g: Granularity
) => {
  const map = new Map<string, Record<string, number>>();
  for (const it of arr) {
    const k = keyByGranularity(it[xKey], g);
    if (!map.has(k)) map.set(k, Object.fromEntries(yKeys.map((k) => [k, 0])));
    const acc = map.get(k)!;
    for (const y of yKeys) acc[y] += Number(it[y] ?? 0);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([ts, vals]) => ({ ts, ...vals }));
};

export const maskId = (id: string) =>
  id.length <= 4 ? id : id.slice(0, 2) + "***" + id.slice(-2);
export const fmt = (ts: string) =>
  new Date(ts).toLocaleString("vi-VN", { hour12: false });

export const renderRange = (from?: string, to?: string) =>
  !from && !to
    ? "Tất cả thời gian"
    : from && to
    ? `${from} → ${to}`
    : from
    ? `${from} → hiện tại`
    : `đến ${to}`;
