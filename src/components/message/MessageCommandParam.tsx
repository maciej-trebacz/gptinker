import React from 'react';

export function MessageCommandParam({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 pl-2 flex">
      <div className="text-xs text-gray-500 font-semibold mr-2 w-20 text-right flex-shrink-0">
        {label}
      </div>
      <div className="overflow-scroll max-h-[400px]">
        <div className="text-xs text-gray-200 font-mono whitespace-pre">{children}</div>
      </div>
    </div>
  );
}
