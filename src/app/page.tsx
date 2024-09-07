'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Graph, LocationWithConditionalName, LocationType, Edge, Path } from '../types';
import { createGraph } from '../utils/graph';
import { findShortestPath } from '../utils/pathfinding';
import VisualizerWrapper from '../components/VisualizerWrapper';
import LocationSelector from '../components/LocationSelector';
import FloorSelector from '../components/FloorSelector';
import initialGraphData from '../data/graphData.json';

const useGraph = () => {
  const [graphData, setGraphData] = useState<{
    locations: LocationWithConditionalName[];
    edges: Edge[];
  }>(() => ({
    locations: initialGraphData.locations.map(location => {
      const baseLocation = {
        ...location,
        type: location.type as LocationType
      };
      if ('name' in location) {
        return baseLocation as LocationWithConditionalName;
      }
      return {
        ...baseLocation,
        type: location.type as Exclude<LocationType, LocationType.WayPoint>
      } as LocationWithConditionalName;
    }),
    edges: initialGraphData.edges
  }));

  const updateGraph = useCallback((newLocations: LocationWithConditionalName[], newEdges: Edge[]) => {
    setGraphData(prevData => {
      if (JSON.stringify(prevData) === JSON.stringify({ locations: newLocations, edges: newEdges })) {
        return prevData;
      }
      return { locations: newLocations, edges: newEdges };
    });
  }, []);

  return { graphData, updateGraph };
};

export default function Home() {
  const { graphData, updateGraph } = useGraph();
  const [locations, setLocations] = useState<LocationWithConditionalName[]>([]);
  const [path, setPath] = useState<Path | null>(null);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [floors, setFloors] = useState<number[]>([]);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [nextConnectedFloor, setNextConnectedFloor] = useState<number | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState<boolean>(false);
  const keySequence = useRef<string[]>([]);

  useEffect(() => {
    const { locations: newLocations, edges: newEdges } = graphData;
    const newGraph: Graph = createGraph(newLocations, newEdges);

    // Get unique floors and sort them in descending order
    const uniqueFloors = Array.from(new Set(newLocations.map(l => l.position.floor))).sort((a, b) => b - a);

    setLocations(newLocations);
    setGraph(newGraph);
    setEdges(newEdges);
    setFloors(uniqueFloors);
    setCurrentFloor(uniqueFloors[0]); // Set to the highest floor
  }, [graphData]);

  useEffect(() => {
    if (graph && startLocation && endLocation) {
      const start = graph.nodes.get(startLocation)!;
      const end = graph.nodes.get(endLocation)!;
      const pathResult = findShortestPath(graph, start, end);

      setPath(pathResult);
      setCurrentFloor(start.position.floor);
    }
  }, [graph, startLocation, endLocation]);

  const handleStartLocationChange = useCallback((locationId: string) => {
    setStartLocation(locationId);
    const newStartLocation = locations.find(loc => loc.id === locationId);
    if (newStartLocation) {
      setCurrentFloor(newStartLocation.position.floor);
    }
  }, [locations, setCurrentFloor]);

  const handleEndLocationChange = useCallback((locationId: string) => {
    setEndLocation(locationId);
  }, []);

  const handleFloorChange = useCallback((floor: number) => {
    setCurrentFloor(floor);
  }, []);

  const handleLocationsChange = useCallback((newLocations: LocationWithConditionalName[]) => {
    setLocations(newLocations);
    updateGraph(newLocations, edges);
  }, [edges, updateGraph]);

  const handleEdgesChange = useCallback((newEdges: Edge[]) => {
    setEdges(newEdges);
    updateGraph(locations, newEdges);
  }, [locations, updateGraph]);

  const determineNextConnectedFloor = useCallback(() => {
    if (!path) return null;
    const currentFloorIndex = path.locations.findIndex(loc => loc.position.floor === currentFloor);
    if (currentFloorIndex === -1 || currentFloorIndex === path.locations.length - 1) return null;
    
    for (let i = currentFloorIndex + 1; i < path.locations.length; i++) {
      if (path.locations[i].position.floor !== currentFloor) {
        return path.locations[i].position.floor;
      }
    }
    return null;
  }, [path, currentFloor]);

  useEffect(() => {
    setNextConnectedFloor(determineNextConnectedFloor());
  }, [path, currentFloor, determineNextConnectedFloor]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      keySequence.current = [...keySequence.current, event.key].slice(-4);
      if (keySequence.current.join('') === 'devx') {
        setIsDevelopmentMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDevelopmentMode]);

  return (
    <div>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">WAYFINDER</h1>
        <LocationSelector
          locations={locations.filter(location => location.type !== LocationType.WayPoint)}
          onStartLocationChange={handleStartLocationChange}
          onEndLocationChange={handleEndLocationChange}
        />
      </div>
      {startLocation && endLocation && (
        <>
          {path && (
            <VisualizerWrapper
              locations={locations}
              path={path}
              currentFloor={currentFloor}
              isDevelopmentMode={isDevelopmentMode}
              edges={edges}
              onLocationsChange={handleLocationsChange}
              onEdgesChange={handleEdgesChange}
            />
          )}
          <FloorSelector
            floors={floors}
            currentFloor={currentFloor}
            nextConnectedFloor={nextConnectedFloor}
            onFloorChange={handleFloorChange}
          />
        </>
      )}
    </div>
  );
}
