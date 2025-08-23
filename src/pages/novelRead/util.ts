export const fillTrack = (value: number, min: number, max: number) => {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background:
      `linear-gradient(90deg,#ff512f 0%,#ff9966 100%) 0 / ${pct}% 100% no-repeat, ` +
      `linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.18)) 0 / 100% 100% no-repeat`,
  } as React.CSSProperties;
};

export const isProbablyHTML = (input?: string) => {
  if (!input) return false;
  const s = input.trim();
  if (!s.includes("<") || !s.includes(">")) return false;
  const tagLike = /<\s*\/?\s*[a-zA-Z][^>]*>/; // generic tag
  const knownTag =
    /<\s*(p|div|h[1-6]|ul|ol|li|br|img|strong|em|span|a|blockquote|pre|code|table)\b/i;
  return tagLike.test(s) && knownTag.test(s);
};

export const renderTextWithNewlines = (text: string) => {
  if (!text) return "";

  return text
    .replace(/\r/g, "")
    .split(/\n+/)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const indent = "&nbsp;&nbsp;&nbsp;&nbsp;";
      return `<p>${indent}${line} </p>`;
    })
    .join("");
};
