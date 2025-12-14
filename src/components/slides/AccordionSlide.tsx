import { useState } from 'react';
import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface AccordionSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  items: Array<{
    title: string;
    content: string;
    icon?: string;
  }>;
  allowMultiple?: boolean;
  defaultOpen?: number[];
}

export function AccordionSlide({
  title,
  items,
  allowMultiple = false,
  defaultOpen = [0],
  ...baseProps
}: AccordionSlideProps) {
  const [openItems, setOpenItems] = useState<number[]>(defaultOpen);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenItems(prev => prev.includes(index) ? [] : [index]);
    }
  };

  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="center">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="max-w-4xl mx-auto space-y-4">
        {items.map((item, index) => {
          const isOpen = openItems.includes(index);
          
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {item.icon && (
                    <span className="text-3xl">{item.icon}</span>
                  )}
                  <h3 className="text-2xl font-semibold">
                    {item.title}
                  </h3>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: baseProps.palette?.accent }}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 prose max-w-none animate-in fade-in slide-in-from-top-2 duration-300">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BaseSlide>
  );
}
