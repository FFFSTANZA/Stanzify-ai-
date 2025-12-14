import { BaseSlide, BaseSlideProps } from './BaseSlide';
import ReactMarkdown from 'react-markdown';

export interface CardSlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'background';
  footer?: string;
}

export function CardSlide({
  title,
  subtitle,
  content,
  image,
  imagePosition = 'top',
  footer,
  ...baseProps
}: CardSlideProps) {
  const isBackgroundImage = imagePosition === 'background';
  
  return (
    <BaseSlide 
      {...baseProps} 
      align="center" 
      verticalAlign="center"
      backgroundImage={isBackgroundImage ? image : undefined}
    >
      {isBackgroundImage && (
         <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm" />
       )}
       <div className="relative z-10 max-w-4xl mx-auto w-full">
         <div className="group bg-gradient-to-br from-white/98 to-white/95 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border border-white/50 hover:border-white/80">
           {imagePosition === 'top' && image && (
             <img
               src={image}
               alt={title}
               className="w-full h-72 object-cover group-hover:opacity-95 transition-opacity duration-300"
             />
           )}
           <div className={`flex ${imagePosition === 'left' ? 'flex-row' : imagePosition === 'right' ? 'flex-row-reverse' : 'flex-col'}`}>
             {(imagePosition === 'left' || imagePosition === 'right') && image && (
               <img
                 src={image}
                 alt={title}
                 className="w-1/3 h-full object-cover group-hover:opacity-95 transition-opacity duration-300"
               />
             )}
             <div className="p-16 flex-1">
               <h1
                 className="text-5xl font-bold mb-6 group-hover:opacity-100 opacity-95 transition-opacity bg-gradient-to-r from-current to-current"
                 style={{
                   backgroundImage: `linear-gradient(135deg, ${baseProps.palette?.primary}, ${baseProps.palette?.accent})`,
                   backgroundClip: 'text',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent'
                 } as React.CSSProperties}
               >
                 {title}
               </h1>
               {subtitle && (
                 <h2
                   className="text-2xl font-medium mb-8 opacity-80 group-hover:opacity-95 transition-opacity"
                   style={{ color: baseProps.palette?.secondary }}
                 >
                   {subtitle}
                 </h2>
               )}
               <div className="prose prose-lg max-w-none opacity-85 group-hover:opacity-100 transition-opacity">
                 <ReactMarkdown>{content}</ReactMarkdown>
               </div>
               {footer && (
                 <div
                   className="mt-10 pt-8 border-t-2 text-lg font-semibold opacity-85 group-hover:opacity-100 transition-opacity"
                   style={{ borderColor: baseProps.palette?.accent }}
                 >
                   {footer}
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
    </BaseSlide>
  );
}
