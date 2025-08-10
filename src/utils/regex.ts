export const stripHtmlTags = (input: string) => {
  return input.replace(/<[^>]*>/g, "");
};
