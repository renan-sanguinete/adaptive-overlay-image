import { clamp } from './clamp';

export function normalizeLux(
  illuminance: number,
  darkThreshold: number,
  brightThreshold: number
) {
  if (illuminance <= darkThreshold) return 0;
  if (illuminance >= brightThreshold) return 1;

  const range = brightThreshold - darkThreshold;
  if (range <= 0) return 0;

  return clamp((illuminance - darkThreshold) / range, 0, 1);
}
