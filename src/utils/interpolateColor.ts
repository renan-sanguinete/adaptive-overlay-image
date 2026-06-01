import { clamp } from './clamp';

function hexToRgb(hexColor: string) {
  const normalized = hexColor.replace('#', '');
  const value = normalized.length === 3
    ? normalized
        .split('')
        .map((part) => part + part)
        .join('')
    : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return { red, green, blue };
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((component) => component.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function interpolateColor(
  progress: number,
  startColor: string,
  endColor: string
) {
  const normalizedProgress = clamp(progress, 0, 1);
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  const red = Math.round(start.red + (end.red - start.red) * normalizedProgress);
  const green = Math.round(
    start.green + (end.green - start.green) * normalizedProgress
  );
  const blue = Math.round(
    start.blue + (end.blue - start.blue) * normalizedProgress
  );

  return rgbToHex(red, green, blue);
}
