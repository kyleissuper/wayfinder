import React from 'react';
import { Edge, Location } from '../types';

interface EdgeEditorProps {
  edges: Edge[];
  locations: Location[];
  onEdgesChange: (newEdges: Edge[]) => void;
}

const EdgeEditor: React.FC<EdgeEditorProps> = ({ edges, locations, onEdgesChange }) => {
  const addEdge = () => {
    const newEdge: Edge = {
      from: '',
      to: '',
      weight: 1,
    };
    onEdgesChange([...edges, newEdge]);
  };

  const updateEdge = (index: number, updatedEdge: Edge) => {
    const newEdges = [...edges];
    newEdges[index] = updatedEdge;
    onEdgesChange(newEdges);
  };

  const removeEdge = (index: number) => {
    const newEdges = edges.filter((_, i) => i !== index);
    onEdgesChange(newEdges);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Edges:</h3>
      {edges.map((edge, index) => (
        <div key={index} className="mb-2 p-2 border rounded">
          <select
            value={edge.from}
            onChange={(e) => updateEdge(index, { ...edge, from: e.target.value })}
            className="mb-1 p-1 border rounded"
          >
            <option value="">Select From</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name || loc.id}
              </option>
            ))}
          </select>
          <select
            value={edge.to}
            onChange={(e) => updateEdge(index, { ...edge, to: e.target.value })}
            className="mb-1 ml-1 p-1 border rounded"
          >
            <option value="">Select To</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name || loc.id}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={edge.weight}
            onChange={(e) => updateEdge(index, { ...edge, weight: Number(e.target.value) })}
            placeholder="Weight"
            className="mb-1 ml-1 p-1 border rounded w-20"
          />
          <button onClick={() => removeEdge(index)} className="ml-2 p-1 bg-red-500 text-white rounded">Remove</button>
        </div>
      ))}
      <button onClick={addEdge} className="mt-2 p-2 bg-blue-500 text-white rounded">Add Edge</button>
    </div>
  );
};

export default EdgeEditor;
