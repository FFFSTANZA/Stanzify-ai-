import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface VideoSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  autoPlay?: boolean;
}

export function VideoSlide({
  title,
  description,
  videoUrl,
  thumbnail,
  autoPlay = false,
  ...baseProps
}: VideoSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="max-w-5xl mx-auto w-full">
        {title && (
          <h1 
            className="text-5xl font-bold mb-6 text-center"
            style={{ color: baseProps.palette?.primary }}
          >
            {title}
          </h1>
        )}
        {description && (
          <p className="text-xl text-center mb-8 opacity-80">
            {description}
          </p>
        )}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
          {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}?autoplay=${autoPlay ? 1 : 0}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl.includes('vimeo.com') ? (
            <iframe
              className="w-full h-full"
              src={`https://player.vimeo.com/video/${extractVimeoId(videoUrl)}?autoplay=${autoPlay ? 1 : 0}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              className="w-full h-full"
              controls
              autoPlay={autoPlay}
              poster={thumbnail}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </BaseSlide>
  );
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : '';
}
