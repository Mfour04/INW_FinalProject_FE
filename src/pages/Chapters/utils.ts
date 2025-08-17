export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function normalizeTags(raw: any[]): { id: string; label: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t, idx) => {
      if (t == null) return null;
      if (typeof t === "string") return { id: `${idx}-${t}`, label: t };
      const id = t.tagId ?? t.id ?? t.tagID ?? t._id ?? t.value ?? `${idx}`;
      const label = t.tagName ?? t.name ?? t.title ?? t.label ?? t.value ?? "";
      const safeLabel = typeof label === "string" ? label : String(label ?? "");
      return { id: String(id), label: safeLabel };
    })
    .filter((x): x is { id: string; label: string } => Boolean(x && x.label));
}
