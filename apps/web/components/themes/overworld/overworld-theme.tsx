'use client'

import React, { useState, useCallback, useEffect } from 'react'
import './overworld.css'
import type { Screen, EnvTheme, OverworldThemeProps, Question } from './types'
import { BlockWorld } from './block-world'
import { LandingCard } from './landing-card'
import { FormQuestion } from './form-question'
import { SubmittingScreen } from './submitting-screen'
import { SuccessScreen } from './success-screen'

export const DEFAULT_ENV_THEMES: EnvTheme[] = [
  { name: 'Morning Overworld', skyStart: '#87ceeb', skyEnd: '#b8dff5', accent: '#f4a861', label: '🌅 Morning' },
  { name: 'Deep Forest', skyStart: '#3d6b4a', skyEnd: '#5a8a5c', accent: '#7ab84e', label: '🌲 Forest' },
  { name: 'Mountain Pass', skyStart: '#4a6b9a', skyEnd: '#6b8cba', accent: '#a0c8e0', label: '🏔 Mountain' },
  { name: 'Dusk Valley', skyStart: '#c47a5a', skyEnd: '#8b5080', accent: '#f0c850', label: '🌌 Evening' },
  { name: 'Night Sky', skyStart: '#0f0f2e', skyEnd: '#1a1a4e', accent: '#6b8cba', label: '✨ Night' },
  { name: 'Golden Dawn', skyStart: '#e8c87a', skyEnd: '#c49050', accent: '#fff5cc', label: '🌄 Final' },
]

export const DEFAULT_QUESTIONS: Question[] = [
  { id: 1, type: 'text', question: "What's your name?", placeholder: 'Enter your name…', required: true },
  { id: 2, type: 'email', question: 'Where can we send your confirmation?', placeholder: 'you@example.com', required: true },
  { id: 3, type: 'number', question: 'How many events have you attended before?', placeholder: '0' },
  { id: 4, type: 'dropdown', question: 'Which department are you from?', required: true, options: ['CSE', 'AI/ML', 'ECE', 'Mechanical', 'Civil', 'Other'] },
  { id: 5, type: 'checkbox', question: 'What are you interested in?', options: ['Hackathon', 'Gaming', 'Music', 'Workshops', 'Esports', 'Art & Design'] },
  { id: 6, type: 'text', question: 'Any message for the organizing team?', placeholder: 'Totally optional — say hi!' },
]

export function OverworldTheme({
  title = 'COLLEGE FEST 2026',
  subtitle = '⛏ BLOCKFORM',
  description = 'Tell us a little about yourself before you join the event.',
  questions = DEFAULT_QUESTIONS,
  onSubmit,
  onComplete,
}: OverworldThemeProps) {
  const [screen, setScreen] = useState<Screen>('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number | string, string | string[]>>({})
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const activeQuestions = questions.length > 0 ? questions : DEFAULT_QUESTIONS
  const envIndex = screen === 'form' ? Math.min(currentQ, DEFAULT_ENV_THEMES.length - 1) : 0
  const env = (DEFAULT_ENV_THEMES[envIndex] ?? DEFAULT_ENV_THEMES[0]) as EnvTheme


  const handleEnter = () => setScreen('form')

  const handleAnswer = useCallback((questionId: number | string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const handleNext = useCallback(async () => {
    if (currentQ < activeQuestions.length - 1) {
      setDirection('forward')
      setCurrentQ((q) => q + 1)
    } else {
      setScreen('submitting')
      if (onSubmit) {
        try {
          await onSubmit(answers)
        } catch (err) {
          console.error('Failed to submit form:', err)
        }
      }
      setTimeout(() => {
        setScreen('success')
        if (onComplete) onComplete()
      }, 2200)
    }
  }, [currentQ, activeQuestions.length, onSubmit, answers, onComplete])

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      setDirection('back')
      setCurrentQ((q) => q - 1)
    } else {
      setScreen('landing')
    }
  }, [currentQ])

  const handleReset = () => {
    setAnswers({})
    setCurrentQ(0)
    setScreen('landing')
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'form') return
      if (e.key === 'Enter' && !e.shiftKey) {
        const active = document.activeElement
        if (active && active.tagName === 'TEXTAREA') return
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen])

  const currentQuestion = activeQuestions[currentQ]

  return (
    <div className="overworld-theme-root">
      {/* Animated sky background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${env.skyStart} 0%, ${env.skyEnd} 60%, rgba(90,60,30,0.6) 100%)`,
          transition: 'background 1.8s ease',
          zIndex: 0,
        }}
      />

      {/* Block world scene */}
      <BlockWorld
        envIndex={envIndex}
        showFullScene={screen === 'landing'}
        env={env}
      />

      {/* Content layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {screen === 'landing' && (
          <LandingCard
            title={title}
            subtitle={subtitle}
            description={description}
            totalQuestions={activeQuestions.length}
            onEnter={handleEnter}
          />
        )}

        {screen === 'form' && currentQuestion && (
          <FormQuestion
            question={currentQuestion}
            questionIndex={currentQ}
            totalQuestions={activeQuestions.length}
            value={answers[currentQuestion.id]}
            onChange={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            direction={direction}
            env={env}
          />
        )}

        {screen === 'submitting' && <SubmittingScreen />}

        {screen === 'success' && <SuccessScreen onReset={handleReset} />}
      </div>
    </div>
  )
}
