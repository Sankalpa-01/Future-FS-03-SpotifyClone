import React from "react";

const MusicMap = ({ countries, onSelect }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Select a Country:</h2>
      <ul className="grid grid-cols-2 gap-2 mt-4">
        {countries.map((code) => (
          <li key={code}>
            <button
              onClick={() => onSelect(code)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {code}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicMap;
