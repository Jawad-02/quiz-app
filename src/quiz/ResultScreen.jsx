import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  CrossIcon,
  FlameIcon,
  LayersIcon,
  ReplayIcon,
  TimerIcon,
  TrophyIcon,
} from './Icons'
import { useI18n } from '../i18n/useI18n'

const RADIUS = 66
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function tierFor(pct) {
  if (pct === 100) return 'flawless'
  if (pct >= 80) return 'sharp'
  if (pct >= 60) return 'solid'
  if (pct >= 40) return 'close'
  return 'rough'
}

function formatDuration(ms) {
  const total = Math.max(1, Math.round(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return minutes ? `${minutes}m ${String(seconds).padStart(2, '0')}s` : `${seconds}s`
}

export default function ResultScreen({
  outcome,
  questions,
  answers,
  bestStreak,
  best,
  onReplay,
  onNewSet,
  onHome,
}) {
  const { t } = useI18n()
  const prefersReduced = useReducedMotion()
  const { score, total, pct, isRecord, source, durationMs } = outcome
  const timedOut = answers.filter((a) => a?.timedOut).length
  const missed = total - score - timedOut
  const tier = tierFor(pct)

  return (
    <motion.section
      className="card result"
      initial={{ opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 210, damping: 26 }}
      aria-labelledby="result-title"
    >
      <div className="result__top">
        <div className="scoreRing">
          <svg viewBox="0 0 160 160" role="img" aria-label={t('result.ringLabel', { pct })}>
            <circle className="scoreRing__track" cx="80" cy="80" r={RADIUS} />
            <motion.circle
              className="scoreRing__fill"
              cx="80"
              cy="80"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              initial={{
                strokeDashoffset: prefersReduced ? CIRCUMFERENCE * (1 - pct / 100) : CIRCUMFERENCE,
              }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - pct / 100) }}
              transition={{ duration: prefersReduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="scoreRing__label">
            <span className="scoreRing__pct">{pct}%</span>
            <span className="scoreRing__raw">
              {score} / {total}
            </span>
          </div>
        </div>

        <div className="result__copy">
          {isRecord && pct >= 50 && (
            <span className="badge badge--gold">
              <TrophyIcon width={15} height={15} /> {t('result.record')}
            </span>
          )}
          <h2 id="result-title">{t(`result.headline.${tier}`)}</h2>
          <p>{t(`result.line.${tier}`)}</p>
          <div className="result__meta">
            <span className="pill pill--ghost">{t(`source.${source}`, null, source)}</span>
            <span className="pill pill--ghost">
              <TimerIcon width={14} height={14} /> {formatDuration(durationMs)}
            </span>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <CheckIcon width={16} height={16} />
          <span className="stat-card__value">{score}</span>
          <span className="stat-card__label">{t('result.correct')}</span>
        </div>
        <div className="stat-card">
          <CrossIcon width={16} height={16} />
          <span className="stat-card__value">{missed}</span>
          <span className="stat-card__label">{t('result.wrong')}</span>
        </div>
        <div className="stat-card">
          <TimerIcon width={16} height={16} />
          <span className="stat-card__value">{timedOut}</span>
          <span className="stat-card__label">{t('result.timeout')}</span>
        </div>
        <div className="stat-card">
          <FlameIcon width={16} height={16} />
          <span className="stat-card__value">{bestStreak}</span>
          <span className="stat-card__label">{t('result.streak')}</span>
        </div>
      </div>

      {best && !isRecord && (
        <p className="result__best">
          {t('result.keepBest', { pct: best.pct, score: best.score, total: best.total })}
        </p>
      )}

      <div className="actions">
        <button className="btn btn--xl" onClick={onNewSet}>
          <BoltIcon /> {t('result.newQuestions')}
          <ArrowRightIcon />
        </button>
        <button className="btn btn--ghost" onClick={onReplay}>
          <ReplayIcon /> {t('result.replay')}
        </button>
        <button className="btn btn--ghost" onClick={onHome}>
          <LayersIcon /> {t('result.changeTopic')}
        </button>
      </div>

      <details className="review">
        <summary>{t('result.review', { n: total })}</summary>
        <ol className="review__list">
          {questions.map((question, questionIndex) => {
            const answer = answers[questionIndex]
            const correct = question.answers[question.correctIndex]
            const picked =
              answer && answer.pickedIndex !== null ? question.answers[answer.pickedIndex] : null
            return (
              <li
                key={question.id}
                className={`review__item${answer?.correct ? ' is-good' : ' is-bad'}`}
              >
                <div className="review__q">
                  {answer?.correct ? (
                    <CheckIcon width={15} height={15} />
                  ) : (
                    <CrossIcon width={15} height={15} />
                  )}
                  <span>{question.question}</span>
                </div>
                <div className="review__a">
                  <span className="review__picked">
                    {picked ? t('result.yourAnswer', { answer: picked }) : t('result.noAnswer')}
                  </span>
                  {!answer?.correct && (
                    <span className="review__correct">
                      {t('result.answer', { answer: correct })}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </details>
    </motion.section>
  )
}
