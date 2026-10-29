import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const SYSTEM_PROMPT = `You write multiple choice trivia questions.
Return STRICT JSON shaped exactly like:
{"questions":[{"question":"...","correctAnswer":"...","incorrectAnswers":["...","...","..."],"category":"...","difficulty":"easy"}]}
Rules: exactly 3 incorrect answers per question, exactly one unambiguous correct answer,
no numbering in the question text, no duplicate options, no em dashes, difficulty is one of
easy, medium or hard. Questions must be self contained and factual.`

function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 20000) {
        reject(new Error('payload too large'))
        req.destroy()
      }
    })
    req.on('end', () => resolve(raw))
    req.on('error', reject)
  })
}

// Dev only LLM bridge so the API key never reaches the browser bundle.
// Enable with OPENAI_API_KEY in .env, then pick "AI questions" in the UI.
function llmProxyPlugin(env) {
  const model = env.OPENAI_MODEL || 'gpt-4o-mini'
  const baseUrl = (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '')
  const key = env.OPENAI_API_KEY

  const middleware = async (req, res) => {
    if (req.method !== 'POST') {
      // GET is the availability probe used by the start screen switch
      return json(res, 200, { available: Boolean(key), model: key ? model : null })
    }
    if (!key) {
      return json(res, 501, {
        error: 'OPENAI_API_KEY is not set. Add it to .env to enable AI generated questions.',
      })
    }

    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      const amount = Math.min(Math.max(Number(body.amount) || 10, 3), 20)
      const category = typeof body.category === 'string' && body.category !== 'any' ? body.category : 'general'
      const difficulty = typeof body.difficulty === 'string' && body.difficulty !== 'any' ? body.difficulty : 'mixed'
      const useTurkish = body.language === 'tr'

      const upstream = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.95,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Write ${amount} questions about ${category} at ${difficulty} difficulty.
${useTurkish ? 'Write the questions, the correct answer and every incorrect answer in Turkish.' : 'Write the questions and answers in English.'}
Avoid the most obvious textbook questions, prefer interesting facts.`,
            },
          ],
        }),
      })

      if (!upstream.ok) {
        const text = await upstream.text()
        return json(res, 502, { error: `upstream ${upstream.status}: ${text.slice(0, 300)}` })
      }

      const payload = await upstream.json()
      const content = payload.choices?.[0]?.message?.content || '{}'
      const parsed = JSON.parse(content)
      const questions = Array.isArray(parsed.questions) ? parsed.questions : []
      if (!questions.length) return json(res, 502, { error: 'model returned no questions' })
      return json(res, 200, { questions, model })
    } catch (error) {
      return json(res, 500, { error: error.message })
    }
  }

  return {
    name: 'quiz-llm-proxy',
    configureServer(server) {
      server.middlewares.use('/api/generate', middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/generate', middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), llmProxyPlugin(env)],
    test: {
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.js'],
      css: false,
      include: ['src/**/*.test.{js,jsx}'],
    },
  }
})
