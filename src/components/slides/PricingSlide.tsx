import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { Check } from 'lucide-react';

export interface PricingSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  plans: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
    cta?: string;
  }>;
}

export function PricingSlide({
  title,
  plans,
  ...baseProps
}: PricingSlideProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`flex flex-col p-8 rounded-2xl shadow-xl ${
              plan.highlighted ? 'ring-4 scale-105' : 'bg-white'
            } animate-in fade-in zoom-in duration-500`}
            style={{
              animationDelay: `${index * 150}ms`,
              ringColor: plan.highlighted ? baseProps.palette?.accent : undefined,
              backgroundColor: plan.highlighted ? baseProps.palette?.accent : undefined,
            }}
          >
            <h3 
              className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : ''}`}
              style={{ color: !plan.highlighted ? baseProps.palette?.secondary : undefined }}
            >
              {plan.name}
            </h3>
            <div className={`mb-6 ${plan.highlighted ? 'text-white' : ''}`}>
              <span className="text-5xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-xl ml-2 opacity-70">/{plan.period}</span>}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, fidx) => (
                <li key={fidx} className={`flex items-start gap-3 ${plan.highlighted ? 'text-white' : ''}`}>
                  <Check className={`w-5 h-5 mt-1 shrink-0 ${plan.highlighted ? 'text-white' : ''}`} style={{ color: !plan.highlighted ? baseProps.palette?.accent : undefined }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              className={`w-full py-4 rounded-lg font-bold text-lg transition-transform hover:scale-105 ${
                plan.highlighted ? 'bg-white' : 'text-white'
              }`}
              style={{
                backgroundColor: !plan.highlighted ? baseProps.palette?.accent : undefined,
                color: plan.highlighted ? baseProps.palette?.accent : undefined,
              }}
            >
              {plan.cta || 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </BaseSlide>
  );
}
