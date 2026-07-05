import React from 'react';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({ children, className = '', onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative glass overflow-hidden
        ${hover ? 'hover:-translate-y-[1px]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Top edge highlight — mimics light refraction on glass */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />
      
      {/* Left edge subtle highlight */}
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
