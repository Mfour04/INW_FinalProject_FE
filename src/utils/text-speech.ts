const preprocessHtml = (html: string) =>
  html
    .replace(/<p>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

export const htmlToPlainText = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(preprocessHtml(htmlString), "text/html");
  return doc.body.textContent || "";
};
