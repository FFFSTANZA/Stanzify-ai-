import { ReactNode } from 'react';
import { cn, getContrastColor } from '@/lib/utils';
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

  const bgColor = background || palette?.background || '#ffffff';
  // Only apply contrast color if we have a specific background color set from palette or prop
  // Otherwise let the theme CSS handle it (which handles defaults)
  // Actually, since we default to #ffffff above, we should set text color.
  // But wait, if palette.background is undefined, we default to #ffffff.
  // If we force text color to black (contrast of white), we might override dark theme default text color
  // if the dark theme didn't provide palette.background but relied on CSS.
  
  // However, ComponentSlideViewer passes palette.background. If it's missing, it defaults to DEFAULT_PALETTE which has white bg.
  
  const textColor = getContrastColor(bgColor);

  const style: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
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
