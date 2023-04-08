import React from 'react';

interface BasePathProps {
  value: string;
  onChange: (basePath: string) => void;
}

export default function BasePath(props: BasePathProps) {
  return (
    <div className="mt-4">
      <h3 className="uppercase font-semibold text-gray-400">Base Path</h3>
      <input
        type="text"
        id="basePath"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full p-2 border border-gray-800 rounded-md bg-gray-950 outline-gray-600"
      />
    </div>
  );
}
