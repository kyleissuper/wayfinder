import React from 'react';

interface FloorSelectorProps {
  floors: number[];
  currentFloor: number;
  nextConnectedFloor: number | null;
  onFloorChange: (floor: number) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ floors, currentFloor, nextConnectedFloor, onFloorChange }) => {
  const sortedFloors = [...floors].sort((a, b) => b - a); // Sort floors in descending order

  return (
    <div className="absolute left-4 md:left-1/2 top-1/2 transform md:-translate-x-[21rem] -translate-y-1/2 bg-white shadow-lg rounded-full p-2">
      <div className="flex flex-col items-center space-y-2">
        {sortedFloors.map((floor) => (
          <div key={floor} className="relative">
            <button
              onClick={() => onFloorChange(floor)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors relative z-10
                ${currentFloor === floor 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {floor}
            </button>
            {nextConnectedFloor === floor && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping pointer-events-none"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorSelector;
