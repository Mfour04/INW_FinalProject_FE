export const urlToFile = async (imageUrl: string, filename = 'image.jpg'): Promise<File> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Extract MIME type from blob
  const mimeType = blob.type || 'image/jpeg';

  return new File([blob], filename, { type: mimeType });
};