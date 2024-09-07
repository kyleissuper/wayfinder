import React from 'react';
import { LocationWithConditionalName, Path, LocationType, Edge } from '../types';
import BaseVisualizer from './BaseVisualizer';
import LocationEditor from './LocationEditor';
import EdgeEditor from './EdgeEditor';

interface MapDevelopmentVisualizerProps {
  locations: LocationWithConditionalName[];
  path: Path;
  currentFloor: number;
  edges: Edge[];
  onLocationsChange: (newLocations: LocationWithConditionalName[]) => void;
  onEdgesChange: (newEdges: Edge[]) => void;
}

const MapDevelopmentVisualizer: React.FC<MapDevelopmentVisualizerProps> = ({ 
  locations, 
  path, 
  currentFloor,
  edges,
  onLocationsChange,
  onEdgesChange
}) => {
  const pathPoints = path.locations
    .filter(loc => loc.position.floor === currentFloor)
    .map(loc => ({ x: loc.position.x * 10, y: loc.position.y * 10 }));

  return (
    <div className="flex flex-col">
      <BaseVisualizer currentFloor={currentFloor}>
        {edges.map((edge, index) => {
          const fromLocation = locations.find(loc => loc.id === edge.from);
          const toLocation = locations.find(loc => loc.id === edge.to);
          if (fromLocation && toLocation && fromLocation.position.floor === currentFloor && toLocation.position.floor === currentFloor) {
            return (
              <line
                key={`edge-${index}`}
                x1={fromLocation.position.x * 10}
                y1={fromLocation.position.y * 10}
                x2={toLocation.position.x * 10}
                y2={toLocation.position.y * 10}
                stroke="gray"
                strokeWidth="1"
              />
            );
          }
          return null;
        })}
        <path
          d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
          fill="none"
          stroke="var(--stn-red)"
          strokeWidth="5"
          strokeDasharray="10,5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {locations.map(location => {
          if (location.position.floor === currentFloor && !location.hidden) {
            return (
              <g key={location.id}>
                <circle
                  cx={location.position.x * 10}
                  cy={location.position.y * 10}
                  r="5"
                  fill={getColorForLocationType(location.type)}
                />
                <foreignObject
                  x={location.position.x * 10 - 100}
                  y={location.position.y * 10 + 10}
                  width="200"
                  height="100">
                  <div className="text-2xl md:text-sm font-semibold break-words text-center text-black">
                    {location.name}
                  </div>
                </foreignObject>
              </g>
            );
          }
          return null;
        })}
      </BaseVisualizer>
      <div className="w-full p-4 bg-gray-100 rounded-t-lg overflow-auto" style={{ maxHeight: '600px' }}>
        <LocationEditor locations={locations} onLocationsChange={onLocationsChange} />
        <EdgeEditor edges={edges} locations={locations} onEdgesChange={onEdgesChange} />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">JSON Representation:</h3>
          <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
            {`{
  "locations": [
${locations.map(loc => {
  const { hidden, ...locWithoutHidden } = loc;
  return `    ${JSON.stringify(locWithoutHidden)}`;
}).join(',\n')}
  ],
  "edges": [
${edges.map(edge => `    ${JSON.stringify(edge)}`).join(',\n')}
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

function getColorForLocationType(type: LocationType): string {
  switch (type) {
    case LocationType.Game: return 'green';
    case LocationType.Restaurant: return 'orange';
    case LocationType.Restroom: return 'purple';
    case LocationType.Elevator: return 'yellow';
    case LocationType.Escalator: return 'pink';
    case LocationType.WayPoint: return 'gray';
    default: return 'blue';
  }
}

export default MapDevelopmentVisualizer;
