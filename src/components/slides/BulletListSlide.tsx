import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface BulletListSlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  items: string[];
  icon?: string;
  numbered?: boolean;
  large?: boolean;
}

export function BulletListSlide({
  title,
  subtitle,
  items,
  icon,
  numbered = false,
  large = false,
  ...baseProps
}: BulletListSlideProps) {
  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="center">
      <div className="max-w-4xl mx-auto">
        {icon && (
          <div className="text-6xl mb-6 text-center">{icon}</div>
        )}
        <h1 
          className={`${large ? 'text-6xl' : 'text-5xl'} font-bold mb-4`}
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2 
            className="text-2xl font-medium mb-8 opacity-80"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
        <ul className="space-y-5">
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex items-start gap-6 ${large ? 'text-2xl' : 'text-xl'} animate-in fade-in slide-in-from-left duration-500 p-4 rounded-lg hover:bg-white/40 transition-colors duration-300 group`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <span
                className="font-bold shrink-0 mt-1 text-2xl group-hover:scale-110 transition-transform duration-300"
                style={{ color: baseProps.palette?.accent }}
              >
                {numbered ? `${index + 1}.` : '✓'}
              </span>
              <span className="group-hover:opacity-100 opacity-90 transition-opacity duration-300 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </BaseSlide>
  );
}
