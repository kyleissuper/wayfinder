import React from 'react';
import { LocationWithConditionalName, LocationType } from '../types';

interface LocationEditorProps {
  locations: LocationWithConditionalName[];
  onLocationsChange: (newLocations: LocationWithConditionalName[]) => void;
}

const LocationEditor: React.FC<LocationEditorProps> = ({ locations, onLocationsChange }) => {
  const addLocation = () => {
    const newLocation: LocationWithConditionalName = {
      id: `location-${Date.now()}`,
      name: '',
      type: LocationType.Other,
      position: { x: 0, y: 0, floor: 1 },
    };
    onLocationsChange([...locations, newLocation]);
  };

  const updateLocation = (index: number, updatedLocation: LocationWithConditionalName) => {
    const newLocations = [...locations];
    newLocations[index] = updatedLocation;
    onLocationsChange(newLocations);
  };

  const removeLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    onLocationsChange(newLocations);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Locations:</h3>
      {locations.map((location, index) => (
        <div key={location.id} className="mb-2 p-2 border rounded">
          <input
            type="text"
            value={location.id}
            onChange={(e) => updateLocation(index, { ...location, id: e.target.value })}
            placeholder="ID"
            className="mb-1 p-1 border rounded w-full"
          />
          {location.type !== LocationType.WayPoint && (
            <input
              type="text"
              value={location.name}
              onChange={(e) => updateLocation(index, { ...location, name: e.target.value })}
              placeholder="Name"
              className="mb-1 p-1 border rounded w-full"
            />
          )}
          <select
            value={location.type}
            onChange={(e) => {
              const newType = e.target.value as LocationType;
              let updatedLocation: LocationWithConditionalName;
              if (newType === LocationType.WayPoint) {
                updatedLocation = {
                  id: location.id,
                  type: LocationType.WayPoint,
                  position: location.position,
                  hidden: location.hidden
                };
              } else {
                updatedLocation = {
                  ...location,
                  type: newType as Exclude<LocationType, LocationType.WayPoint>,
                  name: 'name' in location && location.name ? location.name : 'New Location'
                };
              }
              updateLocation(index, updatedLocation);
            }}
            className="mb-1 p-1 border rounded w-full"
          >
            {Object.values(LocationType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div>
            X: <input
              type="number"
              value={location.position.x}
              onChange={(e) => updateLocation(index, { ...location, position: { ...location.position, x: Number(e.target.value) } })}
              className="w-16 p-1 border rounded"
            />
            Y: <input
              type="number"
              value={location.position.y}
              onChange={(e) => updateLocation(index, { ...location, position: { ...location.position, y: Number(e.target.value) } })}
              className="w-16 p-1 border rounded"
            />
            Floor: <input
              type="number"
              value={location.position.floor}
              onChange={(e) => updateLocation(index, { ...location, position: { ...location.position, floor: Number(e.target.value) } })}
              className="w-16 p-1 border rounded"
            />
          </div>
          <div className="flex items-center mt-1">
            <label className="flex items-center mr-2">
              <input
                type="checkbox"
                checked={!location.hidden}
                onChange={(e) => updateLocation(index, { ...location, hidden: !e.target.checked })}
                className="mr-1"
              />
              Visible
            </label>
            <button onClick={() => removeLocation(index)} className="p-1 bg-red-500 text-white rounded">Remove</button>
          </div>
        </div>
      ))}
      <button onClick={addLocation} className="mt-2 p-2 bg-blue-500 text-white rounded">Add Location</button>
    </div>
  );
};

export default LocationEditor;
