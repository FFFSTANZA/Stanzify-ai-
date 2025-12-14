import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { Quote } from 'lucide-react';

export interface QuoteSlideProps extends Omit<BaseSlideProps, 'children'> {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  large?: boolean;
}

export function QuoteSlide({
  quote,
  author,
  role,
  image,
  large = false,
  ...baseProps
}: QuoteSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="max-w-5xl mx-auto">
        <Quote 
          className={`${large ? 'w-20 h-20' : 'w-16 h-16'} mb-8 mx-auto opacity-20`}
          style={{ color: baseProps.palette?.accent }}
        />
        <blockquote 
          className={`${large ? 'text-5xl' : 'text-4xl'} font-bold italic text-center mb-12 leading-relaxed`}
          style={{ color: baseProps.palette?.primary }}
        >
          "{quote}"
        </blockquote>
        <div className="flex items-center justify-center gap-6">
          {image && (
            <img 
              src={image} 
              alt={author}
              className="w-20 h-20 rounded-full object-cover shadow-lg"
            />
          )}
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: baseProps.palette?.secondary }}
            >
              {author}
            </div>
            {role && (
              <div className="text-xl opacity-70 mt-1">
                {role}
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
