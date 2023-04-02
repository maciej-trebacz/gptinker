import React from 'react';

interface MessageProps {
  message: string;
  type: string;
}

export default function Message(props: MessageProps) {
  return (
    <div className="mt-4 p-2 border border-gray-800 rounded-md bg-gray-900 whitespace-pre-wrap">
      <div className="uppercase font-bold text-sm text-gray-500 mb-2">{props.type}</div>
      {props.message}
    </div>
  );
}