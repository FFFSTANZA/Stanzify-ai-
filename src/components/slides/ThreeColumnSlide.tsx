import { BaseSlide, BaseSlideProps } from './BaseSlide';
import ReactMarkdown from 'react-markdown';

export interface ThreeColumnSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  columns: Array<{
    title?: string;
    content: string;
    icon?: string;
    image?: string;
  }>;
}

export function ThreeColumnSlide({
  title,
  columns,
  ...baseProps
}: ThreeColumnSlideProps) {
  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="top">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col">
            {column.icon && (
              <div className="text-5xl mb-4">{column.icon}</div>
            )}
            {column.image && (
              <img 
                src={column.image} 
                alt={column.title || `Column ${index + 1}`}
                className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
              />
            )}
            {column.title && (
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: baseProps.palette?.secondary }}
              >
                {column.title}
              </h3>
            )}
            <div className="prose max-w-none">
              <ReactMarkdown>{column.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </BaseSlide>
  );
}
