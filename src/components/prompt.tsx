import React from 'react';

interface PromptProps {
  onSubmit: (prompt: string) => void;
  onReset: () => void;
}

export default function Prompt(props: PromptProps) {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;
    props.onSubmit(prompt);
    setPrompt('')
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='uppercase font-semibold text-gray-400 mt-4'>Prompt</h3>
      <textarea
        value={prompt}
        className="w-full p-2 border border-gray-800 rounded-md bg-gray-950 outline-gray-600"
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />
      <button type="submit" className="mt-4 w-full p-2 border border-gray-800 rounded-md bg-gray-900 hover:bg-gray-700">Submit</button>
      <button type="button" className="mt-4 w-full p-2 " onClick={() => props.onReset()}>Reset</button>
    </form>
  );
}