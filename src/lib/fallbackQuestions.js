import { shuffle } from './trivia'
import { fallbackTr } from './fallbackTr'

// Bundled pack, used when both public APIs are unreachable and nothing is cached.
// Kept deliberately small but accurate. correctIndex is 0 based after shuffling.
const PACK = [
  {
    id: 'net-1',
    question: 'Which device is required for an internet connection?',
    answers: ['Modem', 'Router', 'LAN cable', 'Pen drive'],
    correctIndex: 0,
    category: 'technology',
    difficulty: 'easy',
  },
  {
    id: 'geo-1',
    question: 'Which continent has the highest number of countries?',
    answers: ['Asia', 'Europe', 'North America', 'Africa'],
    correctIndex: 3,
    category: 'geography',
    difficulty: 'medium',
  },
  {
    id: 'net-2',
    question: 'Junk email is also called?',
    answers: ['Spam', 'Fake', 'Archived', 'Bin'],
    correctIndex: 0,
    category: 'technology',
    difficulty: 'easy',
  },
  {
    id: 'cs-1',
    question: 'A computer cannot boot without which of these?',
    answers: ['Application software', 'An internet connection', 'An operating system', 'A mouse'],
    correctIndex: 2,
    category: 'technology',
    difficulty: 'easy',
  },
  {
    id: 'web-1',
    question: 'What is the main page of a website called?',
    answers: ['Index page', 'Homepage', 'Sitemap', 'Landing folder'],
    correctIndex: 1,
    category: 'technology',
    difficulty: 'easy',
  },
  {
    id: 'sci-1',
    question: 'What is the chemical symbol for gold?',
    answers: ['Au', 'Ag', 'Gd', 'Go'],
    correctIndex: 0,
    category: 'science',
    difficulty: 'easy',
  },
  {
    id: 'sci-2',
    question: 'How many bones are in the adult human body?',
    answers: ['186', '206', '226', '246'],
    correctIndex: 1,
    category: 'science',
    difficulty: 'medium',
  },
  {
    id: 'sci-3',
    question: 'Which planet has the shortest day?',
    answers: ['Mercury', 'Mars', 'Jupiter', 'Venus'],
    correctIndex: 2,
    category: 'science',
    difficulty: 'hard',
  },
  {
    id: 'hist-1',
    question: 'In which year did the Berlin Wall fall?',
    answers: ['1987', '1989', '1991', '1993'],
    correctIndex: 1,
    category: 'history',
    difficulty: 'medium',
  },
  {
    id: 'hist-2',
    question: 'Who was the first person to walk on the Moon?',
    answers: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'],
    correctIndex: 2,
    category: 'history',
    difficulty: 'easy',
  },
  {
    id: 'geo-2',
    question: 'What is the longest river in the world?',
    answers: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
    correctIndex: 1,
    category: 'geography',
    difficulty: 'medium',
  },
  {
    id: 'geo-3',
    question: 'Which country has the most time zones?',
    answers: ['Russia', 'France', 'United States', 'China'],
    correctIndex: 1,
    category: 'geography',
    difficulty: 'hard',
  },
  {
    id: 'art-1',
    question: 'Who painted the Mona Lisa?',
    answers: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Caravaggio'],
    correctIndex: 2,
    category: 'art',
    difficulty: 'easy',
  },
  {
    id: 'film-1',
    question: 'Which film introduced the character Darth Vader?',
    answers: ['Star Wars: A New Hope', 'The Empire Strikes Back', 'Return of the Jedi', 'The Phantom Menace'],
    correctIndex: 0,
    category: 'film',
    difficulty: 'easy',
  },
  {
    id: 'music-1',
    question: 'Which instrument has 88 keys?',
    answers: ['Organ', 'Accordion', 'Piano', 'Harpsichord'],
    correctIndex: 2,
    category: 'music',
    difficulty: 'easy',
  },
  {
    id: 'sport-1',
    question: 'How many players are on the field for one football team?',
    answers: ['9', '10', '11', '12'],
    correctIndex: 2,
    category: 'sport',
    difficulty: 'easy',
  },
  {
    id: 'food-1',
    question: 'Which spice comes from the crocus flower?',
    answers: ['Turmeric', 'Saffron', 'Paprika', 'Cumin'],
    correctIndex: 1,
    category: 'food',
    difficulty: 'medium',
  },
  {
    id: 'space-1',
    question: 'What is the closest star to Earth?',
    answers: ['Proxima Centauri', 'Sirius', 'The Sun', 'Alpha Centauri A'],
    correctIndex: 2,
    category: 'science',
    difficulty: 'easy',
  },
]

const CATEGORY_MATCH = {
  science: ['science', 'technology', 'space'],
  history: ['history'],
  geography: ['geography'],
  arts_and_literature: ['art'],
  film_and_tv: ['film'],
  music: ['music'],
  sport_and_leisure: ['sport'],
  food_and_drink: ['food'],
}

export function fallbackQuestions({
  category = 'any',
  difficulty = 'any',
  amount = 10,
  language = 'en',
} = {}) {
  const wanted = CATEGORY_MATCH[category]
  let pool = PACK.filter((q) => (wanted ? wanted.includes(q.category) : true))
  if (difficulty !== 'any') {
    const byDifficulty = pool.filter((q) => q.difficulty === difficulty)
    if (byDifficulty.length >= 3) pool = byDifficulty
  }
  if (pool.length < 3) pool = PACK

  return shuffle(pool)
    .slice(0, Math.max(3, Math.min(amount, pool.length)))
    .map((q) => {
      const localized = language === 'tr' ? fallbackTr[q.id] : null
      const texts = localized ? localized.answers : q.answers
      const options = shuffle(texts.map((text, i) => ({ text, correct: i === q.correctIndex })))
      return {
        ...q,
        question: localized ? localized.question : q.question,
        answers: options.map((o) => o.text),
        correctIndex: options.findIndex((o) => o.correct),
        source: 'local',
      }
    })
}
