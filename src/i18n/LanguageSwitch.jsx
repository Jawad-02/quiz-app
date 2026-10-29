import { LOCALES } from './translations'
import { useI18n } from './useI18n'

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="lang" role="group" aria-label={t('lang.switch')}>
      {LOCALES.map((locale) => (
        <button
          key={locale.code}
          type="button"
          className={`lang__btn${language === locale.code ? ' is-on' : ''}`}
          aria-pressed={language === locale.code}
          title={locale.label}
          onClick={() => setLanguage(locale.code)}
        >
          {locale.short}
        </button>
      ))}
    </div>
  )
}
