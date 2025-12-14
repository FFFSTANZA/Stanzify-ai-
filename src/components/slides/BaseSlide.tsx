import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { SlideComponentProps } from '@/types/componentSlide';

export interface BaseSlideProps extends SlideComponentProps {
  children: ReactNode;
  background?: string;
  backgroundImage?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
}

export function BaseSlide({
  children,
  background,
  backgroundImage,
  padding = 'large',
  align = 'left',
  verticalAlign = 'center',
  className,
  palette,
}: BaseSlideProps) {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-8',
    medium: 'p-12',
    large: 'p-16',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const verticalAlignClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };

  const style: React.CSSProperties = {
    backgroundColor: background || palette?.background || '#ffffff',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col',
        paddingClasses[padding],
        alignClasses[align],
        verticalAlignClasses[verticalAlign],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
