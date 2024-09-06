import { Location, Direction, LocationType } from '../types';

export function generateDirections(path: Location[]): Direction[] {
  const directions: Direction[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    directions.push({ from, to });
  }

  return directions;
}

function getFloorChangeInstruction(from: Location, to: Location): string {
  const floorDiff = to.position.floor - from.position.floor;
  const action = floorDiff > 0 ? 'up' : 'down';
  const floors = Math.abs(floorDiff);

  if (from.type === LocationType.Elevator || to.type === LocationType.Elevator) {
    return `Take the elevator ${action} ${floors} floor${floors > 1 ? 's' : ''}`;
  } else if (from.type === LocationType.Escalator || to.type === LocationType.Escalator) {
    return `Take the escalator ${action} ${floors} floor${floors > 1 ? 's' : ''}`;
  } else {
    return `Go ${action} ${floors} floor${floors > 1 ? 's' : ''} (stairs)`;
  }
}

function getDirection(dx: number, dy: number): string {
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  if (angle > -22.5 && angle <= 22.5) return 'right';
  if (angle > 22.5 && angle <= 67.5) return 'diagonally right';
  if (angle > 67.5 && angle <= 112.5) return 'straight ahead';
  if (angle > 112.5 && angle <= 157.5) return 'diagonally left';
  if (angle > 157.5 || angle <= -157.5) return 'left';
  if (angle > -157.5 && angle <= -112.5) return 'diagonally back and left';
  if (angle > -112.5 && angle <= -67.5) return 'back';
  if (angle > -67.5 && angle <= -22.5) return 'diagonally back and right';
  return 'in an unknown direction';
}
