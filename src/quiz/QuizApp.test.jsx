import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuizApp from './QuizApp'

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
    render(<QuizApp />)

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

    expect(await screen.findByText(/3 of 3/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Flawless run/i })).toBeInTheDocument()
  })

  it('marks a wrong pick and reveals the right answer', async () => {
    const user = userEvent.setup()
    const { container } = render(<QuizApp />)

    await user.click(screen.getByRole('button', { name: /Start quiz/i }))
    await screen.findByText('Capital city of France?')

    await user.click(screen.getByRole('button', { name: /Berlin/ }))

    expect(await screen.findByText(/Not quite\./)).toBeInTheDocument()
    expect(container.querySelector('.option.is-correct')).toHaveTextContent('Paris')
    expect(container.querySelector('.option.is-wrong')).toHaveTextContent('Berlin')
  })
})
