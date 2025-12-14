import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { ArrowRight } from 'lucide-react';

export interface ProcessSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  steps: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  layout?: 'horizontal' | 'vertical' | 'circular';
}

export function ProcessSlide({
  title,
  steps,
  layout = 'horizontal',
  ...baseProps
}: ProcessSlideProps) {
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
      {layout === 'horizontal' && (
        <div className="flex items-center justify-center gap-6 overflow-x-auto px-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center shrink-0">
              <div
                className="group flex flex-col items-center max-w-xs p-8 rounded-2xl bg-gradient-to-br from-white/95 to-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in zoom-in duration-700 border border-white/50 hover:border-white/80"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {step.icon && (
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                )}
                <div
                  className="text-5xl font-bold mb-3 group-hover:opacity-100 opacity-90 transition-opacity"
                  style={{ color: baseProps.palette?.accent }}
                >
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center group-hover:opacity-100 opacity-90 transition-opacity">
                  {step.title}
                </h3>
                <p className="text-sm text-center opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight
                  className="w-8 h-8 mx-4 shrink-0"
                  style={{ color: baseProps.palette?.accent }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {layout === 'vertical' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group flex gap-8 items-start animate-in fade-in slide-in-from-left duration-700 p-6 rounded-2xl bg-gradient-to-r from-white/95 via-white/90 to-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-white/80"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                style={{ backgroundColor: baseProps.palette?.accent }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'white' }} />
                <span className="relative z-10">{step.icon || index + 1}</span>
              </div>
              <div className="flex-1 py-2">
                <h3 className="text-2xl font-semibold mb-2 group-hover:opacity-100 opacity-90 transition-opacity" style={{ color: baseProps.palette?.primary }}>
                  {step.title}
                </h3>
                <p className="text-lg opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {layout === 'circular' && (
        <div className="relative w-full max-w-3xl mx-auto h-96">
          {steps.map((step, index) => {
            const angle = (360 / steps.length) * index - 90;
            const radius = 150;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={index}
                className="absolute animate-in fade-in zoom-in duration-700"
                style={{
                  animationDelay: `${index * 200}ms`,
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex flex-col items-center max-w-[150px] p-4 rounded-xl bg-white shadow-lg">
                  {step.icon && (
                    <div className="text-3xl mb-2">{step.icon}</div>
                  )}
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: baseProps.palette?.accent }}
                  >
                    {index + 1}
                  </div>
                  <h4 className="text-sm font-semibold text-center">
                    {step.title}
                  </h4>
                </div>
              </div>
            );
          })}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 flex items-center justify-center"
            style={{ borderColor: baseProps.palette?.accent }}
          >
            <span className="text-2xl font-bold" style={{ color: baseProps.palette?.primary }}>
              Process
            </span>
          </div>
        </div>
      )}
    </BaseSlide>
  );
}
