export const autoPaginate = (width: number, lineLength: number): number => {
  const defaultFontSize = 16;
  width = width / defaultFontSize;
  return (width >= lineLength) ? Math.floor(width / lineLength) : 1;
}