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
          <div className="text-8xl mb-8 animate-in fade-in zoom-in duration-700 group hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
        <h1
          className="text-6xl font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-gradient-to-r from-current to-current hover:opacity-90 transition-opacity"
          style={{
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
            className="text-3xl font-medium mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 hover:opacity-100 transition-opacity"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
        {description && (
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 hover:opacity-100 transition-opacity leading-relaxed">
            {description}
          </p>
        )}
        {features && features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group px-5 py-3 rounded-full bg-gradient-to-r from-white/95 to-white/90 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold border border-white/50 hover:border-white/80 hover:-translate-y-1"
                style={{ color: baseProps.palette?.accent }}
              >
                ✓ {feature}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-6 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <button
            className="group px-12 py-6 rounded-xl text-white text-2xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 relative overflow-hidden"
            style={{ backgroundColor: baseProps.palette?.accent }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white" />
            <span className="relative z-10">{primaryButton.text}</span>
          </button>
          {secondaryButton && (
            <button
              className="group px-12 py-6 rounded-xl border-2 text-2xl font-bold transition-all duration-300 hover:scale-110 relative overflow-hidden"
              style={{
                borderColor: baseProps.palette?.accent,
                color: baseProps.palette?.accent
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: baseProps.palette?.accent }} />
              <span className="relative z-10">{secondaryButton.text}</span>
            </button>
          )}
        </div>
      </div>
    </BaseSlide>
  );
}
