import { describe, expect, it } from 'vitest'
import { detectLanguage, flattenKeys, translate, translations } from './translations'
import { categoryLabel, difficultyLabel } from './labels'

const enKeys = flattenKeys(translations.en)
const trKeys = flattenKeys(translations.tr)
const tr = (key, vars, fallback) => translate(translations.tr, key, vars, fallback)

describe('translations', () => {
  it('has the same keys in every language', () => {
    expect([...trKeys].sort()).toEqual([...enKeys].sort())
  })

  it('has no empty strings', () => {
    for (const language of Object.keys(translations)) {
      for (const key of flattenKeys(translations[language])) {
        expect(translate(translations[language], key)).not.toBe('')
      }
    }
  })

  it('interpolates variables and leaves unknown placeholders alone', () => {
    expect(translate(translations.en, 'quiz.progress', { current: 3, total: 10 })).toBe(
      'Question 3 of 10',
    )
    expect(translate(translations.tr, 'quiz.progress', { current: 3, total: 10 })).toBe('Soru 3 / 10')
    expect(translate(translations.en, 'quiz.wrong', {})).toContain('{answer}')
  })

  it('falls back to a tidied key when a translation is missing', () => {
    expect(translate(translations.en, 'nope.missing_key')).toBe('Missing key')
    expect(translate(translations.en, 'nope.missing_key', null, 'Custom')).toBe('Custom')
  })

  it('detects Turkish from the browser language list', () => {
    expect(detectLanguage(['tr-TR', 'en-US'])).toBe('tr')
    expect(detectLanguage(['de-DE', 'tr'])).toBe('tr')
    expect(detectLanguage(['en-GB'])).toBe('en')
    expect(detectLanguage([])).toBe('en')
  })
})

describe('label helpers', () => {
  it('maps API categories onto translated labels', () => {
    expect(categoryLabel('science', tr)).toBe('Bilim')
    expect(categoryLabel('Film And Tv', tr)).toBe('Sinema ve TV')
    expect(categoryLabel(' Entertainment: Music ', tr)).toBe('Entertainment: Music')
  })

  it('maps difficulties, including the ones the APIs return', () => {
    expect(difficultyLabel('easy', tr)).toBe('Kolay')
    expect(difficultyLabel('medium', tr)).toBe('Orta')
    expect(difficultyLabel(undefined, tr)).toBe('')
  })
})
