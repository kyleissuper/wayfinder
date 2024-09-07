import React from 'react';
import PathVisualizer from './PathVisualizer';
import MapDevelopmentVisualizer from './MapDevelopmentVisualizer';
import { LocationWithConditionalName, Path, Edge } from '../types';

interface VisualizerWrapperProps {
  locations: LocationWithConditionalName[];
  path: Path;
  currentFloor: number;
  isDevelopmentMode: boolean;
  edges: Edge[];
  onLocationsChange: (newLocations: LocationWithConditionalName[]) => void;
  onEdgesChange: (newEdges: Edge[]) => void;
}

const VisualizerWrapper: React.FC<VisualizerWrapperProps> = ({
  locations,
  path,
  currentFloor,
  isDevelopmentMode,
  edges,
  onLocationsChange,
  onEdgesChange
}) => {
  if (isDevelopmentMode) {
    return (
      <MapDevelopmentVisualizer
        locations={locations}
        path={path}
        currentFloor={currentFloor}
        edges={edges}
        onLocationsChange={onLocationsChange}
        onEdgesChange={onEdgesChange}
      />
    );
  }

  return (
    <PathVisualizer
      locations={locations}
      path={path}
      currentFloor={currentFloor}
    />
  );
};

export default VisualizerWrapper;
