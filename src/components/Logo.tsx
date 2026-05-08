import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { mark: 28, font: 'text-base' },
  md: { mark: 40, font: 'text-2xl' },
  lg: { mark: 56, font: 'text-4xl' },
  xl: { mark: 84, font: 'text-6xl' },
  hero: { mark: 120, font: 'text-7xl md:text-8xl' },
} as const;

export const Logo: React.FC<LogoProps> = React.memo(({ size = 'md', showWordmark = true, className = '' }) => {
  const { mark, font } = sizeMap[size];
  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      data-testid="rixzla-logo"
    >
      <span
        className="relative inline-flex items-center justify-center rounded-md overflow-hidden"
        style={{ width: mark, height: mark }}
      >
        <span
          className="absolute inset-0 rounded-md"
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,43,214,0.55), 0 0 22px rgba(255,43,214,0.45), 0 0 44px rgba(43,240,255,0.25)',
          }}
        />
        <img
          src="/logo-mark-sm.png"
          alt="RiXzLa"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.9)' }}
        />
      </span>
      {showWordmark && (
        <span className={`wordmark uppercase ${font} leading-none`} data-testid="rixzla-wordmark">
          RiXzLa
        </span>
      )}
    </div>
  );
});

Logo.displayName = 'Logo';
