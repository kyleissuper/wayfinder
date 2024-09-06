import { Graph, Location, Path } from '../types';
import { getNeighbors, calculateDistance } from './graph';

class PriorityQueue {
  private queue: [string, number][] = [];

  enqueue(id: string, priority: number) {
    this.queue.push([id, priority]);
    this.queue.sort((a, b) => a[1] - b[1]);
  }

  dequeue(): string | undefined {
    return this.queue.shift()?.[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

export function findShortestPath(graph: Graph, start: Location, end: Location): Path {
  const distances = new Map<string, number>();
  const previousNodes = new Map<string, string>();
  const pq = new PriorityQueue();

  graph.nodes.forEach((_, id) => {
    distances.set(id, id === start.id ? 0 : Infinity);
    pq.enqueue(id, distances.get(id)!);
  });

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    if (current === end.id) break;

    const neighbors = getNeighbors(graph, current);
    for (const neighbor of neighbors) {
      const distance = distances.get(current)! + calculateDistance(graph.nodes.get(current)!.position, neighbor.position);
      if (distance < distances.get(neighbor.id)!) {
        distances.set(neighbor.id, distance);
        previousNodes.set(neighbor.id, current);
        pq.enqueue(neighbor.id, distance);
      }
    }
  }

  return reconstructPath(graph, start, end, previousNodes, distances.get(end.id)!);
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
