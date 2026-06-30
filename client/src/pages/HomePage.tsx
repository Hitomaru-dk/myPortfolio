import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair } from 'lucide-react';
import Button from '../components/Button';
import TechTag from '../components/TechTag';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="relative">
      {/* Hero section with clip-path */}
      <div className="hero-clip scanline-bg relative min-h-screen flex items-center">
        {/* Faint grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-accent-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-blue) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 w-full">
          {/* Greeting line with typewriter cursor */}
          <div className="animate-fade-in-up flex items-center gap-3 mb-4">
            <Crosshair size={16} className="text-accent-blue" />
            <span className="font-mono text-xs text-accent-blue tracking-[0.25em] uppercase typewriter-cursor">
              {t('home.greeting')}
            </span>
          </div>

          {/* Name */}
          <h1 className="animate-fade-in-up font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text mb-4 tracking-tight whitespace-nowrap">
            {t('home.name')}
            <span className="text-accent-gold">.</span>
          </h1>

          {/* Headline */}
          <p className="animate-fade-in-up-delay font-display text-xl md:text-2xl text-text-muted tracking-wide mb-6">
            {t('home.headline')}
          </p>

          {/* Intro paragraph */}
          <p className="animate-fade-in-up-delay font-body text-base md:text-lg text-text-muted max-w-2xl leading-relaxed mb-10">
            {t('home.intro')}
          </p>

          {/* Designation plaque */}
          <div className="animate-fade-in-up-delay-2 inline-block mb-10">
            <div className="bg-surface border border-hairline p-5 relative hover:border-accent-blue/30 transition-colors duration-300">
              {/* Gold accent top line */}
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-accent-gold" />

              <p className="font-mono text-[10px] text-text-muted tracking-[0.3em] uppercase mb-3">
                {t('home.designation')}
              </p>
              <div className="flex flex-wrap gap-2">
                <TechTag label={t('home.role1')} variant="gold" />
                <TechTag label={t('home.role2')} />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-fade-in-up-delay-2">
            <Link to="/projects">
              <Button>
                {t('home.cta')}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
