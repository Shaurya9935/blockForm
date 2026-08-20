export type Screen = 'landing' | 'form' | 'submitting' | 'success'

export type FormExperience = 'journey' | 'scroll'

export interface Question {
  id: number | string
  type: 'text' | 'email' | 'number' | 'dropdown' | 'checkbox'
  question: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export interface EnvTheme {
  name: string
  skyStart: string
  skyEnd: string
  accent: string
  label: string
}

export interface EnvPalette {
  grass: string
  grassTop: string
  dirt: string
  stone: string
  tree: string
  leaves: string
  mountain: string
  snow: string
  cloud: string
  sun: string
  path: string
}

export interface BlockWorldProps {
  envIndex: number
  showFullScene: boolean
  env: EnvTheme
}

export interface LandingCardProps {
  title?: string
  subtitle?: string
  description?: string
  totalQuestions?: number
  estimatedTime?: string
  onEnter: () => void
}

export interface FormQuestionProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  value: string | string[] | undefined
  onChange: (id: number | string, value: string | string[]) => void
  onNext: () => void
  onBack: () => void
  direction: 'forward' | 'back'
  env: EnvTheme
}

export interface SuccessScreenProps {
  title?: string
  message?: string
  onReset?: () => void
}

export interface OverworldThemeProps {
  title?: string
  subtitle?: string
  description?: string
  questions: Question[]
  formExperience?: FormExperience
  onSubmit?: (answers: Record<string | number, string | string[]>) => Promise<void> | void
  onComplete?: () => void
}
