import { useContext } from 'react'
import { LanguageContext } from './context'

export function useI18n() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useI18n must be used inside a LanguageProvider')
  return value
}
