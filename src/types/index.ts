export interface Point {
  x: number;
  y: number;
  floor: number;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  position: Point;
}

export enum LocationType {
  Game = 'game',
  Restaurant = 'restaurant',
  Restroom = 'restroom',
  Elevator = 'elevator',
  Escalator = 'escalator',
  Other = 'other',
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface Graph {
  nodes: Map<string, Location>;
  edges: Edge[];
}

export interface Path {
  locations: Location[];
  totalDistance: number;
}

export interface Direction {
  from: Location;
  to: Location;
  instruction: string;
}
