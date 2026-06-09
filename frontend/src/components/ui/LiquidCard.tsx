import React from 'react';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative glass overflow-hidden ${className}`}
    >
      {/* Subtle top glare to enhance the acrylic feel */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
