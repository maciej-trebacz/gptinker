export function MessageCommand(props: {
  result: string;
  parameters?: Record<string, string>;
}) {
  return (
    <>
      {props.parameters &&
        Object.entries(props.parameters).map(([key, value], index) => (
          <div className="mt-2 pl-2 flex" key={index}>
            <div className="text-xs text-gray-500 font-semibold mr-2 w-20 text-right flex-shrink-0">
              {key}
            </div>
            <div className="overflow-scroll max-h-[200px]">
              <div className="text-xs text-gray-200 font-mono whitespace-pre">
                {value}
              </div>
            </div>
          </div>
        ))}
      <div className="mt-2 pl-2 flex">
        <div className="text-xs text-gray-500 font-semibold mr-2 w-20 text-right flex-shrink-0">
          Result
        </div>
        <div className="overflow-scroll max-h-[200px]">
          <div className="text-xs text-gray-200 font-mono whitespace-pre">
            {props.result}
          </div>
        </div>
      </div>
    </>
  );
}
