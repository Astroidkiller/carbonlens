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
      className={`
        relative
        bg-white/60
        backdrop-blur-xl 
        backdrop-saturate-150 
        border border-white/80
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.05),0_10px_40px_-10px_rgba(0,0,0,0.08)]
        rounded-[32px]
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] hover:bg-white/70
        overflow-hidden
        ${className}
      `}
    >
      {/* Subtle top glare to enhance the acrylic feel */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
