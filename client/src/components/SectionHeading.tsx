interface SectionHeadingProps {
  title: string;
  className?: string;
}

export default function SectionHeading({ title, className = '' }: SectionHeadingProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="font-display font-semibold text-lg text-text tracking-wide uppercase mb-2">
        {title}
      </h2>
      <hr className="hairline" />
    </div>
  );
}
