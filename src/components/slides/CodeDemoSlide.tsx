import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface CodeDemoSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  description?: string;
  code: string;
  language: string;
  output?: string;
  highlightLines?: number[];
}

export function CodeDemoSlide({
  title,
  description,
  code,
  language,
  output,
  highlightLines = [],
  ...baseProps
}: CodeDemoSlideProps) {
  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="top">
      {title && (
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      {description && (
        <p className="text-xl mb-6 opacity-80">
          {description}
        </p>
      )}
      <div className={`grid ${output ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
        <div className="rounded-xl overflow-hidden shadow-xl">
          <div 
            className="px-4 py-2 text-white text-sm font-medium flex items-center justify-between"
            style={{ backgroundColor: baseProps.palette?.secondary }}
          >
            <span>{language}</span>
            <span className="opacity-70">Code</span>
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber) => ({
              style: {
                backgroundColor: highlightLines.includes(lineNumber) 
                  ? 'rgba(255, 255, 0, 0.1)' 
                  : 'transparent',
              },
            })}
            customStyle={{
              margin: 0,
              maxHeight: '500px',
              fontSize: '0.9rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        {output && (
          <div className="rounded-xl overflow-hidden shadow-xl bg-gray-900">
            <div 
              className="px-4 py-2 text-white text-sm font-medium"
              style={{ backgroundColor: baseProps.palette?.accent }}
            >
              Output
            </div>
            <pre className="p-4 text-green-400 font-mono text-sm overflow-auto max-h-[500px]">
              {output}
            </pre>
          </div>
        )}
      </div>
    </BaseSlide>
  );
}
