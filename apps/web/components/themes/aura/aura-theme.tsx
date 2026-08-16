'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import './aura.css'
import type { Stage, Question, FormData, AnswerMap, AuraThemeProps } from './types'
import { IntroScreen } from './intro-screen'
import { FormQuestion } from './form-question'
import { SuccessScreen } from './success-screen'

export const DEFAULT_AURA_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'text',
    question: "What's your name?",
    description: "Let's start with the basics.",
    placeholder: 'Type your full name',
    required: true,
  },
  {
    id: 2,
    type: 'email',
    question: 'Where should we send your pass?',
    description: 'Almost there.',
    placeholder: 'your@email.com',
    required: true,
  },
  {
    id: 3,
    type: 'dept',
    question: 'Where do you belong?',
    description: 'Tell us about yourself.',
    required: true,
  },
  {
    id: 4,
    type: 'year',
    question: "What's your current chapter?",
    description: 'Your journey so far.',
    required: true,
  },
  {
    id: 5,
    type: 'checkbox',
    question: 'What are you here for?',
    description: 'Your festival identity.',
    options: ['MUSIC', 'DANCE', 'GAMING', 'CODING', 'ESPORTS', 'DESIGN', 'SPORTS', 'WORKSHOPS', 'PHOTOGRAPHY'],
    required: true,
  },
]

export function AuraTheme({
  title = 'AURA',
  subtitle = 'College Fest 2026',
  description = 'Your Campus. Your People. Your Moment.',
  questions = DEFAULT_AURA_QUESTIONS,
  onSubmit,
  onComplete,
}: AuraThemeProps) {
  const [stage, setStage] = useState<Stage>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<'fwd' | 'back'>('fwd')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    dept: '',
    year: '',
    interests: [],
  })
  const [error, setError] = useState('')
  const [mobilePassOpen, setMobilePassOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const passId = useRef(`AURA-${Math.floor(10000 + Math.random() * 89999)}`)

  const activeQuestions = questions.length > 0 ? questions : DEFAULT_AURA_QUESTIONS
  const question = activeQuestions[currentQ] ?? activeQuestions[0]!
  const total = activeQuestions.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const getAnswer = useCallback((): string | string[] => {
    if (!question) return ''
    if (question.type === 'checkbox') return formData.interests || []
    if (question.type === 'dept') return formData.dept || ''
    if (question.type === 'year') return formData.year || ''
    return (formData[question.id] as string) || (formData[question.question] as string) || (currentQ === 0 ? formData.name : currentQ === 1 ? formData.email : '')
  }, [formData, question, currentQ])

  const setAnswer = useCallback((val: string | string[]) => {
    if (!question) return
    setError('')
    if (question.type === 'checkbox') {
      const arr = Array.isArray(val) ? val : [val]
      setFormData((prev) => ({ ...prev, interests: arr }))
    } else if (question.type === 'dept') {
      setFormData((prev) => ({ ...prev, dept: val as string }))
    } else if (question.type === 'year') {
      setFormData((prev) => ({ ...prev, year: val as string }))
    } else if (currentQ === 0 || question.type === 'text') {
      setFormData((prev) => ({ ...prev, name: val as string, [question.id]: val as string }))
    } else if (currentQ === 1 || question.type === 'email') {
      setFormData((prev) => ({ ...prev, email: val as string, [question.id]: val as string }))
    } else {
      setFormData((prev) => ({ ...prev, [question.id]: val as string }))
    }
  }, [question, currentQ])

  const validate = useCallback((): boolean => {
    if (!question) return true
    const val = getAnswer()

    if (question.required) {
      if (question.type === 'checkbox') {
        if ((val as string[]).length === 0) {
          setError('Pick at least one!')
          return false
        }
        return true
      }
      const str = typeof val === 'string' ? val.trim() : ''
      if (!str) {
        setError('We still need this one.')
        return false
      }
      if (question.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
        setError("That email doesn't look right.")
        return false
      }
    } else if (question.type === 'email' && typeof val === 'string' && val.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      setError("That email doesn't look right.")
      return false
    }
    return true
  }, [getAnswer, question])

  const advance = useCallback(async () => {
    if (!validate()) return
    setDirection('fwd')
    setTransitioning(true)
    setError('')
    setTimeout(async () => {
      if (currentQ < total - 1) {
        setCurrentQ((q) => q + 1)
        setTransitioning(false)
      } else {
        setTransitioning(false)
        if (onSubmit) {
          try {
            const answerMap: AnswerMap = {
              name: formData.name,
              email: formData.email,
              dept: formData.dept,
              year: formData.year,
              interests: formData.interests,
            }
            await onSubmit(answerMap)
          } catch (err) {
            console.error('Failed to submit form:', err)
          }
        }
        setStage('success')
        if (onComplete) onComplete()
      }
    }, 320)
  }, [currentQ, validate, total, onSubmit, formData, onComplete])

  const goBack = useCallback(() => {
    if (currentQ === 0) return
    setDirection('back')
    setTransitioning(true)
    setError('')
    setTimeout(() => {
      setCurrentQ((q) => q - 1)
      setTransitioning(false)
    }, 320)
  }, [currentQ])

  const enterForm = () => {
    setStage('form')
    setCurrentQ(0)
  }

  const handleReset = () => {
    setStage('intro')
    setCurrentQ(0)
    setFormData({ name: '', email: '', dept: '', year: '', interests: [] })
    setError('')
  }

  return (
    <div className="aura-theme-root">
      {stage === 'intro' && (
        <IntroScreen
          yearBadge={subtitle}
          title={title}
          tagline={description}
          onEnter={enterForm}
        />
      )}

      {stage === 'form' && question && (
        <FormQuestion
          question={question}
          questionIndex={currentQ}
          totalQuestions={total}
          formData={formData}
          passId={passId.current}
          value={getAnswer()}
          error={error}
          transitioning={transitioning}
          direction={direction}
          isMobile={isMobile}
          mobilePassOpen={mobilePassOpen}
          onToggleMobilePass={() => setMobilePassOpen((v) => !v)}
          onChange={setAnswer}
          onNext={advance}
          onBack={goBack}
          canGoBack={currentQ > 0}
        />
      )}

      {stage === 'success' && (
        <SuccessScreen
          formData={formData}
          passId={passId.current}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
