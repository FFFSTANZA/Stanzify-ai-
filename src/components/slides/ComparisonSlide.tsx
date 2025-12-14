import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { Check, X } from 'lucide-react';

export interface ComparisonSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  leftTitle: string;
  rightTitle: string;
  items: Array<{
    label: string;
    left: boolean | string;
    right: boolean | string;
  }>;
  highlightBest?: 'left' | 'right' | 'none';
}

export function ComparisonSlide({
  title,
  leftTitle,
  rightTitle,
  items,
  highlightBest = 'none',
  ...baseProps
}: ComparisonSlideProps) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-6 h-6" style={{ color: baseProps.palette?.accent }} />
      ) : (
        <X className="w-6 h-6 opacity-30" />
      );
    }
    return <span className="text-base">{value}</span>;
  };

  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          <div />
          <div
            className={`text-center p-6 rounded-t-xl ${highlightBest === 'left' ? 'ring-4 ring-offset-2' : ''}`}
            style={highlightBest === 'left' ? { '--tw-ring-color': baseProps.palette?.accent } as React.CSSProperties : {}}
          >
            <h2
              className="text-3xl font-bold"
              style={{ color: baseProps.palette?.secondary }}
            >
              {leftTitle}
            </h2>
          </div>
          <div
            className={`text-center p-6 rounded-t-xl ${highlightBest === 'right' ? 'ring-4 ring-offset-2' : ''}`}
            style={highlightBest === 'right' ? { '--tw-ring-color': baseProps.palette?.accent } as React.CSSProperties : {}}
          >
            <h2 
              className="text-3xl font-bold"
              style={{ color: baseProps.palette?.secondary }}
            >
              {rightTitle}
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {items.map((item, index) => (
            <div 
              key={index}
              className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="font-semibold text-lg flex items-center">
                {item.label}
              </div>
              <div className="flex items-center justify-center">
                {renderValue(item.left)}
              </div>
              <div className="flex items-center justify-center">
                {renderValue(item.right)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}
