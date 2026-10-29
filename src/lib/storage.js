const BEST_KEY = 'quiz:best'
const HISTORY_KEY = 'quiz:history'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // private mode, nothing to do
  }
}

export function readBest() {
  const best = readJson(BEST_KEY, null)
  if (!best || typeof best.pct !== 'number') return null
  return best
}

export function saveResult({ score, total, category, difficulty, streak }) {
  const pct = total ? Math.round((score / total) * 100) : 0
  const best = readBest()
  const isRecord = !best || pct > best.pct
  if (isRecord) {
    writeJson(BEST_KEY, { pct, score, total, category, difficulty, at: Date.now() })
  }

  const history = readJson(HISTORY_KEY, [])
  const next = [...history, { pct, score, total, category, difficulty, streak, at: Date.now() }].slice(-25)
  writeJson(HISTORY_KEY, next)

  return { pct, isRecord, best: isRecord ? { pct, score, total } : best }
}

export function readHistory() {
  const history = readJson(HISTORY_KEY, [])
  return Array.isArray(history) ? history : []
}
