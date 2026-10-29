import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  decodeEntities,
  normalizeQuestion,
  shuffle,
} from './trivia'
import { fallbackQuestions } from './fallbackQuestions'

describe('decodeEntities', () => {
  it('decodes named and numeric entities from Open Trivia DB', () => {
    expect(decodeEntities('What&#039;s &quot;this&quot;?')).toBe('What\'s "this"?')
    expect(decodeEntities('A &amp; B')).toBe('A & B')
  })

  it('leaves plain text untouched', () => {
    expect(decodeEntities('No entities here')).toBe('No entities here')
    expect(decodeEntities('Proxima Centauri')).toBe('Proxima Centauri')
  })

  it('keeps unknown entities as written', () => {
    expect(decodeEntities('&unknownthing;')).toBe('&unknownthing;')
  })
})

describe('shuffle', () => {
  it('keeps every item exactly once', () => {
    const source = [1, 2, 3, 4, 5]
    const result = shuffle(source)
    expect(result).toHaveLength(source.length)
    expect([...result].sort()).toEqual([...source].sort())
  })

  it('does not mutate the input', () => {
    const source = ['a', 'b', 'c']
    shuffle(source)
    expect(source).toEqual(['a', 'b', 'c'])
  })
})

describe('normalizeQuestion', () => {
  const raw = {
    id: 'abc',
    question: 'Which sea separates Europe and Asia?',
    correctAnswer: 'Marmara Sea',
    incorrectAnswers: ['Black Sea', 'Aegean Sea', 'Caspian Sea'],
    category: 'geography',
    difficulty: 'medium',
  }

  it('produces four answers with the correct index pointing at the right one', () => {
    const question = normalizeQuestion(raw, 'trivia-api')
    expect(question.answers).toHaveLength(4)
    expect(question.answers[question.correctIndex]).toBe('Marmara Sea')
    expect(question.source).toBe('trivia-api')
  })

  it('scrambles the answer order across many runs', () => {
    const positions = new Set()
    for (let i = 0; i < 60; i += 1) {
      positions.add(normalizeQuestion(raw, 'trivia-api').correctIndex)
    }
    expect(positions.size).toBeGreaterThan(1)
  })

  it('rejects malformed records', () => {
    expect(normalizeQuestion(null, 'x')).toBeNull()
    expect(normalizeQuestion({ question: '', correctAnswer: 'a', incorrectAnswers: ['b'] }, 'x')).toBeNull()
    expect(normalizeQuestion({ question: 'ok?', correctAnswer: 'a', incorrectAnswers: [] }, 'x')).toBeNull()
  })
})

describe('CATEGORIES', () => {
  it('exposes a first "any" option and unique ids', () => {
    expect(CATEGORIES[0].id).toBe('any')
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(CATEGORIES.length)
  })
})

describe('fallbackQuestions', () => {
  it('always returns usable questions with a valid correct index', () => {
    const questions = fallbackQuestions({ category: 'any', difficulty: 'any', amount: 10 })
    expect(questions.length).toBeGreaterThanOrEqual(3)
    for (const question of questions) {
      expect(question.answers).toHaveLength(4)
      expect(question.correctIndex).toBeGreaterThanOrEqual(0)
      expect(question.correctIndex).toBeLessThan(4)
      expect(question.question).not.toMatch(/\u2014/)
    }
  })

  it('falls back to the whole pack when a topic is too thin', () => {
    const questions = fallbackQuestions({ category: 'music', difficulty: 'hard', amount: 10 })
    expect(questions.length).toBeGreaterThanOrEqual(3)
  })

  it('never repeats the same question id in one round', () => {
    const ids = fallbackQuestions({ category: 'any', amount: 15 }).map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
