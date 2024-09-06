import { Graph, Location, Edge, Point } from '../types';

export function createGraph(locations: Location[], edges: Edge[]): Graph {
  const nodes = new Map<string, Location>();
  locations.forEach(location => nodes.set(location.id, location));
  return { nodes, edges };
}

export function addLocation(graph: Graph, location: Location): void {
  graph.nodes.set(location.id, location);
}

export function addEdge(graph: Graph, edge: Edge): void {
  graph.edges.push(edge);
}

export function getNeighbors(graph: Graph, locationId: string): Location[] {
  return graph.edges
    .filter(edge => edge.from === locationId || edge.to === locationId)
    .map(edge => {
      const neighborId = edge.from === locationId ? edge.to : edge.from;
      const neighbor = graph.nodes.get(neighborId);
      if (!neighbor) {
        throw new Error(`Neighbor with id ${neighborId} not found in graph`);
      }
      return neighbor;
    });
}

export function calculateDistance(a: Point, b: Point): number {
  if (a.floor !== b.floor) {
    // Add a large penalty for floor changes
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
