'use client'

import React, { useState, useCallback, useEffect } from 'react'
import './nether.css'
import type { Stage, Question, AnswerMap, NetherThemeProps } from './types'
import { NetherScene } from './nether-scene'
import { DepthIndicator } from './depth-indicator'
import { IntroScreen } from './intro-screen'
import { FormQuestion } from './form-question'
import { SuccessScreen } from './success-screen'

export const DEFAULT_NETHER_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'text',
    question: "What's your name?",
    description: 'Tell us what we should call you.',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    id: 2,
    type: 'email',
    question: 'Where can we reach you?',
    description: "Drop your email and we'll find you in the dark.",
    placeholder: 'you@example.com',
    required: true,
  },
  {
    id: 3,
    type: 'dropdown',
    question: 'Choose your faction.',
    description: 'Every traveler belongs somewhere.',
    options: ['Explorer', 'Builder', 'Creator', 'Developer'],
  },
  {
    id: 4,
    type: 'number',
    question: 'How many events have you attended?',
    description: 'Give us your count. Even zero tells us something.',
    placeholder: '0',
  },
  {
    id: 5,
    type: 'checkbox',
    question: 'What are you interested in?',
    description: 'Choose everything that pulls you deeper.',
    options: ['Events', 'Gaming', 'Workshops', 'Hackathons', 'Communities'],
  },
  {
    id: 6,
    type: 'text',
    question: 'What city do you descend from?',
    description: 'Your surface-world location.',
    placeholder: 'Your city',
  },
  {
    id: 7,
    type: 'text',
    question: 'Any final words before you go deeper?',
    description: 'Leave a message from the depths.',
    placeholder: 'Something to remember you by…',
  },
]

export function NetherTheme({
  title = 'Something is waiting below.',
  subtitle = 'BLOCKFORM',
  description = 'Answer a few questions and make your way through the depths.',
  questions = DEFAULT_NETHER_QUESTIONS,
  onSubmit,
  onComplete,
}: NetherThemeProps) {
  const [stage, setStage] = useState<Stage>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [panelState, setPanelState] = useState<'entering' | 'idle' | 'exiting'>('entering')
  const [error, setError] = useState('')

  const activeQuestions = questions.length > 0 ? questions : DEFAULT_NETHER_QUESTIONS
  const question = activeQuestions[currentQ] ?? activeQuestions[0]!
  const total = activeQuestions.length

  const getAnswer = useCallback((): string | string[] => {
    if (!question) return ''
    if (question.type === 'checkbox') return (answers[question.id] as string[]) ?? []
    return (answers[question.id] as string) ?? ''
  }, [answers, question])

  const setAnswer = useCallback((val: string | string[]) => {
    if (!question) return
    setAnswers((prev) => ({ ...prev, [question.id]: val }))
    setError('')
  }, [question])

  const validate = useCallback((): boolean => {
    if (!question) return true
    const val = getAnswer()
    if (question.required) {
      if (question.type === 'checkbox') {
        if ((val as string[]).length === 0) {
          setError("Don't leave this block behind. Select at least one option.")
          return false
        }
        return true
      }
      const str = (val as string).trim()
      if (!str) {
        setError("Don't leave this block behind. Please answer before continuing.")
        return false
      }
      if (question.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
        setError("This portal doesn't recognize that address. Enter a valid email.")
        return false
      }
    } else if (question.type === 'email' && typeof val === 'string' && val.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      setError("This portal doesn't recognize that address. Enter a valid email.")
      return false
    }
    return true
  }, [getAnswer, question])

  const advance = useCallback(async () => {
    if (!validate()) return
    setPanelState('exiting')
    setTimeout(async () => {
      if (currentQ < total - 1) {
        setCurrentQ((q) => q + 1)
        setPanelState('entering')
        setTimeout(() => setPanelState('idle'), 520)
      } else {
        if (onSubmit) {
          try {
            await onSubmit(answers)
          } catch (err) {
            console.error('Failed to submit form:', err)
          }
        }
        setStage('success')
        if (onComplete) onComplete()
      }
    }, 350)
  }, [currentQ, validate, total, onSubmit, answers, onComplete])

  const goBack = useCallback(() => {
    if (currentQ === 0) return
    setPanelState('exiting')
    setTimeout(() => {
      setCurrentQ((q) => q - 1)
      setError('')
      setPanelState('entering')
      setTimeout(() => setPanelState('idle'), 520)
    }, 350)
  }, [currentQ])

  const enterForm = () => {
    setStage('form')
    setPanelState('entering')
    setTimeout(() => setPanelState('idle'), 520)
  }

  const handleReset = () => {
    setStage('intro')
    setCurrentQ(0)
    setAnswers({})
    setError('')
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (stage !== 'form') return
      if (e.key === 'Enter') advance()
      if (e.key === 'ArrowLeft') goBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stage, advance, goBack])

  const panelClass = panelState === 'entering' ? 'panel-entering' : panelState === 'exiting' ? 'panel-exiting' : ''

  return (
    <div className="nether-theme-root">
      {/* Voxel scene */}
      <NetherScene />

      {/* Vignette Overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 90% 70% at 50% 40%, transparent 30%, rgba(3,0,0,0.55) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-5 md:px-10" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              background: 'rgba(160, 30, 10, 0.6)',
              border: '1px solid rgba(220, 80, 30, 0.5)',
              boxShadow: '0 0 12px rgba(200, 60, 20, 0.4)',
            }}
          >
            <span style={{ fontSize: 13 }}>⛏</span>
          </div>
          <span
            className="font-mono-nether"
            style={{ fontSize: 13, letterSpacing: '0.12em', color: 'rgba(200, 120, 80, 0.9)', fontWeight: 700 }}
          >
            {subtitle}
          </span>
        </div>
        {stage === 'form' && (
          <div style={{ opacity: 0.85 }}>
            <DepthIndicator current={currentQ + 1} total={total} />
          </div>
        )}
      </header>

      {/* Intro */}
      {stage === 'intro' && (
        <IntroScreen
          title={title}
          description={description}
          totalQuestions={total}
          onEnter={enterForm}
        />
      )}

      {/* Form */}
      {stage === 'form' && question && (
        <FormQuestion
          question={question}
          questionIndex={currentQ}
          totalQuestions={total}
          value={getAnswer()}
          error={error}
          panelClass={panelClass}
          onChange={setAnswer}
          onNext={advance}
          onBack={goBack}
          canGoBack={currentQ > 0}
        />
      )}

      {/* Success */}
      {stage === 'success' && <SuccessScreen onReset={handleReset} />}
    </div>
  )
}
