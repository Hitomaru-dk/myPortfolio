interface TechTagProps {
  label: string;
  variant?: 'default' | 'gold';
}

export default function TechTag({ label, variant = 'default' }: TechTagProps) {
  const colors =
    variant === 'gold'
      ? 'border-accent-gold/40 text-accent-gold'
      : 'border-accent-blue/30 text-accent-blue';

  return (
    <span
      className={`inline-block font-mono text-xs px-2.5 py-1 border ${colors} bg-surface/60 tracking-wide uppercase`}
    >
      {label}
    </span>
  );
}
