function pad2(n: number) {
  return String(n).padStart(2, "0");
}
export function formatHumanDate(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
