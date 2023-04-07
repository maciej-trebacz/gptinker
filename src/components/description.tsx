import React from "react";

interface DescriptionProps {
  value: string;
  onChange: (description: string) => void;
}

export default function Description(props: DescriptionProps) {
  return (
    <div className="mt-4">
      <h3 className="uppercase font-semibold text-gray-400">Description</h3>
      <textarea
        className="w-full p-2 border border-gray-800 rounded-md bg-gray-950 outline-gray-600"
        rows={3}
        onChange={(e) => props.onChange(e.target.value)}
        defaultValue={props.value}
      />
    </div>
  );
}