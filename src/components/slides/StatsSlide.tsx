import { useState } from 'react';
import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface StatsSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  stats: Array<{
    value: string;
    label: string;
    icon?: string;
    description?: string;
    revealText?: string; // Additional text that can be revealed
  }>;
  layout?: 'grid' | 'horizontal' | 'vertical';
  enableClickReveal?: boolean; // Enable progressive disclosure
}

export function StatsSlide({
  title,
  stats,
  layout = 'grid',
  enableClickReveal = true,
  ...baseProps
}: StatsSlideProps) {
  const [revealedStats, setRevealedStats] = useState<number[]>([]);
  const [showMore, setShowMore] = useState(false);
  
  const visibleStats = showMore ? stats : stats.slice(0, Math.min(3, stats.length));
  const hiddenStats = showMore ? [] : stats.slice(3);
  
  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    horizontal: 'flex flex-wrap justify-center gap-8',
    vertical: 'flex flex-col gap-8 max-w-2xl mx-auto',
  };

  const handleRevealStat = (index: number) => {
    setRevealedStats(prev => [...prev, index]);
  };

  const handleShowMore = () => {
    setShowMore(true);
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
        {visibleStats.map((stat, index) => {
          const isRevealed = revealedStats.includes(index) || !enableClickReveal;
          
          return (
            <div 
              key={index} 
              className="text-center animate-in fade-in zoom-in duration-700 group cursor-pointer" 
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => enableClickReveal && !isRevealed && handleRevealStat(index)}
            >
              {stat.icon && (
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
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
              
              {/* Click to reveal more info */}
              {enableClickReveal && !isRevealed && stat.revealText && (
                <div className="mt-4 animate-in fade-in duration-300">
                  <button
                    className="flex items-center justify-center mx-auto gap-2 px-4 py-2 rounded-full border-2 border-dashed transition-all duration-300 hover:border-solid hover:scale-105"
                    style={{ borderColor: baseProps.palette?.accent, color: baseProps.palette?.accent }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevealStat(index);
                    }}
                  >
                    <span className="text-sm font-medium">Click to reveal more</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Revealed additional info */}
              {isRevealed && stat.revealText && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent backdrop-blur-sm border border-white/30 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronUp className="w-4 h-4" style={{ color: baseProps.palette?.accent }} />
                    <span className="text-sm font-semibold" style={{ color: baseProps.palette?.accent }}>
                      Additional Insights
                    </span>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {stat.revealText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Show more button for additional statistics */}
      {hiddenStats.length > 0 && !showMore && (
        <div className="mt-12 text-center animate-in fade-in duration-500">
          <button
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: baseProps.palette?.accent,
              color: 'white',
            }}
            onClick={handleShowMore}
          >
            <span>Click to reveal more statistics</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Fade-out transition indicator */}
      {enableClickReveal && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div 
            className="w-1 h-8 rounded-full opacity-60"
            style={{ backgroundColor: baseProps.palette?.accent }}
          />
        </div>
      )}
    </BaseSlide>
  );
}
