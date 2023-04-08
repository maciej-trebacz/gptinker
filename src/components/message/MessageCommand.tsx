import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { MessageCommandParam } from './MessageCommandParam';

export function MessageCommand(props: {
  result: string;
  command: string;
  parameters?: Record<string, string>;
}) {
  const commandContent = [
    ...Object.entries(props.parameters || {}),
    ['Result', props.result],
  ];

  return (
    <>
      {commandContent.map(([key, value], index) => (
        <MessageCommandParam key={index} label={key}>
          {props.command === 'WriteFile' && key === 'content' || props.command === 'ReadFile' && key === 'Result' ? (
            <SyntaxHighlighter language="typescript" style={nightOwl} className="text-xs text-gray-200 font-mono whitespace-pre" customStyle={{background: 'transparent', padding: 0}}>
              {value}
            </SyntaxHighlighter>
          ) : (
            <div className="text-xs text-gray-200 font-mono whitespace-pre">
              {value}
            </div>
          )}
        </MessageCommandParam>
      ))}
    </>
  );
}
