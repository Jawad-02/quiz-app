export const LOCALES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
]

const en = {
  app: {
    name: 'Quiz',
    accent: 'Arcade',
    tagline: 'Live trivia, instant feedback and streaks worth chasing. Pick a lane, beat the clock.',
  },
  start: {
    badge: 'Fresh questions every round',
    topic: 'Topic',
    difficulty: 'Difficulty',
    count: 'Questions',
    timer: '20s timer',
    ai: 'AI questions',
    aiHint: 'add API key',
    aiLocked: 'Add OPENAI_API_KEY to your .env file, restart the dev server, then reload',
    aiReady: 'AI questions via {model}',
    start: 'Start quiz',
    foot: 'Questions from The Trivia API and Open Trivia DB. Keyboard: press 1 to 4 to answer, Enter to continue.',
    best: 'Personal best {pct}% ({score}/{total})',
    error: 'Could not reach the question services ({error}). The offline pack was used instead.',
    aiNote: 'AI mode is on. If the model call fails, live trivia takes over so the round always starts.',
  },
  topic: {
    any: 'Any topic',
    general_knowledge: 'General',
    science: 'Science',
    history: 'History',
    geography: 'Geography',
    arts_and_literature: 'Arts',
    film_and_tv: 'Film & TV',
    music: 'Music',
    sport_and_leisure: 'Sport',
    food_and_drink: 'Food',
    technology: 'Technology',
    art: 'Art',
    film: 'Film',
    sport: 'Sport',
    food: 'Food',
    space: 'Space',
  },
  difficulty: {
    any: 'Mixed',
    mixed: 'Mixed',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  },
  loading: {
    title: 'Dealing a fresh set of questions',
    sub: 'Live trivia, no two rounds the same',
  },
  quiz: {
    progress: 'Question {current} of {total}',
    progressBar: 'Quiz progress',
    pick: 'Pick an answer, or press 1 to 4',
    pickButton: 'Pick an answer',
    next: 'Next question',
    results: 'See results',
    correct: 'Correct. Streak is alive.',
    wrong: 'Not quite. Answer: {answer}',
    timeout: 'Time is up. Answer: {answer}',
    correctAnswer: 'Correct answer',
    yourWrong: 'Your answer, incorrect',
    secondsLeft: '{n} seconds left',
    noTimer: 'No timer',
    streak: 'Current streak',
    score: 'Score',
  },
  result: {
    record: 'New personal best',
    review: 'Review all {n} questions',
    correct: 'Correct',
    wrong: 'Wrong',
    timeout: 'Timed out',
    streak: 'Best streak',
    yourAnswer: 'Your answer: {answer}',
    noAnswer: 'No answer, time ran out',
    answer: 'Answer: {answer}',
    newQuestions: 'New questions',
    replay: 'Replay setup',
    changeTopic: 'Change topic',
    keepBest: 'Personal best stays at {pct}% ({score}/{total})',
    ringLabel: 'Score {pct} percent',
    headline: {
      flawless: 'Flawless run',
      sharp: 'Sharp shooting',
      solid: 'Solid round',
      close: 'Getting there',
      rough: 'Rough one',
    },
    line: {
      flawless: 'Every single one. Show off a little.',
      sharp: 'That is a strong read on the room.',
      solid: 'Comfortably above the middle.',
      close: 'Half the battle is knowing what you missed.',
      rough: 'Wrong answers are just future right ones.',
    },
  },
  source: {
    'trivia-api': 'Live trivia',
    opentdb: 'Open Trivia DB',
    'tr-bank': 'Turkish pack',
    ai: 'AI generated',
    cached: 'Cached set',
    local: 'Offline pack',
  },
  lang: {
    switch: 'Change language',
  },
}

const tr = {
  app: {
    name: 'Quiz',
    accent: 'Arcade',
    tagline: 'Canlı sorular, anında geri bildirim ve peşinden koşmaya değer seriler. Konunu seç, saate karşı yarış.',
  },
  start: {
    badge: 'Her turda yeni sorular',
    topic: 'Konu',
    difficulty: 'Zorluk',
    count: 'Soru sayısı',
    timer: '20 saniye süre',
    ai: 'Yapay zeka soruları',
    aiHint: 'API anahtarı ekle',
    aiLocked: 'AI soruları için .env dosyasına OPENAI_API_KEY ekleyip sunucuyu yeniden başlat',
    aiReady: '{model} ile yapay zeka soruları',
    start: 'Başla',
    foot: 'Sorular The Trivia API ve Open Trivia DB üzerinden gelir. Klavye: cevap için 1-4, devam için Enter.',
    best: 'En iyi skor {pct}% ({score}/{total})',
    error: 'Soru servislerine ulaşılamadı ({error}). Çevrimdışı soru paketi kullanıldı.',
    aiNote: 'Yapay zeka modu açık. Model yanıt vermezse canlı sorular devreye girer, tur her zaman başlar.',
  },
  topic: {
    any: 'Tüm konular',
    general_knowledge: 'Genel kültür',
    science: 'Bilim',
    history: 'Tarih',
    geography: 'Coğrafya',
    arts_and_literature: 'Sanat',
    film_and_tv: 'Sinema ve TV',
    music: 'Müzik',
    sport_and_leisure: 'Spor',
    food_and_drink: 'Yemek',
    technology: 'Teknoloji',
    art: 'Sanat',
    film: 'Sinema',
    sport: 'Spor',
    food: 'Yemek',
    space: 'Uzay',
  },
  difficulty: {
    any: 'Karışık',
    mixed: 'Karışık',
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  },
  loading: {
    title: 'Yeni soru seti hazırlanıyor',
    sub: 'Canlı sorular, iki tur asla aynı değil',
  },
  quiz: {
    progress: 'Soru {current} / {total}',
    progressBar: 'Test ilerlemesi',
    pick: 'Bir cevap seç ya da 1-4 tuşlarına bas',
    pickButton: 'Önce cevap seç',
    next: 'Sonraki soru',
    results: 'Sonuçları gör',
    correct: 'Doğru. Seri devam ediyor.',
    wrong: 'Olmadı. Doğru cevap: {answer}',
    timeout: 'Süre doldu. Doğru cevap: {answer}',
    correctAnswer: 'Doğru cevap',
    yourWrong: 'Senin cevabın, yanlış',
    secondsLeft: '{n} saniye kaldı',
    noTimer: 'Süre yok',
    streak: 'Güncel seri',
    score: 'Skor',
  },
  result: {
    record: 'Yeni en iyi skor',
    review: 'Tüm {n} soruyu incele',
    correct: 'Doğru',
    wrong: 'Yanlış',
    timeout: 'Süre doldu',
    streak: 'En iyi seri',
    yourAnswer: 'Senin cevabın: {answer}',
    noAnswer: 'Cevap yok, süre doldu',
    answer: 'Doğru cevap: {answer}',
    newQuestions: 'Yeni sorular',
    replay: 'Aynı ayarla tekrar',
    changeTopic: 'Konuyu değiştir',
    keepBest: 'En iyi skorun {pct}% ({score}/{total}) olarak kalıyor',
    ringLabel: 'Skor yüzde {pct}',
    headline: {
      flawless: 'Kusursuz tur',
      sharp: 'Keskin nişancı',
      solid: 'Sağlam tur',
      close: 'Yol alıyorsun',
      rough: 'Zor bir tur',
    },
    line: {
      flawless: 'Hepsini bildin. Biraz hava at.',
      sharp: 'Bu konuda çok iyisin.',
      solid: 'Ortalamanın rahatça üstünde.',
      close: 'Kaçırdıklarını görmek işin yarısı.',
      rough: 'Yanlış cevaplar, gelecekteki doğru cevaplar.',
    },
  },
  source: {
    'trivia-api': 'Canlı sorular',
    opentdb: 'Open Trivia DB',
    'tr-bank': 'Türkçe soru bankası',
    ai: 'Yapay zeka',
    cached: 'Önbellekteki set',
    local: 'Çevrimdışı paket',
  },
  lang: {
    switch: 'Dili değiştir',
  },
}

export const translations = { en, tr }

export function prettify(value = '') {
  const words = String(value)
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : ''
}

function lookup(dictionary, key) {
  return String(key)
    .split('.')
    .reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), dictionary)
}

export function translate(dictionary, key, vars, fallback) {
  const template = lookup(dictionary, key)
  const source = typeof template === 'string' ? template : fallback
  if (typeof source !== 'string') return prettify(String(key).split('.').pop())
  if (!vars) return source
  return source.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  )
}

export function flattenKeys(dictionary, prefix = '') {
  return Object.entries(dictionary).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') return flattenKeys(value, path)
    return [path]
  })
}

export function detectLanguage(languages = []) {
  for (const entry of languages) {
    if (typeof entry === 'string' && entry.toLowerCase().startsWith('tr')) return 'tr'
  }
  return 'en'
}
