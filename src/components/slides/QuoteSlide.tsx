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
        {/* Quote Mark */}
        <div className="flex justify-center mb-10 animate-in fade-in duration-700">
          <Quote
            className={`${large ? 'w-24 h-24' : 'w-20 h-20'} opacity-30 group-hover:opacity-50 transition-opacity`}
            style={{ color: baseProps.palette?.accent }}
          />
        </div>

        {/* Quote Text */}
        <blockquote
          className={`${large ? 'text-5xl' : 'text-4xl'} font-bold italic text-center mb-16 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 group hover:opacity-100 opacity-95 transition-opacity`}
          style={{
            color: baseProps.palette?.primary,
            backgroundImage: `linear-gradient(135deg, ${baseProps.palette?.primary}, ${baseProps.palette?.accent})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } as React.CSSProperties}
        >
          "{quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          {image && (
            <img
              src={image}
              alt={author}
              className="w-24 h-24 rounded-full object-cover shadow-xl ring-4 ring-offset-2 group-hover:scale-110 transition-transform duration-300"
              style={{ '--tw-ring-color': baseProps.palette?.accent } as React.CSSProperties}
            />
          )}
          <div className="text-center">
            <div
              className="text-2xl font-bold group-hover:opacity-100 opacity-90 transition-opacity"
              style={{ color: baseProps.palette?.secondary }}
            >
              {author}
            </div>
            {role && (
              <div className="text-xl opacity-70 group-hover:opacity-90 transition-opacity mt-2">
                {role}
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
