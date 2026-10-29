import QuizApp from './quiz/QuizApp'
import { LanguageProvider } from './i18n/LanguageProvider'

export default function App() {
  return (
    <LanguageProvider>
      <QuizApp />
    </LanguageProvider>
  )
}
