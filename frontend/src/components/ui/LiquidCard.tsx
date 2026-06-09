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
        bg-gradient-to-br from-white/60 via-white/20 to-white/5
        backdrop-blur-xl 
        backdrop-saturate-150 
        border-t border-l border-white/90 border-b border-r border-white/20
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.06),0_35px_60px_-15px_rgba(0,0,0,0.2)]
        rounded-[32px]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.06),0_40px_70px_-15px_rgba(0,0,0,0.2)]
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
