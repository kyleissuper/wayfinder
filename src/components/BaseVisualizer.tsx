import React from 'react';

interface BaseVisualizerProps {
  currentFloor: number;
  children: React.ReactNode;
}

export const SVG_WIDTH = 675;
export const SVG_HEIGHT = 500;
export const ASPECT_RATIO = SVG_WIDTH / SVG_HEIGHT;

const BaseVisualizer: React.FC<BaseVisualizerProps> = ({ currentFloor, children }) => {
  return (
    <div className="w-full max-w-4xl" style={{ aspectRatio: ASPECT_RATIO }}>
      <svg className="w-full h-full" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
        <image
          href={currentFloor === 1 ? '/images/ground floor.svg' : '/images/fifth floor.svg'}
          width="100%"
          height="100%"
        />
        {children}
      </svg>
    </div>
  );
};

export default BaseVisualizer;
