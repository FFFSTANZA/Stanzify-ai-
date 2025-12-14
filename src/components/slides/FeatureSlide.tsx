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
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow animate-in fade-in zoom-in duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-md"
                style={{ backgroundColor: baseProps.palette?.accent, opacity: 0.1 }}
              >
                <span>{feature.icon}</span>
              </div>
              <h3 
                className="text-2xl font-bold mb-3"
                style={{ color: baseProps.palette?.secondary }}
              >
                {feature.title}
              </h3>
              <p className="text-base opacity-80">
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
              className="flex items-start gap-6 p-6 rounded-xl bg-white shadow-lg animate-in fade-in slide-in-from-left duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 shadow-md"
                style={{ backgroundColor: baseProps.palette?.accent, color: 'white' }}
              >
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: baseProps.palette?.secondary }}
                >
                  {feature.title}
                </h3>
                <p className="text-lg opacity-80">
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
