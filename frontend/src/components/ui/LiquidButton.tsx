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
        bg-white/60
        backdrop-blur-xl backdrop-saturate-150
        border-t border-l border-white/90 border-b border-r border-white/20
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.06),0_15px_30px_-10px_rgba(0,0,0,0.15)]
        transition-all duration-300 ease-out
        hover:-translate-y-[1px] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.06),0_20px_40px_-10px_rgba(0,0,0,0.2)]
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
