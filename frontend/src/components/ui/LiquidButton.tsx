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
        border border-white/80
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_-4px_rgba(0,0,0,0.08)]
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)]
        active:scale-95 active:shadow-inner active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_-4px_rgba(0,0,0,0.08)]
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
