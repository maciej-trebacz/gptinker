import React from 'react';
import Description from '@/components/Description';
import BasePath from '@/components/BasePath';

interface OptionsProps {
  description: string;
  basePath: string;
  onDescriptionChange: (value: string) => void;
  onBasePathChange: (value: string) => void;
}

export const Options: React.FC<OptionsProps> = ({
  description,
  basePath,
  onDescriptionChange,
  onBasePathChange,
}) => {
  return (
    <div className='p-4 border border-slate-600 bg-slate-900 rounded-md mt-4'>
      <Description value={description} onChange={onDescriptionChange} />
      <BasePath value={basePath} onChange={onBasePathChange} />
    </div>
  );
};
