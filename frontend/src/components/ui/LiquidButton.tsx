import React from 'react';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const variants: Record<string, string> = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-teal-500
      text-white font-medium
      shadow-[0_4px_20px_rgba(52,211,153,0.25)]
      hover:shadow-[0_6px_28px_rgba(52,211,153,0.35)]
      hover:brightness-110
      border-0
    `,
    secondary: `
      bg-white/[0.04] text-[var(--text)]
      border border-[var(--border)]
      hover:bg-white/[0.08] hover:border-[var(--border-light)]
      backdrop-blur-sm
    `,
    danger: `
      bg-rose-500/10 text-rose-400
      border border-rose-500/20
      hover:bg-rose-500/20 hover:border-rose-500/30
    `,
    ghost: `
      text-[var(--text-muted)]
      hover:text-[var(--text)] hover:bg-white/[0.04]
      border border-transparent
    `,
  };

  return (
    <button
      {...props}
      className={`
        relative overflow-hidden
        px-5 py-2.5 text-sm
        rounded-2xl
        transition-all duration-300 ease-out
        active:scale-[0.97]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
