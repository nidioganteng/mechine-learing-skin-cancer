import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import id from './locales/id.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, id: { translation: id } },
    lng: localStorage.getItem('lang') || 'id',
    fallbackLng: 'id',
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
})

export default i18n
