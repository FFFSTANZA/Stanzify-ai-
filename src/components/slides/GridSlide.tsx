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
    card: 'bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow',
    minimal: 'p-6',
    bordered: 'border-2 rounded-xl p-6 hover:border-opacity-100 transition-all',
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
      <div className={cn('grid gap-6', gridCols[columns])}>
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              itemStyles[itemStyle],
              'flex flex-col'
            )}
            style={
              itemStyle === 'bordered'
                ? { borderColor: baseProps.palette?.accent }
                : {}
            }
          >
            {item.icon && (
              <div className="text-4xl mb-4">{item.icon}</div>
            )}
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: baseProps.palette?.secondary }}
            >
              {item.title}
            </h3>
            <p className="text-base opacity-80">{item.description}</p>
          </div>
        ))}
      </div>
    </BaseSlide>
  );
}
