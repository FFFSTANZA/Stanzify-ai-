import { BaseSlide, BaseSlideProps } from './BaseSlide';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export interface TwoColumnSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  leftContent: string;
  rightContent: string;
  leftImage?: string;
  rightImage?: string;
  split?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  reverseOnMobile?: boolean;
}

export function TwoColumnSlide({
  title,
  leftContent,
  rightContent,
  leftImage,
  rightImage,
  split = '50-50',
  reverseOnMobile = false,
  ...baseProps
}: TwoColumnSlideProps) {
  const splitClasses = {
    '50-50': 'grid-cols-2',
    '60-40': 'grid-cols-[1.5fr_1fr]',
    '40-60': 'grid-cols-[1fr_1.5fr]',
    '70-30': 'grid-cols-[2.33fr_1fr]',
    '30-70': 'grid-cols-[1fr_2.33fr]',
  };

  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="top">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div
        className={cn(
          'grid gap-8 h-full',
          splitClasses[split],
          reverseOnMobile && 'flex flex-col-reverse md:grid'
        )}
      >
        <div className="flex flex-col justify-center">
          {leftImage && (
            <img 
              src={leftImage} 
              alt="Left visual" 
              className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
            />
          )}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{leftContent}</ReactMarkdown>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {rightImage && (
            <img 
              src={rightImage} 
              alt="Right visual" 
              className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
            />
          )}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{rightContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
