import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface BeforeAfterSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  before: {
    title: string;
    items: string[];
    image?: string;
  };
  after: {
    title: string;
    items: string[];
    image?: string;
  };
}

export function BeforeAfterSlide({
  title,
  before,
  after,
  ...baseProps
}: BeforeAfterSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          {before.image && (
            <img 
              src={before.image} 
              alt={before.title}
              className="w-full h-48 object-cover rounded-xl mb-6 opacity-60"
            />
          )}
          <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
            {before.title}
          </h2>
          <ul className="space-y-4">
            {before.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-lg">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <span className="opacity-70">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
          {after.image && (
            <img 
              src={after.image} 
              alt={after.title}
              className="w-full h-48 object-cover rounded-xl mb-6"
            />
          )}
          <h2 
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: baseProps.palette?.accent }}
          >
            {after.title}
          </h2>
          <ul className="space-y-4">
            {after.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-lg">
                <span style={{ color: baseProps.palette?.accent }} className="font-bold mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseSlide>
  );
}
