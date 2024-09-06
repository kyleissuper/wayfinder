import { Graph, LocationWithConditionalName, LocationType, Edge, Path } from '../src/types';
import { createGraph } from '../src/utils/graph';
import { findShortestPath } from '../src/utils/pathfinding';
import { generateDirections } from '../src/utils/directions';

describe('Pathfinding and Directions', () => {
  let graph: Graph;

  beforeAll(() => {
    // Create a sample graph
    const locations: LocationWithConditionalName[] = [
      { id: 'parking-1', name: 'Surface Parking (L1)', type: LocationType.Other, position: { x: 48, y: 6, floor: 1 }},
      { id: 'wp-1', type: LocationType.WayPoint, position: { x: 42, y: 15, floor: 1 }},
      { id: 'escalator-1', name: 'Escalator (L1)', type: LocationType.Escalator, position: { x: 55.5, y: 29, floor: 1 }},
      { id: 'escalator-2', name: 'Escalator (L5)', type: LocationType.Escalator, position: { x: 55.5, y: 29, floor: 5 }},
      { id: 'wp-2', type: LocationType.WayPoint, position: { x: 52, y: 27, floor: 5 }},
      { id: 'wp-3', type: LocationType.WayPoint, position: { x: 54, y: 22.5, floor: 5 }},
      { id: 'wp-6', type: LocationType.WayPoint, position: { x: 54, y: 18.5, floor: 5 }},
      { id: 'wp-4', type: LocationType.WayPoint, position: { x: 36, y: 18.5, floor: 5 }},
      { id: 'wp-5', type: LocationType.WayPoint, position: { x: 32.4, y: 17, floor: 5 }},
      { id: 'terrace', name: 'Red Rock Terrace (L5)', type: LocationType.Other, position: { x: 27, y: 17.5, floor: 5 }},
    ];

    const edges: Edge[] = [
      { from: 'parking-1', to: 'wp-1', weight: 5 },
      { from: 'wp-1', to: 'escalator-1', weight: 10 },
      { from: 'escalator-1', to: 'escalator-2', weight: 1 },
      { from: 'escalator-2', to: 'wp-2', weight: 1 },
      { from: 'wp-2', to: 'wp-3', weight: 1 },
      { from: 'wp-3', to: 'wp-6', weight: 1 },
      { from: 'wp-6', to: 'wp-4', weight: 1 },
      { from: 'wp-4', to: 'wp-5', weight: 1 },
      { from: 'wp-5', to: 'terrace', weight: 1 },
    ];

    graph = createGraph(locations, edges);
  });

  test('should find path from escalator to terrace', () => {
    const start = graph.nodes.get('escalator-2')!;
    const end = graph.nodes.get('terrace')!;

    const path = findShortestPath(graph, start, end);

    const expectedPath: Path = {
      locations: [
        { id: 'escalator-2', name: 'Escalator (L5)', type: LocationType.Escalator, position: { x: 55.5, y: 29, floor: 5 } },
        { id: 'wp-2', type: LocationType.WayPoint, position: { x: 52, y: 27, floor: 5 } },
        { id: 'wp-3', type: LocationType.WayPoint, position: { x: 54, y: 22.5, floor: 5 } },
        { id: 'wp-6', type: LocationType.WayPoint, position: { x: 54, y: 18.5, floor: 5 } },
        { id: 'wp-4', type: LocationType.WayPoint, position: { x: 36, y: 18.5, floor: 5 } },
        { id: 'wp-5', type: LocationType.WayPoint, position: { x: 32.4, y: 17, floor: 5 } },
        { id: 'terrace', name: 'Red Rock Terrace (L5)', type: LocationType.Other, position: { x: 27, y: 17.5, floor: 5 } }
      ],
      totalDistance: 6
    };

    expect(path).toEqual(expectedPath);
  });
});
