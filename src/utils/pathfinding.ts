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

    try {
      const neighbors = getNeighbors(graph, current);
      for (const neighbor of neighbors) {
        const edge = graph.edges.find(e => (e.from === current && e.to === neighbor.id) || (e.to === current && e.from === neighbor.id));
        const currentNode = graph.nodes.get(current);
        if (!currentNode) {
          throw new Error(`Node with id ${current} not found in graph`);
        }
        const distance = distances.get(current)! + (edge ? edge.weight : calculateDistance(currentNode.position, neighbor.position));
        if (distance < distances.get(neighbor.id)!) {
          distances.set(neighbor.id, distance);
          previousNodes.set(neighbor.id, current);
          pq.enqueue(neighbor.id, distance);
        }
      }
    } catch (error) {
      console.error(`Error processing node ${current}:`, error);
      continue;
    }
  }

  return reconstructPath(graph, start, end, previousNodes, distances.get(end.id)!);
}

function reconstructPath(graph: Graph, start: Location, end: Location, previousNodes: Map<string, string>, totalDistance: number): Path {
  const path: Location[] = [];
  let current = end.id;

  while (current !== undefined && current !== start.id) {
    path.unshift(graph.nodes.get(current)!);
    current = previousNodes.get(current)!;
  }
  path.unshift(start);

  return { locations: path, totalDistance };
}
