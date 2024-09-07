export interface Point {
  x: number;
  y: number;
  floor: number;
}

export interface Location {
  id: string;
  name?: string;
  type: LocationType;
  position: Point;
  hidden?: boolean;
}

export type NamedLocation = Location & {
  name: string;
}

export type LocationWithConditionalName = 
  | (Omit<Location, 'type'> & { type: LocationType.WayPoint })
  | (Omit<Location, 'type' | 'name'> & { type: Exclude<LocationType, LocationType.WayPoint>, name: string });

export enum LocationType {
  Game = 'game',
  Restaurant = 'restaurant',
  Restroom = 'restroom',
  Elevator = 'elevator',
  Escalator = 'escalator',
  Other = 'other',
  WayPoint = 'waypoint'
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
}
