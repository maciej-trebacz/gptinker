import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export default function Textarea(props: TextareaProps) {
  const { value, onChange, rows = 3 } = props;

  return (
    <textarea
      value={value}
      className="w-full p-2 border border-gray-800 rounded-md bg-gray-950 outline-gray-600"
      onChange={onChange}
      rows={rows}
    />
  );
}
