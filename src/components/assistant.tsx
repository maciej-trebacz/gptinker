import React from 'react';
import Loading from '@/components/Loading';
import Prompt from '@/components/Prompt';
import Message from '@/components/message/Message';
import Suggestions from '@/components/Suggestions';
import { useAssistant } from '@/hooks/useAssistant';
import CollapsableSection from '@/components/CollapsableSection';
import { Options } from '@/components/Options';

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
      <CollapsableSection title='Options'> 
        <Options
          description={description}
          basePath={basePath}
          onDescriptionChange={(value) => setDescription(value)}
          onBasePathChange={(value) => setBasePath(value)}
        />
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