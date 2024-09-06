import { Graph, Location, Path } from '../types';
import { getNeighbors, calculateDistance } from './graph';

export function findShortestPath(graph: Graph, start: Location, end: Location): Path {
  const distances = new Map<string, number>();
  const previousNodes = new Map<string, string>();
  const unvisited = new Set<string>(graph.nodes.keys());

  distances.set(start.id, 0);

  while (unvisited.size > 0) {
    const current = getClosestUnvisited(unvisited, distances);
    if (current === end.id) break;

    unvisited.delete(current);

    const neighbors = getNeighbors(graph, current);
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.id)) continue;

      const distance = distances.get(current)! + calculateDistance(graph.nodes.get(current)!.position, neighbor.position);
      if (distance < (distances.get(neighbor.id) || Infinity)) {
        distances.set(neighbor.id, distance);
        previousNodes.set(neighbor.id, current);
      }
    }
  }

  return reconstructPath(graph, start, end, previousNodes, distances.get(end.id) || Infinity);
}

function getClosestUnvisited(unvisited: Set<string>, distances: Map<string, number>): string {
  let closest: string | null = null;
  let minDistance = Infinity;

  for (const id of unvisited) {
    const distance = distances.get(id) || Infinity;
    if (distance < minDistance) {
      closest = id;
      minDistance = distance;
    }
  }

  return closest!;
}

function reconstructPath(graph: Graph, start: Location, end: Location, previousNodes: Map<string, string>, totalDistance: number): Path {
  const path: Location[] = [end];
  let current = end.id;

  while (current !== start.id) {
    current = previousNodes.get(current)!;
    path.unshift(graph.nodes.get(current)!);
  }

  return { locations: path, totalDistance };
}
