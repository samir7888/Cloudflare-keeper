import React from 'react';

interface CloudflareLogoProps {
  size: number;
  className?: string;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const CloudflareLogo: React.FC<CloudflareLogoProps> = ({ size, className, onClick }) => {
  return (
    <div 
      className={`cursor-pointer select-none touch-manipulation transform transition-transform active:scale-90 ${className || ''}`}
      style={{ width: size, height: size }}
      onMouseDown={onClick}
      onTouchStart={onClick}
    >
      <svg
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Simplified representation of the Cloudflare cloud shape */}
        <path
          d="M35.5 8.5C35.5 5.46 33.04 3 30 3C28.05 3 26.34 4.06 25.38 5.62C24.86 5.22 24.24 5 23.5 5C21.64 5 20.11 6.41 19.74 8.21C19.35 8.07 18.94 8 18.5 8C16.01 8 14 10.01 14 12.5C14 12.66 14.01 12.81 14.03 12.97C11.76 13.35 10 15.31 10 17.7C10 20.63 12.37 23 15.3 23H35.5C39.64 23 43 19.64 43 15.5C43 11.68 40.14 8.5 35.5 8.5Z"
          fill="#F38020"
        />
        <path
          d="M30 3C33.04 3 35.5 5.46 35.5 8.5C40.14 8.5 43 11.68 43 15.5C43 17.95 41.8 20.13 39.96 21.5C41.82 19.8 43 17.4 43 14.5C43 10.68 40.14 7.5 35.5 7.5C35.5 4.46 33.04 2 30 2C28.05 2 26.34 3.06 25.38 4.62C26.34 3.6 28.08 3 30 3Z"
          fill="#FAB743"
          fillOpacity="0.4"
        />
      </svg>
    </div>
  );
};