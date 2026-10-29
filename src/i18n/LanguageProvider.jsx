import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context'
import { detectLanguage, translations, translate } from './translations'

const STORAGE_KEY = 'quiz:lang'

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && translations[saved]) return saved
  } catch {
    // storage can be blocked, fall through to detection
  }
  const languages =
    typeof navigator !== 'undefined'
      ? [navigator.language, ...(navigator.languages || [])]
      : ['en']
  return detectLanguage(languages.filter(Boolean))
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // persistence is a nicety, never a blocker
    }
  }, [language])

  const t = useCallback(
    (key, vars, fallback) => translate(translations[language], key, vars, fallback),
    [language],
  )

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
