import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import th from './locales/th.json';
import en from './locales/en.json';

function getSavedLang(): string {
  try {
    return localStorage.getItem('lang') || 'th';
  } catch {
    return 'th';
  }
}

i18n.use(initReactI18next).init({
  resources: {
    th: { translation: th },
    en: { translation: en },
  },
  lng: getSavedLang(),
  fallbackLng: 'th',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('lang', lng);
  } catch {
  }
  document.documentElement.lang = lng;
});

export default i18n;
