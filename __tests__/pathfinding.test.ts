import { Graph, Location, LocationType, Point, Edge } from '../src/types';
import { createGraph, addLocation, addEdge } from '../src/utils/graph';
import { findShortestPath } from '../src/utils/pathfinding';
import { generateDirections } from '../src/utils/directions';

describe('Pathfinding and Directions', () => {
  let graph: Graph;

  beforeAll(() => {
    // Create a sample graph
    const locations: Location[] = [
      { id: 'parking', name: 'Parking Lot', type: LocationType.Other, position: { x: 0, y: 0, floor: 0 } },
      { id: 'entrance', name: 'Main Entrance', type: LocationType.Other, position: { x: 10, y: 0, floor: 0 } },
      { id: 'elevator', name: 'Elevator', type: LocationType.Elevator, position: { x: 15, y: 5, floor: 0 } },
      { id: 'elevator_f1', name: 'Elevator', type: LocationType.Elevator, position: { x: 15, y: 5, floor: 1 } },
      { id: 'hallway', name: 'Hallway', type: LocationType.Other, position: { x: 20, y: 5, floor: 1 } },
      { id: 'gym', name: 'Gym', type: LocationType.Other, position: { x: 25, y: 10, floor: 1 } },
    ];

    const edges: Edge[] = [
      { from: 'parking', to: 'entrance', weight: 10 },
      { from: 'entrance', to: 'elevator', weight: 7.07 },
      { from: 'elevator', to: 'elevator_f1', weight: 1 },
      { from: 'elevator_f1', to: 'hallway', weight: 5 },
      { from: 'hallway', to: 'gym', weight: 7.07 },
    ];

    graph = createGraph(locations, edges);
  });

  test('should find path from parking to gym', () => {
    const start = graph.nodes.get('parking')!;
    const end = graph.nodes.get('gym')!;

    const path = findShortestPath(graph, start, end);

    expect(path.locations.map(loc => loc.id)).toEqual([
      'parking',
      'entrance',
      'elevator',
      'elevator_f1',
      'hallway',
      'gym'
    ]);
  });

  test('should generate directions from parking to gym', () => {
    const start = graph.nodes.get('parking')!;
    const end = graph.nodes.get('gym')!;

    const path = findShortestPath(graph, start, end);
    const directions = generateDirections(path.locations);

    expect(directions).toHaveLength(5);
    expect(directions[0].instruction).toContain('towards Main Entrance');
    expect(directions[1].instruction).toContain('towards Elevator');
    expect(directions[2].instruction).toContain('Take the elevator up');
    expect(directions[3].instruction).toContain('towards Hallway');
    expect(directions[4].instruction).toContain('towards Gym');
  });
});
