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
    if (variant === 'danger') return 'text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20';
    if (gradient) return 'text-white bg-[var(--surface-strong)] border-[var(--border-light)] shadow-md hover:bg-white/5';
    return 'text-[var(--text)] hover:bg-[var(--surface-strong)] border-[var(--border)]';
  };

  return (
    <button
      {...props}
      className={`
        relative overflow-hidden
        px-6 py-2.5 font-medium text-sm
        rounded-full
        glass
        hover:-translate-y-[1px] hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.3)]
        active:scale-95 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
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
