import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#c0c5d7]/10
        backdrop-blur-2xl 
        backdrop-saturate-150 
        border border-[#d6d7e1]/20 
        shadow-[0_8px_32px_rgba(0,0,0,0.2)] 
        rounded-[32px] 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
