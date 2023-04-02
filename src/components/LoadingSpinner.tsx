// components/LoadingSpinner.js
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="mt-4 flex justify-center items-center h-full w-full">
      <div className="w-9 h-9 border-4 border-gray-300 border-solid rounded-full border-l-[#09f] animate-spin"></div>
    </div>
  );
};
