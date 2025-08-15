export const formatNumber = (n?: number | string) => {
  if (n === undefined || n === null) return "0";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
  if (num >= 1_000)
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "k";
  return String(num);
};
