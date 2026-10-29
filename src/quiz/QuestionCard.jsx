import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import ProgressBar from './ProgressBar'
import { ArrowRightIcon, CheckIcon, CrossIcon, FlameIcon, TimerIcon, TrophyIcon } from './Icons'
import { categoryLabel, difficultyLabel } from '../i18n/labels'
import { useI18n } from '../i18n/useI18n'

const LETTERS = ['A', 'B', 'C', 'D']
const RADIUS = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function optionStateFor(index, question, answer) {
  if (!answer) return ''
  if (index === question.correctIndex) return 'is-correct'
  if (index === answer.pickedIndex) return 'is-wrong'
  return 'is-dimmed'
}

export default function QuestionCard({
  question,
  index,
  total,
  answer,
  onAnswer,
  onNext,
  timed,
  seconds,
  score,
  streak,
  source,
}) {
  const { t } = useI18n()
  const prefersReduced = useReducedMotion()
  const answered = Boolean(answer)
  const isLast = index === total - 1
  const [remaining, setRemaining] = useState(seconds * 1000)
  const answeredRef = useRef(answered)

  const onAnswerRef = useRef(onAnswer)
  const onNextRef = useRef(onNext)
  useEffect(() => {
    onAnswerRef.current = onAnswer
    onNextRef.current = onNext
    answeredRef.current = answered
  })

  useEffect(() => {
    setRemaining(seconds * 1000)
    if (!timed || answered) return undefined

    const started = performance.now()
    const timer = setInterval(() => {
      const left = seconds * 1000 - (performance.now() - started)
      if (left <= 0) {
        clearInterval(timer)
        setRemaining(0)
        if (!answeredRef.current) onAnswerRef.current(null)
      } else {
        setRemaining(left)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [timed, answered, seconds, question.id])

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key
      if (key >= '1' && key <= '4') {
        event.preventDefault()
        if (!answeredRef.current) onAnswerRef.current(Number(key) - 1)
        return
      }
      if (key === 'Enter' && answeredRef.current) {
        event.preventDefault()
        onNextRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const timeLeft = Math.max(0, Math.min(1, remaining / (seconds * 1000)))
  const urgent = timed && !answered && timeLeft <= 0.3
  const feedbackTone = !answer ? '' : answer.correct ? 'is-good' : 'is-bad'
  const correctText = question.answers[question.correctIndex]
  const secondsLeft = Math.ceil(remaining / 1000)

  return (
    <motion.section
      className="card quiz"
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      aria-labelledby="question-text"
    >
      <header className="quiz__head">
        <div className="quiz__pills">
          <span className="pill">{categoryLabel(question.category, t)}</span>
          <span className="pill pill--ghost">{difficultyLabel(question.difficulty, t)}</span>
        </div>

        <div className="quiz__stats">
          <span className="stat" title={t('quiz.streak')}>
            <FlameIcon width={15} height={15} /> {streak}
          </span>
          <span className="stat" title={t('quiz.score')}>
            <TrophyIcon width={15} height={15} /> {score}
          </span>
          {timed && (
            <span
              className={`ring${urgent ? ' is-urgent' : ''}${answered ? ' is-done' : ''}`}
              title={t('quiz.secondsLeft', { n: secondsLeft })}
              aria-label={t('quiz.secondsLeft', { n: secondsLeft })}
            >
              <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
                <circle className="ring__track" cx="19" cy="19" r={RADIUS} />
                <circle
                  className="ring__fill"
                  cx="19"
                  cy="19"
                  r={RADIUS}
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - timeLeft)}
                />
              </svg>
              <span className="ring__value">{secondsLeft}</span>
            </span>
          )}
        </div>
      </header>

      <ProgressBar
        value={(index + 1) / total}
        label={t('quiz.progress', { current: index + 1, total })}
        ariaLabel={t('quiz.progressBar')}
      />

      <h2 id="question-text" className="quiz__question">
        {question.question}
      </h2>

      <div className="options" role="group" aria-labelledby="question-text">
        {question.answers.map((text, optionIndex) => {
          const stateClass = optionStateFor(optionIndex, question, answer)
          return (
            <motion.button
              key={`${question.id}-${optionIndex}`}
              type="button"
              className={`option ${stateClass}`}
              onClick={() => onAnswer(optionIndex)}
              disabled={answered}
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReduced ? 0 : 0.045 * optionIndex,
                type: 'spring',
                stiffness: 280,
                damping: 26,
              }}
              whileHover={answered || prefersReduced ? undefined : { y: -2 }}
              whileTap={answered || prefersReduced ? undefined : { scale: 0.99 }}
            >
              <span className="option__key">{LETTERS[optionIndex]}</span>
              <span className="option__text">{text}</span>
              <span className="option__mark" aria-hidden="true">
                {stateClass === 'is-correct' && <CheckIcon />}
                {stateClass === 'is-wrong' && <CrossIcon />}
              </span>
              {stateClass === 'is-correct' && (
                <span className="sr-only">{t('quiz.correctAnswer')}</span>
              )}
              {stateClass === 'is-wrong' && <span className="sr-only">{t('quiz.yourWrong')}</span>}
            </motion.button>
          )
        })}
      </div>

      <div className={`feedback ${feedbackTone}`} aria-live="polite">
        {!answer && (
          <span className="feedback__idle">
            <TimerIcon width={15} height={15} /> {t('quiz.pick')}
          </span>
        )}
        {answer && answer.correct && (
          <span>
            <CheckIcon width={16} height={16} /> {t('quiz.correct')}
          </span>
        )}
        {answer && answer.timedOut && (
          <span>
            <CrossIcon width={16} height={16} /> {t('quiz.timeout', { answer: correctText })}
          </span>
        )}
        {answer && !answer.correct && !answer.timedOut && (
          <span>
            <CrossIcon width={16} height={16} /> {t('quiz.wrong', { answer: correctText })}
          </span>
        )}
      </div>

      <footer className="quiz__foot">
        <span className="source-tag">{t(`source.${source}`, null, source)}</span>
        <button className="btn" onClick={onNext} disabled={!answered}>
          {answered ? (isLast ? t('quiz.results') : t('quiz.next')) : t('quiz.pickButton')}
          <ArrowRightIcon />
        </button>
      </footer>
    </motion.section>
  )
}
