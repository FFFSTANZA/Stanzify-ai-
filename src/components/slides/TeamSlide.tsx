import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface TeamSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  members: Array<{
    name: string;
    role: string;
    image?: string;
    bio?: string;
    social?: { type: string; url: string }[];
  }>;
}

export function TeamSlide({
  title,
  members,
  ...baseProps
}: TeamSlideProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member, index) => (
          <div 
            key={index}
            className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative mb-4">
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover shadow-xl"
                />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl"
                  style={{ backgroundColor: baseProps.palette?.accent }}
                >
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 
              className="text-xl font-bold mb-1"
              style={{ color: baseProps.palette?.secondary }}
            >
              {member.name}
            </h3>
            <p 
              className="text-sm font-medium mb-3"
              style={{ color: baseProps.palette?.accent }}
            >
              {member.role}
            </p>
            {member.bio && (
              <p className="text-sm opacity-70 px-4">
                {member.bio}
              </p>
            )}
          </div>
        ))}
      </div>
    </BaseSlide>
  );
}
