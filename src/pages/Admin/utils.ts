export const truncateContent = (
  content: string,
  maxLength: number = 20
): string => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};
