import React from 'react';

interface SuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, onSelectSuggestion }) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="p-2 border border-gray-800 rounded-md bg-gray-900 hover:bg-gray-700"
          onClick={() => onSelectSuggestion(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
