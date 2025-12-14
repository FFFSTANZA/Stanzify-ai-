import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { cn } from '@/lib/utils';

export interface HeroSlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: { text: string; secondary?: string };
  icon?: string;
  overlay?: boolean;
}

export function HeroSlide({
  title,
  subtitle,
  description,
  cta,
  icon,
  overlay = true,
  ...baseProps
}: HeroSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      {overlay && baseProps.backgroundImage && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      <div className="relative z-10 max-w-5xl mx-auto">
        {icon && (
          <div className="text-7xl mb-6 animate-in fade-in zoom-in duration-700">
            {icon}
          </div>
        )}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2 
            className="text-3xl md:text-4xl font-medium mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
        {description && (
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {description}
          </p>
        )}
        {cta && (
          <div className="mt-12 flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <button 
              className="px-8 py-4 rounded-lg text-white text-xl font-semibold transition-transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: baseProps.palette?.accent }}
            >
              {cta.text}
            </button>
            {cta.secondary && (
              <button 
                className="px-8 py-4 rounded-lg border-2 text-xl font-semibold transition-transform hover:scale-105"
                style={{ 
                  borderColor: baseProps.palette?.accent,
                  color: baseProps.palette?.accent 
                }}
              >
                {cta.secondary}
              </button>
            )}
          </div>
        )}
      </div>
    </BaseSlide>
  );
}
