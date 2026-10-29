import { motion } from 'motion/react'
import {
  ArrowRightIcon,
  BoltIcon,
  SparkIcon,
  TrophyIcon,
} from './Icons'
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS } from '../lib/trivia'

function Chip({ active, children, ...rest }) {
  return (
    <button type="button" className={`chip${active ? ' is-on' : ''}`} aria-pressed={active} {...rest}>
      {children}
    </button>
  )
}

export default function StartScreen({ config, onChange, onStart, loading, llm, best, error }) {
  const set = (patch) => onChange({ ...config, ...patch })
  const aiLocked = !llm.available

  return (
    <motion.section
      className="card start"
      initial={{ opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      aria-labelledby="start-title"
    >
      <span className="badge">
        <SparkIcon width={15} height={15} /> Fresh questions every round
      </span>

      <h1 id="start-title" className="start__title">
        Quiz <span className="grad">Arcade</span>
      </h1>
      <p className="start__lede">
        Live trivia, instant feedback and streaks worth chasing. Pick a lane, beat the clock.
      </p>

      <div className="field">
        <div className="field__label" id="topic-label">
          Topic
        </div>
        <div className="chips" role="group" aria-labelledby="topic-label">
          {CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              active={config.category === category.id}
              onClick={() => set({ category: category.id })}
            >
              {category.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <div className="field__label" id="difficulty-label">
            Difficulty
          </div>
          <div className="segmented" role="group" aria-labelledby="difficulty-label">
            {DIFFICULTIES.map((difficulty) => (
              <Chip
                key={difficulty.id}
                active={config.difficulty === difficulty.id}
                onClick={() => set({ difficulty: difficulty.id })}
              >
                {difficulty.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field__label" id="count-label">
            Questions
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
          <span className="switch__label">20s timer</span>
        </label>

        <label
          className={`switch${aiLocked ? ' is-locked' : ''}`}
          title={
            aiLocked
              ? 'Add OPENAI_API_KEY to your .env file, restart the dev server, then reload'
              : `AI questions via ${llm.model || 'your model'}`
          }
        >
          <input
            type="checkbox"
            disabled={aiLocked}
            checked={config.ai && !aiLocked}
            onChange={(event) => set({ ai: event.target.checked })}
          />
          <span className="switch__ui" aria-hidden="true" />
          <span className="switch__label">
            <BoltIcon width={15} height={15} /> AI questions
            {aiLocked && <span className="switch__hint">add API key</span>}
          </span>
        </label>
      </div>

      {error && (
        <p className="alert" role="alert">
          Could not reach the question services ({error}). The offline pack was used instead.
        </p>
      )}
      {!error && config.ai && llm.available && (
        <p className="note">
          AI mode is on. If the model call fails, live trivia takes over so the round always starts.
        </p>
      )}

      {best && (
        <p className="start__best">
          <TrophyIcon width={16} height={16} /> Personal best {best.pct}% ({best.score}/{best.total})
        </p>
      )}

      <button className="btn btn--xl" onClick={() => onStart(config)} disabled={loading}>
        {loading ? 'Dealing questions' : 'Start quiz'}
        <ArrowRightIcon />
      </button>

      <p className="start__foot">
        Questions from The Trivia API and Open Trivia DB. Keyboard: press 1 to 4 to answer, Enter to
        continue.
      </p>
    </motion.section>
  )
}
