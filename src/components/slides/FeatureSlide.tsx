import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface FeatureSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  subtitle?: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  layout?: 'grid' | 'list';
}

export function FeatureSlide({
  title,
  subtitle,
  features,
  layout = 'grid',
  ...baseProps
}: FeatureSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="top">
      {title && (
        <div className="mb-12 text-center">
          <h1 
            className="text-5xl font-bold mb-4"
            style={{ color: baseProps.palette?.primary }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-2xl opacity-80">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-white/95 to-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in zoom-in duration-500 border border-white/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                style={{ backgroundColor: baseProps.palette?.accent }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'white' }} />
                <span className="relative z-10" style={{ color: 'white' }}>{feature.icon}</span>
              </div>
              <h3
                className="text-2xl font-bold mb-3 group-hover:opacity-100 opacity-90 transition-opacity"
                style={{ color: baseProps.palette?.primary }}
              >
                {feature.title}
              </h3>
              <p className="text-base opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}
      {layout === 'list' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex items-start gap-8 p-8 rounded-2xl bg-gradient-to-r from-white/95 via-white/90 to-white/95 shadow-lg hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-left duration-500 border border-white/50 hover:border-white/80"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                style={{ backgroundColor: baseProps.palette?.accent }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'white' }} />
                <span className="relative z-10" style={{ color: 'white' }}>{feature.icon}</span>
              </div>
              <div className="flex-1 py-2">
                <h3
                  className="text-2xl font-bold mb-2 group-hover:opacity-100 opacity-90 transition-opacity"
                  style={{ color: baseProps.palette?.primary }}
                >
                  {feature.title}
                </h3>
                <p className="text-lg opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseSlide>
  );
}
