import { BaseSlide, BaseSlideProps } from './BaseSlide';
import ReactMarkdown from 'react-markdown';

export interface CardSlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'background';
  footer?: string;
}

export function CardSlide({
  title,
  subtitle,
  content,
  image,
  imagePosition = 'top',
  footer,
  ...baseProps
}: CardSlideProps) {
  const isBackgroundImage = imagePosition === 'background';
  
  return (
    <BaseSlide 
      {...baseProps} 
      align="center" 
      verticalAlign="center"
      backgroundImage={isBackgroundImage ? image : undefined}
    >
      {isBackgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {imagePosition === 'top' && image && (
            <img 
              src={image} 
              alt={title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className={`flex ${imagePosition === 'left' ? 'flex-row' : imagePosition === 'right' ? 'flex-row-reverse' : 'flex-col'}`}>
            {(imagePosition === 'left' || imagePosition === 'right') && image && (
              <img 
                src={image} 
                alt={title}
                className="w-1/3 h-full object-cover"
              />
            )}
            <div className="p-12 flex-1">
              <h1 
                className="text-5xl font-bold mb-4"
                style={{ color: baseProps.palette?.primary }}
              >
                {title}
              </h1>
              {subtitle && (
                <h2 
                  className="text-2xl font-medium mb-6 opacity-80"
                  style={{ color: baseProps.palette?.secondary }}
                >
                  {subtitle}
                </h2>
              )}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
              {footer && (
                <div 
                  className="mt-8 pt-6 border-t-2 text-lg font-medium"
                  style={{ borderColor: baseProps.palette?.accent }}
                >
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
