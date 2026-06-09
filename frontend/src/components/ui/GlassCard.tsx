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
        bg-white/10 
        backdrop-blur-lg 
        backdrop-saturate-150 
        border border-white/10 
        shadow-2xl shadow-black/40 
        rounded-2xl 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
