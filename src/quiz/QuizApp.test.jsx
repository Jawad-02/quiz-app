import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuizApp from './QuizApp'
import { LanguageProvider } from '../i18n/LanguageProvider'

vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

const QUESTIONS = [
  {
    id: 't1',
    question: { text: 'Capital city of France?' },
    correctAnswer: 'Paris',
    incorrectAnswers: ['Rome', 'Madrid', 'Berlin'],
    category: 'geography',
    difficulty: 'easy',
  },
  {
    id: 't2',
    question: { text: 'Capital city of Japan?' },
    correctAnswer: 'Tokyo',
    incorrectAnswers: ['Osaka', 'Kyoto', 'Seoul'],
    category: 'geography',
    difficulty: 'easy',
  },
  {
    id: 't3',
    question: { text: 'Capital city of Australia?' },
    correctAnswer: 'Canberra',
    incorrectAnswers: ['Sydney', 'Melbourne', 'Perth'],
    category: 'geography',
    difficulty: 'easy',
  },
]

const renderApp = () =>
  render(
    <LanguageProvider>
      <QuizApp />
    </LanguageProvider>,
  )

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  vi.stubGlobal(
    'fetch',
    vi.fn((url) => {
      const target = String(url)
      if (target.includes('/api/generate')) {
        return Promise.resolve({ ok: false, json: async () => ({ available: false }) })
      }
      if (target.includes('the-trivia-api')) {
        return Promise.resolve({ ok: true, json: async () => QUESTIONS })
      }
      return Promise.resolve({ ok: false, json: async () => ({}) })
    }),
  )
})

describe('QuizApp flow', () => {
  it('loads live questions, locks the answer, advances and reports a score', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByRole('heading', { name: /Quiz Arcade/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Start quiz/i }))
    await screen.findByText('Capital city of France?')

    expect(screen.getByRole('button', { name: /Pick an answer/i })).toBeDisabled()

    const steps = [
      { question: 'Capital city of France?', answer: /Paris/ },
      { question: 'Capital city of Japan?', answer: /Tokyo/ },
      { question: 'Capital city of Australia?', answer: /Canberra/ },
    ]

    for (let i = 0; i < steps.length; i += 1) {
      await screen.findByText(steps[i].question)
      await user.click(screen.getByRole('button', { name: steps[i].answer }))
      expect(await screen.findByText(/Correct\./)).toBeInTheDocument()

      const isLast = i === steps.length - 1
      await user.click(
        await screen.findByRole('button', { name: isLast ? /See results/i : /Next question/i }),
      )
    }

    expect(await screen.findByText(/3 \/ 3/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Flawless run/i })).toBeInTheDocument()
  })

  it('marks a wrong pick and reveals the right answer', async () => {
    const user = userEvent.setup()
    const { container } = renderApp()

    await user.click(screen.getByRole('button', { name: /Start quiz/i }))
    await screen.findByText('Capital city of France?')

    await user.click(screen.getByRole('button', { name: /Berlin/ }))

    expect(await screen.findByText(/Not quite\./)).toBeInTheDocument()
    expect(container.querySelector('.option.is-correct')).toHaveTextContent('Paris')
    expect(container.querySelector('.option.is-wrong')).toHaveTextContent('Berlin')
  })
})

describe('language switching', () => {
  it('renders Turkish after pressing TR and remembers the choice', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'TR' }))

    expect(screen.getByText('Her turda yeni sorular')).toBeInTheDocument()
    expect(screen.getByText('Konu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Başla/ })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('tr')
    expect(localStorage.getItem('quiz:lang')).toBe('tr')
  })

  it('plays a Turkish round from the Turkish bank and never asks the English APIs', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'TR' }))
    await user.click(screen.getByRole('button', { name: /Başla/ }))

    const question = await screen.findByRole('heading', { level: 2 })
    expect(question.textContent).toMatch(/[çğıöşüÇĞİÖŞÜ]/)
    expect(screen.getByText(/Türkçe soru bankası/i)).toBeInTheDocument()
    expect(screen.getByText(/Soru 1 \/ 10/)).toBeInTheDocument()

    const urls = globalThis.fetch.mock.calls.map(([url]) => String(url))
    expect(urls.some((url) => url.includes('the-trivia-api'))).toBe(false)
    expect(urls.some((url) => url.includes('opentdb'))).toBe(false)

    await user.click(screen.getAllByRole('button')[0])
    expect(await screen.findByRole('button', { name: /Sonraki soru/ })).toBeInTheDocument()
  })

  it('keeps the Turkish choice for the next visit', async () => {
    const user = userEvent.setup()
    const first = renderApp()

    await user.click(screen.getByRole('button', { name: 'TR' }))
    first.unmount()

    renderApp()
    expect(screen.getByText('Her turda yeni sorular')).toBeInTheDocument()
  })
})
