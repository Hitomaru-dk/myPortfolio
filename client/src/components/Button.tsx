import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-display font-semibold text-sm px-5 py-2.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase';

  const variants: Record<string, string> = {
    primary:
      'bg-accent-blue text-white hover:bg-accent-blue/85 active:scale-[0.97]',
    danger:
      'bg-accent-red text-white hover:bg-accent-red/85 active:scale-[0.97]',
    outline:
      'bg-transparent border border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10 active:scale-[0.97]',
    ghost:
      'bg-transparent text-text-muted hover:text-text hover:bg-surface active:scale-[0.97]',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
