import React from 'react';
import { motion } from 'framer-motion';
import { Location, Path, LocationType } from '../types';

interface PathVisualizerProps {
  locations: Location[];
  path: Path;
  currentFloor: number;
}

const PathVisualizer: React.FC<PathVisualizerProps> = ({ locations, path, currentFloor }) => {
  const canvasWidth = 675;
  const canvasHeight = 500;

  const pathPoints = path.locations
    .filter(loc => loc.position.floor === currentFloor)
    .map(loc => ({ x: loc.position.x * 10, y: loc.position.y * 10 }));

  return (
    <svg width={canvasWidth} height={canvasHeight}>
      <image
        href={currentFloor === 1 ? '/images/ground floor.svg' : '/images/fifth floor.svg'}
        width={canvasWidth}
        height={canvasHeight}
      />
      {locations.map(location => {
        if (location.position.floor === currentFloor && location.type !== LocationType.WayPoint) {
          return (
            <g key={location.id}>
              <circle
                cx={location.position.x * 10}
                cy={location.position.y * 10}
                r="5"
                fill="blue"
              />
              <foreignObject
                x={location.position.x * 10 + 10}
                y={location.position.y * 10 - 10}
                width="100"
                height="40"
              >
                <div style={{ fontSize: '14px', wordWrap: 'break-word' }}>
                  {location.name}
                </div>
              </foreignObject>
            </g>
          );
        }
        return null;
      })}
      <motion.path
        d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
        fill="none"
        stroke="red"
        strokeWidth="3"
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
    </svg>
  );
};

export default PathVisualizer;
