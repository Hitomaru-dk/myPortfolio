import { useTranslation } from 'react-i18next';

/**
 * Premium loading spinner with orbiting dot, glow pulse, and crosshair motif.
 * Matches the portfolio's targeting/military-tech aesthetic.
 */
export default function Spinner() {
  const { t } = useTranslation();

  return (
    <div className="spinner-container py-24">
      <div className="spinner-ring">
        <div className="spinner-arc" />
        <div className="spinner-dot" />
        <div className="spinner-crosshair" />
      </div>
      <span className="spinner-text">{t('loading', 'Loading...')}</span>
    </div>
  );
}
