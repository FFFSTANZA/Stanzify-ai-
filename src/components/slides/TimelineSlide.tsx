import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface TimelineSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  items: Array<{
    date: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  orientation?: 'horizontal' | 'vertical';
}

export function TimelineSlide({
  title,
  items,
  orientation = 'horizontal',
  ...baseProps
}: TimelineSlideProps) {
  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="center">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      {orientation === 'horizontal' ? (
        <div className="relative">
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2"
            style={{ backgroundColor: baseProps.palette?.accent }}
          />
          <div className="flex justify-between relative">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg z-10"
                  style={{ backgroundColor: baseProps.palette?.accent }}
                >
                  {item.icon ? (
                    <span className="text-2xl">{item.icon}</span>
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>
                <div 
                  className="text-sm font-bold mb-2"
                  style={{ color: baseProps.palette?.secondary }}
                >
                  {item.date}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-sm text-center opacity-80">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex gap-8 animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                  style={{ backgroundColor: baseProps.palette?.accent }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'white' }} />
                  {item.icon ? (
                    <span className="text-3xl relative z-10">{item.icon}</span>
                  ) : (
                    <span className="text-white font-bold text-2xl relative z-10">{index + 1}</span>
                  )}
                </div>
                {index < items.length - 1 && (
                  <div
                    className="w-1 h-12 mt-2 transition-all duration-300"
                    style={{ backgroundColor: baseProps.palette?.accent, opacity: 0.4 }}
                  />
                )}
              </div>
              <div className="flex-1 pb-8 p-6 rounded-2xl bg-gradient-to-r from-white/95 via-white/90 to-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-white/80">
                <div
                  className="text-sm font-bold mb-2 group-hover:opacity-100 opacity-90 transition-opacity"
                  style={{ color: baseProps.palette?.accent }}
                >
                  {item.date}
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:opacity-100 opacity-90 transition-opacity" style={{ color: baseProps.palette?.primary }}>
                  {item.title}
                </h3>
                <p className="text-lg opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseSlide>
  );
}
