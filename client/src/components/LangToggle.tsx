import { useTranslation } from 'react-i18next';

export default function LangToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const toggle = () => {
    i18n.changeLanguage(current === 'th' ? 'en' : 'th');
  };

  return (
    <button
      onClick={toggle}
      className="relative font-mono text-xs tracking-widest px-3 py-1.5 border border-hairline text-text-muted hover:text-accent-gold hover:border-accent-gold/50 transition-colors duration-200 uppercase cursor-pointer"
      aria-label="Toggle language"
    >
      <span className={current === 'th' ? 'text-text' : 'text-text-muted'}>TH</span>
      <span className="text-text-muted mx-1">/</span>
      <span className={current === 'en' ? 'text-text' : 'text-text-muted'}>EN</span>
    </button>
  );
}
