'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { FormQuestionProps } from './types'
import {
  TextInput,
  EmailInput,
  NumberInput,
  DropdownInput,
  CheckboxGroup,
} from './question-inputs'

export function FormQuestion({
  question,
  questionIndex,
  totalQuestions,
  value,
  onChange,
  onNext,
  onBack,
  direction,
  env,
}: FormQuestionProps) {
  const [error, setError] = useState('')
  const [animKey, setAnimKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const strVal = typeof value === 'string' ? value : ''
  const arrVal = Array.isArray(value) ? value : []

  useEffect(() => {
    setAnimKey((k) => k + 1)
    setError('')
    const t = setTimeout(() => inputRef.current?.focus(), 350)
    return () => clearTimeout(t)
  }, [question.id])

  const validate = useCallback(() => {
    if (question.required) {
      if (question.type === 'checkbox') {
        if (arrVal.length === 0) {
          setError('This block still needs something.')
          return false
        }
      } else if (!strVal.trim()) {
        setError('This block still needs something.')
        return false
      } else if (question.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
        setError('Looks like this block needs fixing.')
        return false
      }
    } else if (question.type === 'email' && strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      setError('Looks like this block needs fixing.')
      return false
    }
    return true
  }, [question, strVal, arrVal])

  const handleNext = useCallback(() => {
    if (!validate()) return
    onNext()
  }, [validate, onNext])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        question.type !== 'checkbox' &&
        question.type !== 'dropdown'
      ) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleNext, question.type])

  const animClass = direction === 'forward' ? 'animate-fade-slide-up' : 'animate-fade-slide-down'

  return (
    <div style={{ width: '100%', maxWidth: 560, padding: '0 24px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pixel-font" style={{ fontSize: 7, color: 'rgba(212,168,67,0.8)', letterSpacing: 2 }}>
            ⛏ BLOCKFORM
          </span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
          <span className="pixel-font" style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
            COLLEGE FEST 2026
          </span>
        </div>
        <div className="pixel-font" style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
          {env.label}
        </div>
      </div>

      {/* Block progress indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i < questionIndex ? 28 : i === questionIndex ? 20 : 14,
              height: 14,
              background: i < questionIndex ? 'var(--gold)' : i === questionIndex ? 'rgba(212,168,67,0.6)' : 'rgba(255,255,255,0.12)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              clipPath: 'polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)',
            }}
          />
        ))}
        <span style={{ marginLeft: 10, color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter' }}>
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Question card */}
      <div
        key={animKey}
        className={animClass}
        style={{
          background: 'rgba(10,8,6,0.82)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          padding: '36px 36px 32px',
          clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        {/* Block label */}
        <div className="pixel-font" style={{ fontSize: 6, color: 'rgba(212,168,67,0.5)', letterSpacing: 2, marginBottom: 14 }}>
          BLOCK {String(questionIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
          {question.required && <span style={{ color: 'rgba(255,100,100,0.7)', marginLeft: 10 }}>* REQUIRED</span>}
        </div>

        {/* Question text */}
        <h2
          style={{
            color: '#fff',
            fontSize: 24,
            fontWeight: 600,
            margin: '0 0 28px',
            lineHeight: 1.35,
            fontFamily: 'Inter',
          }}
        >
          {question.question}
        </h2>

        {/* Input area */}
        {question.type === 'text' && (
          <TextInput
            inputRef={inputRef}
            placeholder={question.placeholder}
            value={strVal}
            error={!!error}
            onChange={(v) => {
              onChange(question.id, v)
              setError('')
            }}
          />
        )}

        {question.type === 'email' && (
          <EmailInput
            inputRef={inputRef}
            placeholder={question.placeholder}
            value={strVal}
            error={!!error}
            onChange={(v) => {
              onChange(question.id, v)
              setError('')
            }}
          />
        )}

        {question.type === 'number' && (
          <NumberInput
            inputRef={inputRef}
            placeholder={question.placeholder}
            value={strVal}
            error={!!error}
            onChange={(v) => {
              onChange(question.id, v)
              setError('')
            }}
          />
        )}

        {question.type === 'dropdown' && (
          <DropdownInput
            options={question.options || []}
            value={strVal}
            error={!!error}
            onChange={(v) => {
              onChange(question.id, v)
              setError('')
            }}
          />
        )}

        {question.type === 'checkbox' && (
          <CheckboxGroup
            options={question.options || []}
            values={arrVal}
            onChange={(nextArr) => {
              onChange(question.id, nextArr)
              setError('')
            }}
          />
        )}

        {/* Error message */}
        {error && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#e05050', fontSize: 12, fontFamily: 'Inter', fontWeight: 500 }}>{error}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Inter' }}>
              {question.type === 'email' ? 'Please enter a valid email address.' : 'Please answer this question before continuing.'}
            </span>
          </div>
        )}

        {/* Enter hint */}
        {(question.type === 'text' || question.type === 'email' || question.type === 'number') && !error && (
          <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'Inter' }}>
            Press{' '}
            <kbd style={{ fontFamily: 'Inter', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '1px 6px', fontSize: 10 }}>
              Enter ↵
            </kbd>{' '}
            to continue
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <button className="btn-ghost" onClick={onBack}>
          {questionIndex === 0 ? '← Back to World' : '← Back'}
        </button>
        <button className="btn-primary" onClick={handleNext}>
          {questionIndex === totalQuestions - 1 ? 'SUBMIT →' : 'CONTINUE →'}
        </button>
      </div>
    </div>
  )
}
