export default function SectionHeader({ label, title, description, className = '', light = false }) {
  return (
    <div className={`text-center max-w-3xl mx-auto mb-14 sm:mb-16 ${className}`}>
      <p className={`landing-section-label mb-3 ${light ? 'landing-section-label--light' : ''}`}>{label}</p>
      <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-5 ${light ? 'text-white' : 'text-foreground'}`}>
        {title}
      </h2>
      {description ? (
        <p className={`text-base sm:text-lg leading-relaxed ${light ? 'text-cream-200/85' : 'text-muted-foreground'}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
