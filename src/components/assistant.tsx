import React from 'react';
import Loading from '@/components/Loading';
import Prompt from '@/components/Prompt';
import Message from '@/components/message/Message';
import Description from '@/components/Description';
import BasePath from '@/components/BasePath';
import Suggestions from '@/components/Suggestions';
import { useAssistant } from '@/hooks/useAssistant';
import CollapsableSection from '@/components/CollapsableSection';

interface AssistantProps {
  description: string;
  basePath: string;
}

export default function Assistant(props: AssistantProps) {
  const { loading, ask, conversationItems, reset } = useAssistant();
  const [description, setDescription] = React.useState(props.description || '');
  const [basePath, setBasePath] = React.useState(props.basePath || '');
  const suggestions = conversationItems[conversationItems.length - 1]?.options;

  return (
    <>
      <CollapsableSection title="Options"> 
      <div className="p-4 border border-slate-600 bg-slate-900 rounded-md mt-4">
        <Description
          value={description}
          onChange={(value) => setDescription(value)}
        />
        <BasePath
          value={basePath}
          onChange={(value) => setBasePath(value)}
        />
      </div>
      </CollapsableSection>
      {conversationItems.map((item, index) => (
        <Message key={index} {...item} />
      ))}

      {suggestions && (
        <Suggestions suggestions={suggestions} onSelectSuggestion={(suggestion) => ask(description, suggestion, basePath)} />
      )}

      {!loading ? (
        <Prompt onSubmit={(prompt) => ask(description, prompt, basePath)} onReset={() => reset()} />
      ) : (
        <Loading />
      )}
    </>
  );
}
