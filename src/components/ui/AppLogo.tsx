'use client';

import React, { memo } from 'react';

interface AppLogoProps {
  src?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

// Use a plain <img> tag to avoid any Next.js Image optimization issues with the logo
const AppLogo = memo(function AppLogo({
  src = '/assets/images/app_logo.png',
  size = 32,
  className = '',
  onClick,
}: AppLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="sipOS Logo"
      width={size}
      height={size}
      className={`flex-shrink-0 object-contain ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={onClick}
      onError={(e) => {
        // Hide broken image — icon fallback will show from parent
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
});

export default AppLogo;
