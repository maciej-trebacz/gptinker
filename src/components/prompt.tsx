import React from 'react';

interface PromptProps {
  onSubmit: (value: string) => void;
}

export default function Prompt(props: PromptProps) {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit(value);
    setValue('')
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={value}
        className="w-full p-2 border border-gray-800 rounded-md bg-gray-950"
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />
      <button type="submit" className="w-full p-2 border border-gray-800 rounded-md bg-gray-900 hover:bg-gray-700">Submit</button>
    </form>
  );
}