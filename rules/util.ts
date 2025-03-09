export function extractNumberPrefix(filename: string): number {
  const match = filename.match(/^\d+/);
  return match ? parseInt(match[0], 10) : 0;
}