import { Location, Direction } from '../types';

export function generateDirections(path: Location[]): Direction[] {
  const directions: Direction[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    directions.push({ from, to });
  }

  return directions;
}
