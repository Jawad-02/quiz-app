// Question sources: live trivia APIs first, local pack as the safety net.
// Everything returns the same shape:
// { id, question, answers: [4], correctIndex, category, difficulty, source }

const TRIVIA_API = 'https://the-trivia-api.com/v2/questions'
const OPENTDB = 'https://opentdb.com/api.php'
const CACHE_TTL = 5 * 60 * 1000
const CACHE_PREFIX = 'quiz:cache:'

export const CATEGORIES = [
  { id: 'any', label: 'Any topic', api: null, opentdb: null },
  { id: 'general_knowledge', label: 'General', api: 'general_knowledge', opentdb: 9 },
  { id: 'science', label: 'Science', api: 'science', opentdb: 17 },
  { id: 'history', label: 'History', api: 'history', opentdb: 23 },
  { id: 'geography', label: 'Geography', api: 'geography', opentdb: 22 },
  { id: 'arts_and_literature', label: 'Arts', api: 'arts_and_literature', opentdb: 25 },
  { id: 'film_and_tv', label: 'Film & TV', api: 'film_and_tv', opentdb: 11 },
  { id: 'music', label: 'Music', api: 'music', opentdb: 12 },
  { id: 'sport_and_leisure', label: 'Sport', api: 'sport_and_leisure', opentdb: 21 },
  { id: 'food_and_drink', label: 'Food', api: 'food_and_drink', opentdb: null },
]

export const DIFFICULTIES = [
  { id: 'any', label: 'Mixed' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export const QUESTION_COUNTS = [5, 10, 15]

const ENTITIES = {
  quot: '"',
  amp: '&',
  apos: "'",
  lt: '<',
  gt: '>',
  nbsp: ' ',
  '#039': "'",
  '#39': "'",
  '#x27': "'",
  '#34': '"',
  '#x22': '"',
}

export function decodeEntities(input = '') {
  if (!/[&<>]/.test(input)) return input
  return input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    const key = code.toLowerCase()
    if (key in ENTITIES) return ENTITIES[key]
    if (key.startsWith('#x')) {
      const point = parseInt(key.slice(2), 16)
      return Number.isFinite(point) ? String.fromCodePoint(point) : match
    }
    if (key.startsWith('#')) {
      const point = parseInt(key.slice(1), 10)
      return Number.isFinite(point) ? String.fromCodePoint(point) : match
    }
    return match
  })
}

export function shuffle(list, rand = Math.random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function normalizeQuestion(raw, source) {
  if (!raw || typeof raw.question !== 'string' || !raw.question.trim()) return null
  if (typeof raw.correctAnswer !== 'string') return null
  if (!Array.isArray(raw.incorrectAnswers) || raw.incorrectAnswers.length < 1) return null

  const answers = [
    ...raw.incorrectAnswers.filter((a) => typeof a === 'string' && a.trim()).slice(0, 3),
    raw.correctAnswer,
  ].map((a) => decodeEntities(a.trim()))

  if (answers.length < 2) return null

  const shuffled = shuffle(answers.map((text, i) => ({ text, correct: i === answers.length - 1 })))
  return {
    id: raw.id ? `${source}:${raw.id}` : `${source}:${raw.question.slice(0, 40)}`,
    question: decodeEntities(raw.question.trim()),
    answers: shuffled.map((a) => a.text),
    correctIndex: shuffled.findIndex((a) => a.correct),
    category: raw.category || 'general',
    difficulty: raw.difficulty || 'mixed',
    source,
  }
}

async function fetchJson(url, { timeout = 9000, body } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      method: body ? 'POST' : 'GET',
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`${url} responded ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.questions) || !parsed.questions.length) return null
    return { questions: parsed.questions, stale: Date.now() - parsed.ts > CACHE_TTL }
  } catch {
    return null
  }
}

function writeCache(key, questions) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), questions }))
  } catch {
    // storage may be unavailable, cache is a nicety
  }
}

export async function fromTriviaApi({ category, difficulty, amount }) {
  const selected = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0]
  const params = new URLSearchParams({ limit: String(amount) })
  if (selected.api) params.set('categories', selected.api)
  if (difficulty !== 'any') params.set('difficulties', difficulty)

  const data = await fetchJson(`${TRIVIA_API}?${params.toString()}`)
  const questions = (Array.isArray(data) ? data : [])
    .map((item) =>
      normalizeQuestion(
        {
          id: item.id,
          question: item.question?.text ?? '',
          correctAnswer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          category: String(item.category || '').replace(/_/g, ' '),
          difficulty: item.difficulty,
        },
        'trivia-api',
      ),
    )
    .filter(Boolean)

  if (questions.length < Math.min(3, amount)) throw new Error('trivia api returned too few questions')
  return questions
}

export async function fromOpenTdb({ category, difficulty, amount }) {
  const selected = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0]
  const params = new URLSearchParams({ amount: String(amount), type: 'multiple', encode: 'url3986' })
  if (selected.opentdb) params.set('category', String(selected.opentdb))
  if (difficulty !== 'any') params.set('difficulty', difficulty)

  const data = await fetchJson(`${OPENTDB}?${params.toString()}`)
  if (data.response_code === 5) throw new Error('opentdb rate limited')
  if (data.response_code !== 0 || !Array.isArray(data.results)) {
    throw new Error(`opentdb response code ${data.response_code}`)
  }

  const questions = data.results
    .map((item) =>
      normalizeQuestion(
        {
          id: item.question,
          question: decodeURIComponent(item.question),
          correctAnswer: decodeURIComponent(item.correct_answer),
          incorrectAnswers: item.incorrect_answers.map((a) => decodeURIComponent(a)),
          category: decodeURIComponent(item.category),
          difficulty: item.difficulty,
        },
        'opentdb',
      ),
    )
    .filter(Boolean)

  if (questions.length < Math.min(3, amount)) throw new Error('opentdb returned too few questions')
  return questions
}

export async function fromLlm({ category, difficulty, amount }) {
  const data = await fetchJson('/api/generate', { body: { category, difficulty, amount }, timeout: 25000 })
  const questions = (Array.isArray(data.questions) ? data.questions : [])
    .map((item) =>
      normalizeQuestion(
        {
          id: item.id,
          question: item.question,
          correctAnswer: item.correctAnswer,
          incorrectAnswers: item.incorrectAnswers,
          category: item.category || category,
          difficulty: item.difficulty || difficulty,
        },
        'ai',
      ),
    )
    .filter(Boolean)

  if (questions.length < Math.min(3, amount)) throw new Error('ai returned too few questions')
  return questions
}

export async function probeLlm() {
  try {
    const res = await fetch('/api/generate')
    if (!res.ok) return { available: false }
    const data = await res.json()
    return { available: Boolean(data.available), model: data.model }
  } catch {
    return { available: false }
  }
}

const PROVIDERS = {
  'trivia-api': fromTriviaApi,
  opentdb: fromOpenTdb,
  ai: fromLlm,
}

// Tries each source in order and reports which one answered, so the UI can be honest
// about where the questions came from. The cache is only a rescue path, never a first
// choice, so a new round always asks the live sources first.
export async function fetchQuestions({ category = 'any', difficulty = 'any', amount = 10, order } = {}) {
  const key = `${category}:${difficulty}:${amount}`
  const attempts = order?.length ? order : ['trivia-api', 'opentdb', 'local']
  const cached = readCache(key)
  const failures = []

  for (const name of attempts) {
    try {
      let questions
      if (name === 'local') {
        const { fallbackQuestions } = await import('./fallbackQuestions')
        questions = fallbackQuestions({ category, difficulty, amount })
      } else {
        const provider = PROVIDERS[name]
        if (!provider) throw new Error(`unknown provider ${name}`)
        questions = await provider({ category, difficulty, amount })
      }
      if (!questions.length) throw new Error('empty result')
      writeCache(key, questions)
      return { questions: questions.slice(0, amount), source: name, notes: failures }
    } catch (error) {
      failures.push(`${name}: ${error.message}`)
    }
  }

  if (cached) return { questions: cached.questions.slice(0, amount), source: 'cached', notes: failures }
  throw new Error(`every question source failed (${failures.join('; ')})`)
}

export const SOURCE_LABELS = {
  'trivia-api': 'Live trivia',
  opentdb: 'Open Trivia DB',
  ai: 'AI generated',
  cached: 'Cached set',
  local: 'Offline pack',
}
