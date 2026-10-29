# Quiz Arcade

A fast multiple choice quiz built with React and Vite. Every round is pulled fresh from a live
trivia API, so it is not the same five questions over and over. Wrong answers cost you the streak,
the clock keeps you moving, and the results screen shows exactly what you got right.

Original project by [ecankrtm](https://github.com/ecankrtm/quiz-app). This version keeps the idea and
rebuilds the UI, the question pipeline and the test coverage around it.

## What this version changes

- Rebuilt interface: dark glass card, animated aurora backdrop, staggered option motion, shake on a
  wrong pick, animated score ring and a confetti finish. Two runtime dependencies were added for
  that, `motion` and `canvas-confetti`.
- Questions are no longer a hardcoded array. Each round is normalised from a live source, with
  fallbacks, and the UI reports which source answered.
- New round features: topic and difficulty picker, question count, 20 second timer, streak counter,
  personal best, and a full review of every question at the end.
- Accessibility pass: options are real buttons, feedback goes through `aria-live`, every state has an
  icon and screen reader text, focus rings are visible, reduced motion is respected.
- English and Turkish interface, with a Turkish question bank so Turkish rounds are not English.
- The old `data.js` / `Quiz.jsx` pair is replaced by `src/lib/trivia.js` (providers and
  normalising) and `src/quiz/` (screens). The `Companend` folder typo is gone.
- Test setup added: 32 tests over the question pipeline, the Turkish bank, the translation
  dictionary and the round flow.

## What it does

- Ten questions by default, in a topic and difficulty you pick (Any topic, Science, History,
  Geography, Arts, Film and TV, Music, Sport, Food).
- Fresh questions each round from [The Trivia API](https://the-trivia-api.com), with
  [Open Trivia DB](https://opentdb.com) as the second source and a bundled offline pack as the last
  resort. The UI shows which source answered.
- Optional AI generated questions through any OpenAI compatible endpoint, enabled with a local key.
- Instant feedback: the correct option is marked, your wrong pick is marked, and the answer text is
  spelled out. Color is never the only signal, every state also has an icon and screen reader text.
- Streak counter, per question 20 second timer, score, personal best in local storage, and a full
  review of every question on the results screen.
- Keyboard play: `1` to `4` to answer, `Enter` to continue. Visible focus rings, no keyboard trap.
- Reduced motion is respected, the animated background and confetti switch off automatically.

## Languages

The interface ships in English and Turkish. The switch sits in the top right of the start screen,
the choice is stored in `localStorage` under `quiz:lang`, and the first visit follows
`navigator.language` (anything starting with `tr` gets Turkish). `<html lang>` follows the choice too,
so screen readers and hyphenation do the right thing.

Question text: the public APIs either do not serve Turkish or require a paid key, so a Turkish round
is played from the bundled Turkish question bank (`src/lib/turkishBank.js`, 94 questions, every
topic with at least 10 so a full round fits the selected topic), each with difficulty and verified
answers. The English round keeps using the live APIs. In
Turkish mode the app never calls the English endpoints, so an English question cannot leak into a
Turkish round. If you switch AI mode on, the model is asked for Turkish questions directly.

The offline pack is translated too, so a Turkish player with no network still reads Turkish.

Adding a language is one file: copy the `en` object in `src/i18n/translations.js`, translate the
values, add it to the `translations` map and to `LOCALES`. The unit tests fail if the key sets drift
apart, so a half finished translation cannot ship quietly.

## Run it

Requires Node 20.19 or newer (Vite 7 needs it). Node 22 LTS is the safe choice.

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

No keys and no backend are required. Live trivia works out of the box.

## AI generated questions (optional)

The browser never sees your key. A small Vite middleware proxies the call in dev and in preview.

1. Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-your-key
# optional, any OpenAI compatible endpoint
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-4o-mini
```

2. Restart `npm run dev`.
3. The "AI questions" switch on the start screen becomes active. If the model call fails, live trivia
   takes over so a round always starts.

For a static production build there is no middleware, so the AI switch stays off and the app uses the
public APIs only. Deploy it behind a server or a serverless function if you want AI questions in
production.

## How a round is loaded

English rounds try, in order: The Trivia API, then Open Trivia DB, then the bundled offline pack. If
every source fails, the last cached round in `sessionStorage` is reused and the UI says so. The cache
is a rescue path only, so pressing "New questions" always asks the live sources first.

Turkish rounds skip the English endpoints entirely and go: AI (only when the switch is on), then the
Turkish bank, then the translated offline pack.

## Testing

```bash
npm test
```

32 tests with Vitest and Testing Library:

- question normalising, HTML entity decoding, shuffling and malformed record rejection
- every source in the provider chain, including the cache rescue path
- Turkish bank integrity: unique ids, four distinct answers, valid correct index, a full 10 question
  round per topic, no em dashes
- translation dictionary parity, interpolation and language detection
- two full round flows in English, plus a Turkish round that asserts no English API call happens

## Deployment

`npm run build` emits a static site in `dist/`. Any static host works (Netlify, Vercel, Cloudflare
Pages, GitHub Pages), and because the Turkish bank and offline pack are bundled, the app also starts
with no network. The AI proxy exists only in the Vite dev and preview servers, so on a plain static
host the AI switch stays hidden. Put `dist/` behind a small server if you want AI questions live.

## Privacy

No accounts, no analytics, no tracking pixels, no cookies. The personal best and language choice stay
in the browser's `localStorage`. The only network calls are the question APIs, and the AI endpoint
only when you switch it on and have set a key.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the question proxy |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the build, proxy included |
| `npm run lint` | ESLint over the project |
| `npm test` | Vitest, unit and component tests |
| `npm run test:watch` | Vitest in watch mode |

## Structure

```
src/
  quiz/
    QuizApp.jsx       screen state machine: start, loading, quiz, result
    StartScreen.jsx   topic, difficulty, count, timer and AI switches
    QuestionCard.jsx  question, options, feedback, timer ring, keyboard handling
    ResultScreen.jsx  score ring, stats, review list
    ProgressBar.jsx
    Background.jsx    animated aurora backdrop
    Icons.jsx         inline SVG icon set
    quiz.css          component styles
  i18n/
    translations.js   en and tr dictionaries, t() and detection helpers
    LanguageProvider.jsx  context, persistence, html lang
    LanguageSwitch.jsx    EN / TR control
    labels.js         maps API categories and difficulties to translated labels
    useI18n.js
  lib/
    trivia.js         question providers, normalising, shuffling, cache
    fallbackQuestions.js  bundled English pack
    fallbackTr.js     Turkish version of the bundled pack
    turkishBank.js    94 verified Turkish questions, all topics
    storage.js        personal best and history
    *.test.js         unit tests
  test/setup.js       Testing Library cleanup and reduced motion for tests
  index.css           tokens, reset, backdrop
vite.config.js        React plugin, LLM proxy, Vitest config
```

### Question shape

Every provider normalises to the same object, so the UI never cares where a question came from:

```js
{
  id: 'trivia-api:62602dff4b176d54800e3cba',
  question: 'Which of these cities is in France?',
  answers: ['Copenhagen', 'Toulouse', 'Amsterdam', 'Barcelona'],
  correctIndex: 1,
  category: 'geography',
  difficulty: 'easy',
  source: 'trivia-api'
}
```

`correctIndex` is zero based and the answers are already shuffled, so the correct option is not always
in the same slot.

## Notes on the public APIs

- The Trivia API is the primary source. It returns `question.text`, `correctAnswer` and
  `incorrectAnswers`. Its Turkish translations exist but need a paid key, which is why Turkish rounds
  do not call it.
- Open Trivia DB is the backup. It returns HTML entities and URL encoded text, both are decoded in
  `src/lib/trivia.js`.
- Both APIs rate limit. A round is cached in `sessionStorage` for five minutes and is only used when
  every live source fails, so a refresh still gets fresh questions but a failing network does not
  break the screen.

## License

The upstream repository does not ship a license file, so this fork inherits whatever the original
author intends. Ask before reusing it commercially.
