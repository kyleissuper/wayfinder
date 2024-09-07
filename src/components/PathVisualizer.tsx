import React from 'react';
import { motion } from 'framer-motion';
import { LocationWithConditionalName, Path, LocationType } from '../types';
import BaseVisualizer, { SVG_WIDTH, SVG_HEIGHT } from './BaseVisualizer';

interface PathVisualizerProps {
  locations: LocationWithConditionalName[];
  path: Path;
  currentFloor: number;
}

const PathVisualizer: React.FC<PathVisualizerProps> = ({ locations, path, currentFloor }) => {
  const pathPoints = path.locations
    .filter(loc => loc.position.floor === currentFloor)
    .map(loc => ({ x: loc.position.x * 10, y: loc.position.y * 10 }));

  return (
    <BaseVisualizer currentFloor={currentFloor}>
      <motion.path
        d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
        fill="none"
        stroke="var(--stn-red)"
        strokeWidth="5"
        strokeDasharray="10,5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{ 
          pathLength: [0, 1, 1],
          pathOffset: [0, 0, 1]
        }}
        transition={{ 
          duration: 4, 
          times: [0, 0.4, 1],
          ease: "easeInOut", 
          repeat: Infinity 
        }}
      />
      {locations.map(location => {
        if (location.position.floor === currentFloor && location.type !== LocationType.WayPoint && path.locations.some(pathLoc => pathLoc.id === location.id)) {
          return (
            <g key={location.id}>
              <circle
                cx={location.position.x * 10}
                cy={location.position.y * 10}
                r="5"
                fill="blue"
              />
              <foreignObject
                x={location.position.x * 10 - 100}
                y={location.position.y * 10 + 10}
                width="200"
                height="100"
              >
                <div className="text-2xl md:text-sm font-semibold break-words text-center">
                  {location.name}
                </div>
              </foreignObject>
            </g>
          );
        }
        return null;
      })}
    </BaseVisualizer>
  );
};

export default PathVisualizer;
