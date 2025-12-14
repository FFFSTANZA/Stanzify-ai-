import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface SectionSlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  icon?: string;
  number?: number;
}

export function SectionSlide({
  title,
  subtitle,
  icon,
  number,
  ...baseProps
}: SectionSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="text-center">
        {number && (
          <div 
            className="text-9xl font-bold mb-4 opacity-20"
            style={{ color: baseProps.palette?.accent }}
          >
            {number}
          </div>
        )}
        {icon && (
          <div className="text-8xl mb-8 animate-in fade-in zoom-in duration-700">
            {icon}
          </div>
        )}
        <h1 
          className="text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2 
            className="text-3xl font-medium opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
      </div>
    </BaseSlide>
  );
}
