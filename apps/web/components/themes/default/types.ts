export type QuestionType =
  | 'text'
  | 'email'
  | 'number'
  | 'dropdown'
  | 'select'
  | 'checkbox'
  | 'radio'

export interface Question {
  id: string | number
  num?: string
  type: QuestionType
  question: string
  label?: string
  description?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  helper?: string
}

export interface FormValues {
  [key: string]: string | string[]
}

export interface FormErrors {
  [key: string]: string
}

export interface DefaultThemeProps {
  title: string
  description?: string
  questions: Question[]
  onSubmit: (values: Record<string | number, string | string[]>) => Promise<void> | void
  onReset?: () => void
}
