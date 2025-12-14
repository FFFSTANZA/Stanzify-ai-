import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface ImageGallerySlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  images: Array<{
    src: string;
    caption?: string;
    alt?: string;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export function ImageGallerySlide({
  title,
  images,
  layout = 'grid',
  ...baseProps
}: ImageGallerySlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="top">
      {title && (
        <h1 
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      {layout === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow animate-in fade-in zoom-in duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={image.src} 
                alt={image.alt || `Image ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm font-medium">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {layout === 'masonry' && (
        <div className="columns-2 md:columns-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="mb-6 break-inside-avoid group relative overflow-hidden rounded-xl shadow-lg animate-in fade-in duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={image.src} 
                alt={image.alt || `Image ${index + 1}`}
                className="w-full group-hover:scale-105 transition-transform duration-500"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </BaseSlide>
  );
}
