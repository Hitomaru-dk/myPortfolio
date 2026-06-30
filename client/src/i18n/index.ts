import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import th from './locales/th.json';
import en from './locales/en.json';

const savedLang = localStorage.getItem('lang') || 'th';

i18n.use(initReactI18next).init({
  resources: {
    th: { translation: th },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'th',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
  document.documentElement.lang = lng;
});

export default i18n;
