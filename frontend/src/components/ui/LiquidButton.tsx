import React from 'react';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  gradient?: boolean;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary',
  gradient = false,
  ...props 
}) => {
  const getVariantStyles = () => {
    if (variant === 'danger') return 'text-rose-600 hover:bg-rose-50';
    if (gradient) return 'text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 border-white/40 shadow-md';
    return 'text-slate-700 hover:bg-white/70';
  };

  return (
    <button
      {...props}
      className={`
        relative overflow-hidden
        px-6 py-2.5 font-medium text-sm
        rounded-full
        bg-gradient-to-br from-white/60 via-white/20 to-white/5
        backdrop-blur-xl backdrop-saturate-150
        border-t border-l border-white/90 border-b border-r border-white/20
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.06),0_15px_30px_-10px_rgba(0,0,0,0.15)]
        transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.06),0_30px_50px_-15px_rgba(0,0,0,0.25)]
        active:scale-95 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.06),0_15px_30px_-10px_rgba(0,0,0,0.15)]
        ${getVariantStyles()}
        ${className}
      `}
    >
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </button>
  );
};
