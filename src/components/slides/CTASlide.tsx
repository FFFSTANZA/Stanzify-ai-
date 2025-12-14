import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface CTASlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton: { text: string; url?: string };
  secondaryButton?: { text: string; url?: string };
  icon?: string;
  features?: string[];
}

export function CTASlide({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  icon,
  features,
  ...baseProps
}: CTASlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="max-w-4xl mx-auto text-center">
        {icon && (
          <div className="text-7xl mb-6 animate-in fade-in zoom-in duration-700">
            {icon}
          </div>
        )}
        <h1 
          className="text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2 
            className="text-3xl font-medium mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
        {description && (
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {description}
          </p>
        )}
        {features && features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="px-4 py-2 rounded-full bg-white shadow-md text-base font-medium"
                style={{ color: baseProps.palette?.accent }}
              >
                ✓ {feature}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <button 
            className="px-10 py-5 rounded-lg text-white text-2xl font-bold transition-transform hover:scale-105 shadow-xl"
            style={{ backgroundColor: baseProps.palette?.accent }}
          >
            {primaryButton.text}
          </button>
          {secondaryButton && (
            <button 
              className="px-10 py-5 rounded-lg border-2 text-2xl font-bold transition-transform hover:scale-105"
              style={{ 
                borderColor: baseProps.palette?.accent,
                color: baseProps.palette?.accent 
              }}
            >
              {secondaryButton.text}
            </button>
          )}
        </div>
      </div>
    </BaseSlide>
  );
}
