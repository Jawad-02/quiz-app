import { describe, expect, it } from 'vitest'
import { turkishBank, turkishQuestions } from './turkishBank'

const CATEGORY_GROUPS = {
  general_knowledge: ['general_knowledge'],
  science: ['science', 'technology', 'space'],
  history: ['history'],
  geography: ['geography'],
  arts_and_literature: ['arts_and_literature'],
  film_and_tv: ['film_and_tv'],
  music: ['music'],
  sport_and_leisure: ['sport_and_leisure'],
  food_and_drink: ['food_and_drink'],
}

describe('turkish bank', () => {
  it('has one entry per id and no duplicate ids', () => {
    const ids = turkishBank.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every question four distinct answers with a valid index', () => {
    for (const question of turkishBank) {
      expect(question.answers).toHaveLength(4)
      expect(new Set(question.answers).size).toBe(4)
      expect(question.answers.every((answer) => answer.trim().length > 0)).toBe(true)
      expect(question.correctIndex).toBeGreaterThanOrEqual(0)
      expect(question.correctIndex).toBeLessThan(4)
      expect(question.question.length).toBeGreaterThan(12)
      expect(['easy', 'medium', 'hard']).toContain(question.difficulty)
    }
  })

  it('covers every topic with a full round of questions', () => {
    for (const [category, groups] of Object.entries(CATEGORY_GROUPS)) {
      const count = turkishBank.filter((q) => groups.includes(q.category)).length
      expect(count, `${category} needs at least 10 questions`).toBeGreaterThanOrEqual(10)
      expect(turkishQuestions({ category, amount: 10 }), `${category} should fill 10`).toHaveLength(10)
    }
  })

  it('is written in Turkish, not translated English leftovers', () => {
    const turkishChars = /[çğıöşüÇĞİÖŞÜ]/
    const withTurkishChars = turkishBank.filter((q) => turkishChars.test(q.question)).length
    expect(withTurkishChars / turkishBank.length).toBeGreaterThan(0.7)
  })

  it('contains no em dash, per the project style', () => {
    for (const question of turkishBank) {
      expect(question.question).not.toMatch(/\u2014/)
      for (const answer of question.answers) expect(answer).not.toMatch(/\u2014/)
    }
  })

  it('serves the requested amount with shuffled answers and correct indices', () => {
    const questions = turkishQuestions({ category: 'any', difficulty: 'any', amount: 10 })
    expect(questions).toHaveLength(10)
    expect(new Set(questions.map((q) => q.id)).size).toBe(10)
    for (const question of questions) {
      expect(question.answers).toHaveLength(4)
      expect(question.correctIndex).toBeGreaterThanOrEqual(0)
      expect(question.correctIndex).toBeLessThan(4)
      expect(question.source).toBe('tr-bank')
      expect(question.id.startsWith('tr-bank:')).toBe(true)
    }
  })

  it('honours the category filter', () => {
    const questions = turkishQuestions({ category: 'history', amount: 6 })
    for (const question of questions) expect(question.category).toBe('history')
  })

  it('falls back to the whole bank when a topic is too thin for the request', () => {
    const questions = turkishQuestions({ category: 'food_and_drink', difficulty: 'hard', amount: 15 })
    expect(questions.length).toBeGreaterThanOrEqual(3)
  })
})
