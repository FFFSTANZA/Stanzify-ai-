import { useState } from 'react';
import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { ChevronDown, ChevronUp, Play, Pause } from 'lucide-react';

export interface TimelineSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  items: Array<{
    date: string;
    title: string;
    description: string;
    icon?: string;
    fadeOut?: boolean; // For fade-out transitions
    clickToReveal?: boolean; // For progressive disclosure
    subTasks?: string[]; // Additional subtasks that can be revealed
  }>;
  orientation?: 'horizontal' | 'vertical';
  enableClickReveal?: boolean; // Enable interactive timeline progression
}

export function TimelineSlide({
  title,
  items,
  orientation = 'horizontal',
  enableClickReveal = true,
  ...baseProps
}: TimelineSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedItems, setRevealedItems] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  
  const visibleItems = enableClickReveal ? items.slice(0, currentIndex + 1) : items;
  const nextItem = items[currentIndex + 1];
  const hasMore = currentIndex < items.length - 1;
  
  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleReveal = (index: number) => {
    setRevealedItems(prev => [...prev, index]);
  };
  
  const toggleAutoPlay = () => {
    if (isPlaying) {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
      setIsPlaying(false);
    } else {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= items.length - 1) {
            if (autoPlayInterval) {
              clearInterval(interval);
              setAutoPlayInterval(null);
            }
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      setAutoPlayInterval(interval);
      setIsPlaying(true);
    }
  };
  
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
      
      {/* Interactive Controls */}
      {enableClickReveal && (
        <div className="flex justify-center gap-4 mb-8">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: baseProps.palette?.accent, color: 'white' }}
            onClick={toggleAutoPlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="font-medium">{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
          
          {hasMore && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105"
              style={{ borderColor: baseProps.palette?.accent, color: baseProps.palette?.accent }}
              onClick={handleNext}
            >
              <ChevronDown className="w-4 h-4" />
              <span className="font-medium">Next Phase</span>
            </button>
          )}
        </div>
      )}
      
      {orientation === 'horizontal' ? (
        <div className="relative">
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 transition-all duration-1000"
            style={{ backgroundColor: baseProps.palette?.accent, opacity: 0.3 }}
          />
          <div className="flex justify-between relative">
            {visibleItems.map((item, index) => {
              const isRevealed = revealedItems.includes(index) || !enableClickReveal;
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700 group cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => enableClickReveal && !isRevealed && handleReveal(index)}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg z-10 group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: baseProps.palette?.accent }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'white' }} />
                    {item.icon ? (
                      <span className="text-3xl relative z-10">{item.icon}</span>
                    ) : (
                      <span className="text-white font-bold text-xl relative z-10">{index + 1}</span>
                    )}
                    
                    {/* Fade-out indicator */}
                    {item.fadeOut && (
                      <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: 'white' }} />
                    )}
                  </div>
                  
                  <div 
                    className="text-sm font-bold mb-2 group-hover:opacity-100 opacity-90 transition-opacity"
                    style={{ color: baseProps.palette?.secondary }}
                  >
                    {item.date}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-center group-hover:opacity-100 opacity-90 transition-opacity">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-center opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Click to reveal subtasks */}
                  {enableClickReveal && !isRevealed && item.subTasks && (
                    <div className="mt-3 animate-in fade-in duration-300">
                      <button
                        className="flex items-center gap-1 px-3 py-1 rounded-full border border-dashed text-xs transition-all duration-300 hover:border-solid"
                        style={{ borderColor: baseProps.palette?.accent, color: baseProps.palette?.accent }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReveal(index);
                        }}
                      >
                        <span>Click to reveal tasks</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  {/* Revealed subtasks */}
                  {isRevealed && item.subTasks && (
                    <div className="mt-3 p-3 rounded-lg bg-black/10 backdrop-blur-sm border border-white/30 animate-in slide-in-from-bottom-2 duration-500">
                      <ul className="text-xs space-y-1 opacity-90">
                        {item.subTasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: baseProps.palette?.accent }} />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Show next item preview */}
          {hasMore && nextItem && (
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
              <div className="text-xs font-medium opacity-70">{nextItem.date}</div>
              <div className="text-sm font-semibold opacity-90">{nextItem.title}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {visibleItems.map((item, index) => {
            const isRevealed = revealedItems.includes(index) || !enableClickReveal;
            
            return (
              <div
                key={index}
                className={`group flex gap-8 animate-in fade-in slide-in-from-left duration-700 ${item.fadeOut ? 'transition-opacity duration-1000' : ''}`}
                style={{ animationDelay: `${index * 200}ms`, opacity: item.fadeOut && currentIndex > index ? 0.3 : 1 }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden cursor-pointer"
                    style={{ backgroundColor: baseProps.palette?.accent }}
                    onClick={() => enableClickReveal && !isRevealed && handleReveal(index)}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: 'white' }} />
                    {item.icon ? (
                      <span className="text-3xl relative z-10">{item.icon}</span>
                    ) : (
                      <span className="text-white font-bold text-2xl relative z-10">{index + 1}</span>
                    )}
                    
                    {/* Fade-out indicator */}
                    {item.fadeOut && (
                      <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: 'white' }} />
                    )}
                  </div>
                  {index < items.length - 1 && (
                    <div
                      className="w-1 h-12 mt-2 transition-all duration-300"
                      style={{ backgroundColor: baseProps.palette?.accent, opacity: 0.4 }}
                    />
                  )}
                </div>
                
                <div className={`flex-1 pb-8 p-6 rounded-2xl bg-gradient-to-r from-white/95 via-white/90 to-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-white/80 cursor-pointer`}
                     onClick={() => enableClickReveal && !isRevealed && handleReveal(index)}>
                  <div
                    className="text-sm font-bold mb-2 group-hover:opacity-100 opacity-90 transition-opacity"
                    style={{ color: baseProps.palette?.accent }}
                  >
                    {item.date}
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3 group-hover:opacity-100 opacity-90 transition-opacity" style={{ color: baseProps.palette?.primary }}>
                    {item.title}
                  </h3>
                  
                  <p className="text-lg opacity-75 group-hover:opacity-90 transition-opacity leading-relaxed mb-3">
                    {item.description}
                  </p>
                  
                  {/* Click to reveal subtasks */}
                  {enableClickReveal && !isRevealed && item.subTasks && (
                    <div className="animate-in fade-in duration-300">
                      <button
                        className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-dashed text-sm transition-all duration-300 hover:border-solid"
                        style={{ borderColor: baseProps.palette?.accent, color: baseProps.palette?.accent }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReveal(index);
                        }}
                      >
                        <span>Click to reveal more</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Revealed subtasks */}
                  {isRevealed && item.subTasks && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent backdrop-blur-sm border border-white/30 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-2 mb-3">
                        <ChevronUp className="w-4 h-4" style={{ color: baseProps.palette?.accent }} />
                        <span className="text-sm font-semibold" style={{ color: baseProps.palette?.accent }}>
                          Implementation Tasks
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {item.subTasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-3 text-sm opacity-90">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: baseProps.palette?.accent }} />
                            <span className="leading-relaxed">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Next item preview */}
          {hasMore && nextItem && (
            <div className="mt-8 p-6 rounded-xl border-2 border-dashed opacity-60 animate-pulse">
              <div className="text-center">
                <div className="text-sm font-bold opacity-70" style={{ color: baseProps.palette?.accent }}>
                  Next: {nextItem.date}
                </div>
                <div className="text-xl font-semibold opacity-80">{nextItem.title}</div>
              </div>
            </div>
          )}
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
