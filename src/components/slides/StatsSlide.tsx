import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface StatsSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  stats: Array<{
    value: string;
    label: string;
    icon?: string;
    description?: string;
  }>;
  layout?: 'grid' | 'horizontal' | 'vertical';
}

export function StatsSlide({
  title,
  stats,
  layout = 'grid',
  ...baseProps
}: StatsSlideProps) {
  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
    horizontal: 'flex flex-wrap justify-center gap-12',
    vertical: 'flex flex-col gap-8 max-w-2xl mx-auto',
  };

  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      {title && (
        <h1 
          className="text-5xl font-bold mb-16 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className={layoutClasses[layout]}>
         {stats.map((stat, index) => (
           <div key={index} className="text-center animate-in fade-in zoom-in duration-700 group" style={{ animationDelay: `${index * 150}ms` }}>
             {stat.icon && (
               <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
             )}
             <div
               className="text-6xl md:text-7xl font-bold mb-2 group-hover:opacity-100 opacity-90 transition-opacity duration-300"
               style={{ color: baseProps.palette?.accent }}
             >
               {stat.value}
             </div>
             <div
               className="text-2xl font-semibold mb-3 group-hover:opacity-100 opacity-90 transition-opacity duration-300"
               style={{ color: baseProps.palette?.primary }}
             >
               {stat.label}
             </div>
             {stat.description && (
               <div className="p-4 rounded-lg bg-gray-500/10 group-hover:bg-gray-500/20 transition-colors duration-300">
                 <p className="text-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                   {stat.description}
                 </p>
               </div>
             )}
           </div>
         ))}
       </div>
    </BaseSlide>
  );
}
