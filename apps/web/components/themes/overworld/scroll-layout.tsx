'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { Question, Screen } from './types'
import { BlockWorld } from './block-world'
import { LandingCard } from './landing-card'
import { SubmittingScreen } from './submitting-screen'
import { SuccessScreen } from './success-screen'

export interface ScrollLayoutProps {
  title?: string
  subtitle?: string
  description?: string
  questions: Question[]
  onSubmit?: (answers: Record<string | number, string | string[]>) => Promise<void> | void
  onComplete?: () => void
  onBack?: () => void
}

const SCROLL_ENV = {
  name: 'Overworld',
  skyStart: '#87ceeb',
  skyEnd: '#b8dff5',
  accent: '#f4a861',
  label: '🌍 Overworld',
}

export function ScrollLayout({
  title = 'COLLEGE FEST 2026',
  subtitle = '⛏ BLOCKFORM',
  description = 'Answer all questions below and submit when ready.',
  questions,
  onSubmit,
  onComplete,
  onBack,
}: ScrollLayoutProps) {
  const [answers, setAnswers] = useState<Record<string | number, string | string[]>>({})
  const [errors, setErrors] = useState<Record<string | number, string>>({})
  const [dropdownOpen, setDropdownOpen] = useState<string | number | null>(null)
  const [screen, setScreen] = useState<Screen>('landing')
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeQuestions = questions && questions.length > 0 ? questions : []

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const total = scrollHeight - clientHeight
    setScrollProgress(total > 0 ? scrollTop / total : 0)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.scroll-dropdown')) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const setAnswer = (id: string | number, val: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: val }))
    setErrors((prev) => {
      const n = { ...prev }
      delete n[id]
      return n
    })
  }

  const toggleCheck = (id: string | number, opt: string) => {
    const cur = Array.isArray(answers[id]) ? (answers[id] as string[]) : []
    const next = cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]
    setAnswer(id, next)
  }

  const validate = () => {
    const newErrors: Record<string | number, string> = {}
    activeQuestions.forEach((q) => {
      if (!q.required) return
      const val = answers[q.id]
      if (q.type === 'checkbox') {
        if (!Array.isArray(val) || val.length === 0) newErrors[q.id] = 'This block still needs something.'
      } else if (!val || !(val as string).trim()) {
        newErrors[q.id] = 'This block still needs something.'
      } else if (q.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val as string)) {
        newErrors[q.id] = 'Looks like this block needs fixing.'
      }
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      const firstErrId = Object.keys(newErrors)[0]
      document.getElementById(`block-${firstErrId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

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

  const handleReset = () => {
    setAnswers({})
    setErrors({})
    setScreen('landing')
  }

  const handleBackToLanding = () => {
    if (onBack) {
      onBack()
    } else {
      setScreen('landing')
    }
  }

  const answeredCount = activeQuestions.filter((q) => {
    const v = answers[q.id]
    return Array.isArray(v) ? v.length > 0 : Boolean(v && (v as string).trim())
  }).length

  const progressPct = activeQuestions.length > 0 ? (answeredCount / activeQuestions.length) * 100 : 0

  if (screen === 'landing') {
    return (
      <div className="overworld-theme-root" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Animated sky background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${SCROLL_ENV.skyStart} 0%, ${SCROLL_ENV.skyEnd} 60%, rgba(90,60,30,0.6) 100%)`,
            transition: 'background 1.8s ease',
            zIndex: 0,
          }}
        />

        {/* Block world scene */}
        <BlockWorld
          envIndex={0}
          showFullScene={true}
          env={SCROLL_ENV}
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
          <LandingCard
            title={title}
            subtitle={subtitle}
            description={description}
            totalQuestions={activeQuestions.length}
            onEnter={() => setScreen('form')}
          />
        </div>
      </div>
    )
  }

  if (screen === 'submitting') {
    return (
      <div className="overworld-theme-root" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#87ceeb 0%,#b8dff5 60%,rgba(90,60,30,0.6) 100%)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <SubmittingScreen />
        </div>
      </div>
    )
  }

  if (screen === 'success') {
    return <SuccessScreen onReset={handleReset} />
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Background world */}
      <BlockWorld envIndex={0} showFullScene={false} env={SCROLL_ENV} />

      {/* Dark overlay for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,6,4,0.6)', zIndex: 2 }} />

      {/* Sticky header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: 'rgba(10,8,6,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 660,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={handleBackToLanding}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 16,
                padding: '4px 8px 4px 0',
                fontFamily: 'Inter',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              ←
            </button>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <span className="pixel-font" style={{ fontSize: 7, color: 'rgba(212,168,67,0.8)', letterSpacing: 2 }}>
              {subtitle || '⛏ BLOCKFORM'}
            </span>
          </div>

          {/* Compact progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 80,
                height: 4,
                background: 'rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden',
                clipPath: 'polygon(1px 0%, 100% 0%, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0% 100%, 0% 1px)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'var(--gold, #d4a843)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {answeredCount} / {activeQuestions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: 56,
          scrollBehavior: 'smooth',
        }}
      >
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 24px 80px' }}>
          {/* Form header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="pixel-font" style={{ fontSize: 9, color: '#d4a843', letterSpacing: 3, marginBottom: 12 }}>
              {title}
            </div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 10px', fontFamily: 'Inter', lineHeight: 1.25 }}>
              Build your registration profile.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Inter', margin: 0, lineHeight: 1.7 }}>
              {description}
            </p>

            {/* Block decorators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 20 }}>
              {[18, 12, 8, 12, 18].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: h,
                    background:
                      i === 2 ? 'var(--gold, #d4a843)' : i === 1 || i === 3 ? 'rgba(90,138,60,0.6)' : 'rgba(255,255,255,0.1)',
                    clipPath: 'polygon(1px 0%, 100% 0%, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0% 100%, 0% 1px)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {activeQuestions.map((q, idx) => {
              const strVal = typeof answers[q.id] === 'string' ? (answers[q.id] as string) : ''
              const arrVal = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : []
              const hasError = !!errors[q.id]
              const isAnswered = Array.isArray(answers[q.id]) ? arrVal.length > 0 : Boolean(strVal.trim())

              return (
                <div
                  key={q.id}
                  id={`block-${q.id}`}
                  style={{
                    background: 'rgba(10,8,6,0.8)',
                    backdropFilter: 'blur(12px)',
                    border: `1.5px solid ${hasError ? 'rgba(192,57,43,0.6)' : isAnswered ? 'rgba(90,138,60,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    padding: '24px 26px',
                    clipPath: 'polygon(5px 0%, 100% 0%, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0% 100%, 0% 5px)',
                    transition: 'border-color 0.25s',
                    position: 'relative',
                  }}
                >
                  {/* Answered indicator */}
                  {isAnswered && !hasError && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 16,
                        height: 16,
                        background: 'rgba(90,138,60,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        clipPath: 'polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)',
                      }}
                    >
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                        <path d="M1 3.5L3 5.5L7 1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="square" />
                      </svg>
                    </div>
                  )}

                  {/* Block label */}
                  <div className="pixel-font" style={{ fontSize: 6, color: 'rgba(212,168,67,0.5)', letterSpacing: 2, marginBottom: 10 }}>
                    BLOCK {String(idx + 1).padStart(2, '0')}
                    {q.required && <span style={{ color: 'rgba(255,100,100,0.6)', marginLeft: 8 }}>* REQUIRED</span>}
                  </div>

                  {/* Question */}
                  <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 16px', fontFamily: 'Inter', lineHeight: 1.3 }}>
                    {q.question}
                  </h3>

                  {/* Inputs */}
                  {q.type === 'text' && (
                    <input
                      className={`block-input${hasError ? ' error' : ''}`}
                      type="text"
                      placeholder={q.placeholder}
                      value={strVal}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                    />
                  )}

                  {q.type === 'email' && (
                    <div style={{ position: 'relative' }}>
                      <input
                        className={`block-input${hasError ? ' error' : ''}`}
                        type="email"
                        placeholder={q.placeholder}
                        value={strVal}
                        style={{ paddingLeft: 46 }}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgba(255,255,255,0.3)',
                          fontSize: 15,
                        }}
                      >
                        ✉
                      </div>
                    </div>
                  )}

                  {q.type === 'number' && (
                    <input
                      className={`block-input${hasError ? ' error' : ''}`}
                      type="number"
                      min={0}
                      placeholder={q.placeholder}
                      value={strVal}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                    />
                  )}

                  {q.type === 'dropdown' && (
                    <div className="scroll-dropdown" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className={`block-input${hasError ? ' error' : ''}`}
                        onClick={() => setDropdownOpen(dropdownOpen === q.id ? null : q.id)}
                        style={{
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: strVal ? '#fff' : 'rgba(255,255,255,0.3)',
                        }}
                      >
                        <span>{strVal || 'Choose an option'}</span>
                        <span
                          style={{
                            transition: 'transform 0.2s',
                            transform: dropdownOpen === q.id ? 'rotate(180deg)' : 'none',
                            fontSize: 12,
                          }}
                        >
                          ▼
                        </span>
                      </button>
                      {dropdownOpen === q.id && (
                        <div className="dropdown-menu" style={{ zIndex: 50 }}>
                          {(q.options ?? []).map((opt) => (
                            <div
                              key={opt}
                              className={`dropdown-option${strVal === opt ? ' selected' : ''}`}
                              onClick={() => {
                                setAnswer(q.id, opt)
                                setDropdownOpen(null)
                              }}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {q.type === 'checkbox' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(q.options ?? []).map((opt) => (
                        <div
                          key={opt}
                          className={`checkbox-block${arrVal.includes(opt) ? ' checked' : ''}`}
                          onClick={() => toggleCheck(q.id, opt)}
                        >
                          <div className="checkbox-inner">
                            {arrVal.includes(opt) && (
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5L4.5 8.5L11 1.5" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="square" />
                              </svg>
                            )}
                          </div>
                          <span
                            style={{
                              color: arrVal.includes(opt) ? '#fff' : 'rgba(255,255,255,0.7)',
                              fontSize: 14,
                              fontFamily: 'Inter',
                            }}
                          >
                            {opt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error */}
                  {hasError && (
                    <div style={{ marginTop: 10 }}>
                      <span style={{ color: '#e05050', fontSize: 12, fontFamily: 'Inter', fontWeight: 500 }}>
                        {errors[q.id]}
                      </span>
                      <br />
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter' }}>
                        {q.type === 'email'
                          ? 'Please enter a valid email address.'
                          : 'Please answer this question before continuing.'}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Submit section */}
          <div
            style={{
              marginTop: 40,
              padding: '32px 26px',
              background: 'rgba(10,8,6,0.75)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(212,168,67,0.2)',
              clipPath: 'polygon(5px 0%, 100% 0%, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0% 100%, 0% 5px)',
              textAlign: 'center',
            }}
          >
            <div className="pixel-font" style={{ fontSize: 8, color: 'rgba(212,168,67,0.6)', letterSpacing: 2, marginBottom: 10 }}>
              FINAL BLOCK
            </div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 6px', fontFamily: 'Inter' }}>
              You&apos;re almost done.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter', margin: '0 0 24px', lineHeight: 1.6 }}>
              Review your answers and submit your form.
            </p>
            <button className="btn-primary" onClick={handleSubmit} style={{ fontSize: 9, minWidth: 200 }}>
              SUBMIT FORM →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

