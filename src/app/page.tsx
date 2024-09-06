'use client';

import { useEffect, useState, useCallback } from 'react';
import { Graph, LocationWithConditionalName, LocationType, Edge, Path } from '../types';
import { createGraph } from '../utils/graph';
import { findShortestPath } from '../utils/pathfinding';
import PathVisualizer from '../components/PathVisualizer';

export default function Home() {
  const [locations, setLocations] = useState<LocationWithConditionalName[]>([]);
  const [path, setPath] = useState<Path | null>(null);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [floors, setFloors] = useState<number[]>([]);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');

  useEffect(() => {
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

    const graph: Graph = createGraph(locations, edges);

    // Get unique floors
    const uniqueFloors = Array.from(new Set(locations.map(l => l.position.floor))).sort();

    setLocations(locations);
    setGraph(graph);
    setFloors(uniqueFloors);
    setCurrentFloor(uniqueFloors[0]);
  }, []);

  useEffect(() => {
    if (graph && startLocation && endLocation) {
      const start = graph.nodes.get(startLocation)!;
      const end = graph.nodes.get(endLocation)!;
      const pathResult = findShortestPath(graph, start, end);

      setPath(pathResult);
    }
  }, [graph, startLocation, endLocation]);

  const handleStartLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartLocationId = event.target.value;
    setStartLocation(newStartLocationId);
    const newStartLocation = locations.find(loc => loc.id === newStartLocationId);
    if (newStartLocation) {
      setCurrentFloor(newStartLocation.position.floor);
    }
  };

  const handleEndLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEndLocation(event.target.value);
  };

  const handleFloorChange = useCallback((floor: number) => {
    setCurrentFloor(floor);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pathfinding Directions</h1>
      <div className="mb-4">
        <label className="mr-2">Start Location:</label>
        <select value={startLocation} onChange={handleStartLocationChange} className="mr-4 p-2 border rounded">
          <option value="">Select start location</option>
          {locations.filter(location => location.type !== LocationType.WayPoint).map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
        <label className="mr-2">End Location:</label>
        <select value={endLocation} onChange={handleEndLocationChange} className="p-2 border rounded">
          <option value="">Select end location</option>
          {locations.filter(location => location.type !== LocationType.WayPoint).map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
      {startLocation && endLocation && (
        <>
          <div className="mb-4">
            <label className="mr-2">Floor:</label>
            {floors.map(floor => (
              <button
                key={floor}
                onClick={() => handleFloorChange(floor)}
                className={`mr-2 px-2 py-1 rounded ${currentFloor === floor ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {floor}
              </button>
            ))}
          </div>
          {path && (
            <PathVisualizer 
              locations={locations} 
              path={path} 
              currentFloor={currentFloor}
            />
          )}
        </>
      )}
    </div>
  );
}
