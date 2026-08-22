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
    description: 'Digital pass delivery.',
    placeholder: 'your@email.com',
    required: true,
  },
  {
    id: 3,
    type: 'dropdown',
    question: 'Select your category or domain',
    description: 'Tell us about your background.',
    options: ['ENGINEERING', 'DESIGN', 'PRODUCT', 'AI & DATA', 'BUSINESS', 'OTHER'],
    required: true,
  },
  {
    id: 4,
    type: 'dropdown',
    question: "What's your pass tier?",
    description: 'Access category.',
    options: ['GENERAL PASS', 'VIP ACCESS', 'CREATOR', 'STUDENT PASS'],
    required: true,
  },
  {
    id: 5,
    type: 'checkbox',
    question: 'What are you interested in?',
    description: 'Your event tracks & topics.',
    options: ['KEYNOTES', 'WORKSHOPS', 'HACKATHON', 'NETWORKING', 'GAMING', 'DESIGN', 'AI & TECH', 'MUSIC'],
    required: true,
  },
]

export function AuraTheme({
  title = 'AURA',
  subtitle = 'EVENT PASS 2026',
  description = 'Your Event. Your Pass. Your Moment.',
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
    if (formData[question.id] !== undefined) return formData[question.id]
    if (question.type === 'checkbox') return formData.interests || []
    if (question.type === 'dept') return formData.dept || ''
    if (question.type === 'year') return formData.year || ''
    if (currentQ === 0) return formData.name || ''
    if (currentQ === 1) return formData.email || ''
    return ''
  }, [formData, question, currentQ])

  const setAnswer = useCallback((val: string | string[]) => {
    if (!question) return
    setError('')
    if (question.type === 'checkbox') {
      const arr = Array.isArray(val) ? val : [val]
      setFormData((prev) => ({ ...prev, interests: arr, [question.id]: arr }))
    } else if (question.type === 'dept') {
      setFormData((prev) => ({ ...prev, dept: val as string, [question.id]: val as string }))
    } else if (question.type === 'year') {
      setFormData((prev) => ({ ...prev, year: val as string, [question.id]: val as string }))
    } else if (currentQ === 0) {
      setFormData((prev) => ({ ...prev, name: val as string, [question.id]: val as string }))
    } else if (currentQ === 1) {
      setFormData((prev) => ({ ...prev, email: val as string, [question.id]: val as string }))
    } else if (currentQ === 2 && !formData.dept && typeof val === 'string') {
      setFormData((prev) => ({ ...prev, dept: val, [question.id]: val }))
    } else if (currentQ === 3 && !formData.year && typeof val === 'string') {
      setFormData((prev) => ({ ...prev, year: val, [question.id]: val }))
    } else {
      setFormData((prev) => ({ ...prev, [question.id]: val }))
    }
  }, [question, currentQ, formData.dept, formData.year])

  const validate = useCallback((): boolean => {
    if (!question) return true
    const val = getAnswer()

    if (question.required) {
      if (question.type === 'checkbox') {
        if (!Array.isArray(val) || val.length === 0) {
          setError('Pick at least one option!')
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
            const answerMap: AnswerMap = {}
            activeQuestions.forEach((q, idx) => {
              if (formData[q.id] !== undefined) {
                answerMap[q.id] = formData[q.id]
              } else if (q.type === 'checkbox') {
                answerMap[q.id] = formData.interests || []
              } else if (q.type === 'dept') {
                answerMap[q.id] = formData.dept || ''
              } else if (q.type === 'year') {
                answerMap[q.id] = formData.year || ''
              } else if (idx === 0) {
                answerMap[q.id] = formData.name || ''
              } else if (idx === 1) {
                answerMap[q.id] = formData.email || ''
              } else {
                answerMap[q.id] = ''
              }
            })
            await onSubmit(answerMap)
          } catch (err) {
            console.error('Failed to submit form:', err)
          }
        }
        setStage('success')
        if (onComplete) onComplete()
      }
    }, 320)
  }, [currentQ, validate, total, onSubmit, formData, activeQuestions, onComplete])

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
          title={title}
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
          title="YOU'RE IN."
          subtitle={`Registration confirmed for ${title}.`}
          formData={formData}
          passId={passId.current}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

