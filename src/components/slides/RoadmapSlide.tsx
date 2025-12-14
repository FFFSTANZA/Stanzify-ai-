import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface RoadmapSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  phases: Array<{
    phase: string;
    timeframe: string;
    items: string[];
    status?: 'completed' | 'in-progress' | 'planned';
  }>;
}

export function RoadmapSlide({
  title,
  phases,
  ...baseProps
}: RoadmapSlideProps) {
  const statusColors = {
    completed: '#10B981',
    'in-progress': '#F59E0B',
    planned: '#6B7280',
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
      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200" />
        <div className="space-y-12">
          {phases.map((phase, index) => (
            <div 
              key={index}
              className="relative pl-24 animate-in fade-in slide-in-from-left duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div 
                className="absolute left-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: phase.status ? statusColors[phase.status] : baseProps.palette?.accent }}
              >
                Q{index + 1}
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 
                    className="text-2xl font-bold"
                    style={{ color: baseProps.palette?.secondary }}
                  >
                    {phase.phase}
                  </h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100">
                    {phase.timeframe}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, iidx) => (
                    <li key={iidx} className="flex items-start gap-2">
                      <span className="text-2xl mt-[-4px]">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}
