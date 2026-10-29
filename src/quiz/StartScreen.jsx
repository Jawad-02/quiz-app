import { motion } from 'motion/react'
import { ArrowRightIcon, BoltIcon, SparkIcon, TrophyIcon } from './Icons'
import LanguageSwitch from '../i18n/LanguageSwitch'
import { useI18n } from '../i18n/useI18n'
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS } from '../lib/trivia'

function Chip({ active, children, ...rest }) {
  return (
    <button type="button" className={`chip${active ? ' is-on' : ''}`} aria-pressed={active} {...rest}>
      {children}
    </button>
  )
}

export default function StartScreen({ config, onChange, onStart, loading, llm, best, error }) {
  const { t } = useI18n()
  const set = (patch) => onChange({ ...config, ...patch })
  const aiLocked = !llm.available

  return (
    <motion.section
      className="card start"
      initial={{ opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      aria-labelledby="start-title"
    >
      <div className="start__top">
        <span className="badge">
          <SparkIcon width={15} height={15} /> {t('start.badge')}
        </span>
        <LanguageSwitch />
      </div>

      <h1 id="start-title" className="start__title">
        {t('app.name')} <span className="grad">{t('app.accent')}</span>
      </h1>
      <p className="start__lede">{t('app.tagline')}</p>

      <div className="field">
        <div className="field__label" id="topic-label">
          {t('start.topic')}
        </div>
        <div className="chips" role="group" aria-labelledby="topic-label">
          {CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              active={config.category === category.id}
              onClick={() => set({ category: category.id })}
            >
              {t(`topic.${category.id}`)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <div className="field__label" id="difficulty-label">
            {t('start.difficulty')}
          </div>
          <div className="segmented" role="group" aria-labelledby="difficulty-label">
            {DIFFICULTIES.map((difficulty) => (
              <Chip
                key={difficulty.id}
                active={config.difficulty === difficulty.id}
                onClick={() => set({ difficulty: difficulty.id })}
              >
                {t(`difficulty.${difficulty.id}`)}
              </Chip>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field__label" id="count-label">
            {t('start.count')}
          </div>
          <div className="segmented" role="group" aria-labelledby="count-label">
            {QUESTION_COUNTS.map((count) => (
              <Chip
                key={count}
                active={config.amount === count}
                onClick={() => set({ amount: count })}
              >
                {count}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="toggles">
        <label className="switch">
          <input
            type="checkbox"
            checked={config.timed}
            onChange={(event) => set({ timed: event.target.checked })}
          />
          <span className="switch__ui" aria-hidden="true" />
          <span className="switch__label">{t('start.timer')}</span>
        </label>

        <label
          className={`switch${aiLocked ? ' is-locked' : ''}`}
          title={aiLocked ? t('start.aiLocked') : t('start.aiReady', { model: llm.model || 'AI' })}
        >
          <input
            type="checkbox"
            disabled={aiLocked}
            checked={config.ai && !aiLocked}
            onChange={(event) => set({ ai: event.target.checked })}
          />
          <span className="switch__ui" aria-hidden="true" />
          <span className="switch__label">
            <BoltIcon width={15} height={15} /> {t('start.ai')}
            {aiLocked && <span className="switch__hint">{t('start.aiHint')}</span>}
          </span>
        </label>
      </div>

      {error && (
        <p className="alert" role="alert">
          {t('start.error', { error })}
        </p>
      )}
      {!error && config.ai && llm.available && <p className="note">{t('start.aiNote')}</p>}

      {best && (
        <p className="start__best">
          <TrophyIcon width={16} height={16} />
          {t('start.best', { pct: best.pct, score: best.score, total: best.total })}
        </p>
      )}

      <button className="btn btn--xl" onClick={() => onStart(config)} disabled={loading}>
        {loading ? t('loading.title') : t('start.start')}
        <ArrowRightIcon />
      </button>

      <p className="start__foot">{t('start.foot')}</p>
    </motion.section>
  )
}
