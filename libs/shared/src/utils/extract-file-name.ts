export const extractFilename = (originalName: string): string => {
  const underscoreIndex = originalName.indexOf('_');

  if (underscoreIndex === -1) {
    return originalName;
  }

  return originalName.slice(underscoreIndex + 1);
};
