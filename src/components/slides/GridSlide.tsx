import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { cn } from '@/lib/utils';

export interface GridSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
  }>;
  columns?: 2 | 3 | 4;
  itemStyle?: 'card' | 'minimal' | 'bordered';
}

export function GridSlide({
  title,
  items,
  columns = 3,
  itemStyle = 'card',
  ...baseProps
}: GridSlideProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const itemStyles = {
    card: 'bg-gradient-to-br from-white/95 to-white/90 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 hover:border-white/80',
    minimal: 'p-8 rounded-2xl bg-gradient-to-br from-transparent to-transparent hover:bg-white/20 transition-colors duration-300 rounded-lg',
    bordered: 'border-2 rounded-2xl p-8 hover:border-opacity-100 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg',
  };

  return (
    <BaseSlide {...baseProps} align="left" verticalAlign="top">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className={cn('grid gap-8', gridCols[columns])}>
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              itemStyles[itemStyle],
              'group flex flex-col animate-in fade-in zoom-in duration-500'
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              ...(itemStyle === 'bordered'
                ? { borderColor: baseProps.palette?.accent }
                : {})
            }}
          >
            {item.icon && (
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
            )}
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-40 object-cover rounded-2xl mb-4 group-hover:opacity-90 transition-opacity duration-300"
              />
            )}
            <h3 
              className="text-2xl font-bold mb-2 group-hover:opacity-100 opacity-90 transition-opacity duration-300"
              style={{ color: baseProps.palette?.primary }}
            >
              {item.title}
            </h3>
            <p className="text-base opacity-75 group-hover:opacity-90 transition-opacity duration-300 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </BaseSlide>
  );
}
