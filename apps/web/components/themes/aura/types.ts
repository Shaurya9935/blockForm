export type Stage = 'intro' | 'form' | 'success'

export type Dept = string
export type YearCode = string
export type Interest = string

export type FieldType = 'text' | 'email' | 'number' | 'dropdown' | 'checkbox' | 'dept' | 'year'

export interface Question {
  id: number | string
  type: FieldType
  question: string
  description?: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export interface FormData {
  name: string
  email: string
  dept?: Dept
  year?: YearCode
  interests?: Interest[]
  [key: string]: any
}

export type AnswerMap = Record<number | string, string | string[]>

export interface FestivalPassProps {
  title?: string
  subtitle?: string
  footerNote?: string
  data: FormData
  passId: string
  confirmed?: boolean
}

export interface BgDecorProps {
  step: number
}

export interface ProgressBarProps {
  current: number
  total: number
}

export interface AuraThemeProps {
  title?: string
  subtitle?: string
  description?: string
  questions?: Question[]
  onSubmit?: (answers: AnswerMap) => Promise<void> | void
  onComplete?: () => void
}

export interface IntroScreenProps {
  yearBadge?: string
  title?: string
  tagline?: string
  dateSticker?: string
  footerNote?: string
  onEnter: () => void
}

export interface FormQuestionProps {
  title?: string
  question: Question
  questionIndex: number
  totalQuestions: number
  formData: FormData
  passId: string
  value: string | string[]
  error: string
  transitioning: boolean
  direction: 'fwd' | 'back'
  isMobile: boolean
  mobilePassOpen: boolean
  onToggleMobilePass: () => void
  onChange: (val: string | string[]) => void
  onNext: () => void
  onBack: () => void
  canGoBack: boolean
}

export interface SuccessScreenProps {
  title?: string
  subtitle?: string
  formData: FormData
  passId: string
  onReset?: () => void
}

