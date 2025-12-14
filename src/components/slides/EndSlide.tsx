import { BaseSlide, BaseSlideProps } from './BaseSlide';

export interface EndSlideProps extends Omit<BaseSlideProps, 'children'> {
  title: string;
  subtitle?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
    social?: Array<{ platform: string; handle: string }>;
  };
  qrCode?: string;
}

export function EndSlide({
  title,
  subtitle,
  contactInfo,
  qrCode,
  ...baseProps
}: EndSlideProps) {
  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      <div className="text-center">
        <h1 
          className="text-7xl font-bold mb-6 animate-in fade-in zoom-in duration-1000"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2 
            className="text-3xl font-medium mb-12 opacity-80 animate-in fade-in duration-1000 delay-200"
            style={{ color: baseProps.palette?.secondary }}
          >
            {subtitle}
          </h2>
        )}
        {contactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12 animate-in fade-in duration-1000 delay-400">
            {contactInfo.email && (
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">📧</span>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-xl font-medium hover:underline"
                  style={{ color: baseProps.palette?.accent }}
                >
                  {contactInfo.email}
                </a>
              </div>
            )}
            {contactInfo.phone && (
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">📱</span>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-xl font-medium hover:underline"
                  style={{ color: baseProps.palette?.accent }}
                >
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo.website && (
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">🌐</span>
                <a 
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-medium hover:underline"
                  style={{ color: baseProps.palette?.accent }}
                >
                  {contactInfo.website}
                </a>
              </div>
            )}
            {contactInfo.social && contactInfo.social.length > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">💬</span>
                <div className="space-y-1">
                  {contactInfo.social.map((social, index) => (
                    <div key={index} className="text-lg">
                      <strong>{social.platform}:</strong> {social.handle}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {qrCode && (
          <div className="mt-12 animate-in fade-in zoom-in duration-1000 delay-600">
            <img 
              src={qrCode} 
              alt="QR Code"
              className="w-48 h-48 mx-auto rounded-xl shadow-xl"
            />
            <p className="mt-4 text-lg opacity-70">Scan for more info</p>
          </div>
        )}
      </div>
    </BaseSlide>
  );
}
