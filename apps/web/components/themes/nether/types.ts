export type Stage = 'intro' | 'form' | 'success'
export type FieldType = 'text' | 'email' | 'number' | 'dropdown' | 'checkbox'

export interface Question {
  id: number | string
  type: FieldType
  question: string
  description?: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export type AnswerMap = Record<number | string, string | string[]>

export interface NetherThemeProps {
  title?: string
  subtitle?: string
  description?: string
  questions: Question[]
  onSubmit?: (answers: AnswerMap) => Promise<void> | void
  onComplete?: () => void
}

export interface FormQuestionProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  value: string | string[]
  error: string
  panelClass: string
  onChange: (val: string | string[]) => void
  onNext: () => void
  onBack: () => void
  canGoBack: boolean
}

export interface DepthIndicatorProps {
  current: number
  total: number
}

export interface IntroScreenProps {
  badge?: string
  title?: string
  description?: string
  totalQuestions: number
  estimatedTime?: string
  onEnter: () => void
}

export interface SuccessScreenProps {
  badge?: string
  title?: string
  message?: string
  footerHint?: string
  onReset?: () => void
}
