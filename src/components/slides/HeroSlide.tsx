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
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-gradient-to-r from-current to-current hover:opacity-90 transition-opacity"
          style={{
            color: baseProps.palette?.primary,
            backgroundImage: `linear-gradient(135deg, ${baseProps.palette?.primary}, ${baseProps.palette?.accent})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } as React.CSSProperties}
        >
          {title}
        </h1>
        {subtitle && (
          <h2
            className="text-3xl md:text-4xl font-medium mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 group hover:opacity-100 transition-opacity"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
        {description && (
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 hover:opacity-100 transition-opacity">
            {description}
          </p>
        )}
        {cta && (
          <div className="mt-16 flex gap-6 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <button
              className="group px-10 py-5 rounded-xl text-white text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 relative overflow-hidden"
              style={{ backgroundColor: baseProps.palette?.accent }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white" />
              <span className="relative z-10">{cta.text}</span>
            </button>
            {cta.secondary && (
              <button
                className="group px-10 py-5 rounded-xl border-2 text-xl font-semibold transition-all duration-300 hover:scale-110 relative overflow-hidden"
                style={{
                  borderColor: baseProps.palette?.accent,
                  color: baseProps.palette?.accent
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: baseProps.palette?.accent }} />
                <span className="relative z-10">{cta.secondary}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </BaseSlide>
  );
}
