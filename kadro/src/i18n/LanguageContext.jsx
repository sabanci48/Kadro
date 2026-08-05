import { createContext, useContext, useState } from 'react'
import en from './en'
import tr from './tr'

const translations = { en, tr }

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('kadro_lang') || 'en')

  function setLang(l) {
    localStorage.setItem('kadro_lang', l)
    setLangState(l)
  }

  function t(key) {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
