import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'
import Background from './Background'
import StartScreen from './StartScreen'
import QuestionCard from './QuestionCard'
import ResultScreen from './ResultScreen'
import { fetchQuestions, probeLlm } from '../lib/trivia'
import { readBest, saveResult } from '../lib/storage'
import { useI18n } from '../i18n/useI18n'
import './quiz.css'

export const SECONDS_PER_QUESTION = 20

const DEFAULT_CONFIG = {
  category: 'any',
  difficulty: 'any',
  amount: 10,
  timed: true,
  ai: false,
}

const CONFETTI = {
  particleCount: 110,
  spread: 78,
  startVelocity: 42,
  ticks: 240,
  scalar: 0.9,
  colors: ['#7c5cff', '#22d3ee', '#4ade80', '#fbbf24', '#fb7185'],
  disableForReducedMotion: true,
}

export default function QuizApp() {
  const { t, language } = useI18n()
  const prefersReduced = useReducedMotion()
  const [screen, setScreen] = useState('start')
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [round, setRound] = useState(null)
  const [answers, setAnswers] = useState([])
  const [index, setIndex] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [error, setError] = useState(null)
  const [llm, setLlm] = useState({ available: false })
  const [best, setBest] = useState(() => readBest())
  const [outcome, setOutcome] = useState(null)
  const startedAt = useRef(0)
  const requestId = useRef(0)

  useEffect(() => {
    let alive = true
    probeLlm().then((result) => {
      if (alive) setLlm(result)
    })
    return () => {
      alive = false
    }
  }, [])

  const startRound = useCallback(async (nextConfig) => {
    const cfg = nextConfig || config
    const id = requestId.current + 1
    requestId.current = id
    setConfig(cfg)
    setError(null)
    setScreen('loading')

    const baseOrder = language === 'tr' ? ['tr-bank', 'local'] : ['trivia-api', 'opentdb', 'local']
    const order = cfg.ai ? ['ai', ...baseOrder] : baseOrder

    try {
      const result = await fetchQuestions({
        category: cfg.category,
        difficulty: cfg.difficulty,
        amount: cfg.amount,
        language,
        order,
      })
      if (id !== requestId.current) return
      setRound(result)
      setAnswers([])
      setIndex(0)
      setStreak(0)
      setBestStreak(0)
      setOutcome(null)
      startedAt.current = Date.now()
      setScreen('quiz')
    } catch (err) {
      if (id !== requestId.current) return
      setError(err.message)
      setScreen('start')
    }
  }, [config, language])

  const finishRound = useCallback(
    (finalAnswers) => {
      const total = round.questions.length
      const score = finalAnswers.reduce((sum, a) => sum + (a?.correct ? 1 : 0), 0)
      const saved = saveResult({
        score,
        total,
        category: config.category,
        difficulty: config.difficulty,
        streak: bestStreak,
      })
      setBest(saved.best)
      setOutcome({
        score,
        total,
        pct: saved.pct,
        isRecord: saved.isRecord,
        source: round.source,
        durationMs: Date.now() - startedAt.current,
      })
      setScreen('result')

      if (!prefersReduced && saved.pct >= 70) {
        confetti({ ...CONFETTI, origin: { x: 0.22, y: 0.72 } })
        confetti({ ...CONFETTI, origin: { x: 0.78, y: 0.72 } })
      }
    },
    [round, config, bestStreak, prefersReduced],
  )

  const handleAnswer = useCallback(
    (pickedIndex) => {
      if (!round) return
      if (answers[index]) return
      const question = round.questions[index]
      const correct = pickedIndex === question.correctIndex
      const nextStreak = correct ? streak + 1 : 0

      setAnswers((prev) => {
        if (prev[index]) return prev
        const next = [...prev]
        next[index] = { pickedIndex, correct, timedOut: pickedIndex === null }
        return next
      })
      setStreak(nextStreak)
      setBestStreak((prev) => Math.max(prev, nextStreak))
    },
    [round, index, answers, streak],
  )

  const handleNext = useCallback(() => {
    if (!round) return
    if (!answers[index]) return
    if (index === round.questions.length - 1) {
      finishRound(answers)
      return
    }
    setIndex((prev) => prev + 1)
  }, [round, answers, index, finishRound])

  const score = answers.reduce((sum, a) => sum + (a?.correct ? 1 : 0), 0)

  return (
    <>
      <Background />
      <main className="shell">
        {screen === 'start' && (
          <StartScreen
            key="start"
            config={config}
            onChange={setConfig}
            onStart={startRound}
            loading={false}
            llm={llm}
            best={best}
            error={error}
          />
        )}

        {screen === 'loading' && (
          <motion.div
            key="loading"
            className="card loading"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="loading__orb" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="loading__text">{t('loading.title')}</p>
            <p className="loading__sub">{t('loading.sub')}</p>
          </motion.div>
        )}

        {screen === 'quiz' && round && (
          <QuestionCard
            key="quiz"
            question={round.questions[index]}
            index={index}
            total={round.questions.length}
            answer={answers[index] || null}
            onAnswer={handleAnswer}
            onNext={handleNext}
            timed={config.timed}
            seconds={SECONDS_PER_QUESTION}
            score={score}
            streak={streak}
            source={round.source}
          />
        )}

        {screen === 'result' && round && outcome && (
          <ResultScreen
            key="result"
            outcome={outcome}
            questions={round.questions}
            answers={answers}
            bestStreak={bestStreak}
            best={best}
            onReplay={() => startRound(config)}
            onNewSet={() => startRound({ ...config })}
            onHome={() => setScreen('start')}
          />
        )}
      </main>
    </>
  )
}
