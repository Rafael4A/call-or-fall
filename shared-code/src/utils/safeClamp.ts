export function safeClamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value || 0, max));
}
