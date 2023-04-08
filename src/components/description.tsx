import React from 'react';
import Textarea from './forms/Textarea';

interface DescriptionProps {
  value: string;
  onChange: (description: string) => void;
}

export default function Description(props: DescriptionProps) {
  return (
    <>
      <h3 className='uppercase font-semibold text-gray-400'>Description</h3>
      <Textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </>
  );
}
