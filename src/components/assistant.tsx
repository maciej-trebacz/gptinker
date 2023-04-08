import React from 'react';
import Loading from '@/components/Loading';
import Prompt from '@/components/Prompt';
import Message from '@/components/message/Message';
import Description from '@/components/Description';
import BasePath from '@/components/BasePath';
import Suggestions from '@/components/Suggestions';
import { useAssistant } from '@/hooks/useAssistant';
import CollapsableSection from '@/components/CollapsableSection';

const appDescription = `It's a Next.js application written in Typescript called GPTinker - an AI developer assistant that helps you navigate and modify codebases`;

export default function Assistant() {
  const { loading, ask, conversationItems, reset } = useAssistant();
  const [description, setDescription] = React.useState(appDescription);
  const [basePath, setBasePath] = React.useState(process.env.BASE_PATH || '');
  const suggestions = conversationItems[conversationItems.length - 1]?.options;

  return (
    <>
      <CollapsableSection title="Options"> 
        <Description
          value={description}
          onChange={(value) => setDescription(value)}
        />
        <BasePath
          value={basePath}
          onChange={(value) => setBasePath(value)}
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
