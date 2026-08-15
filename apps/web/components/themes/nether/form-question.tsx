'use client'

import React from 'react'
import type { FormQuestionProps } from './types'
import {
  TextField,
  NumberField,
  DropdownField,
  CheckboxGroupField,
} from './question-inputs'

export function FormQuestion({
  question,
  questionIndex,
  totalQuestions,
  value,
  error,
  panelClass,
  onChange,
  onNext,
  onBack,
  canGoBack,
}: FormQuestionProps) {
  const strVal = typeof value === 'string' ? value : ''
  const arrVal = Array.isArray(value) ? value : []

  return (
    <main className="relative flex-1 flex items-center justify-center px-4 pb-16 pt-4" style={{ zIndex: 10 }}>
      <div
        className={`w-full max-w-lg ${panelClass}`}
        style={{
          background: 'rgba(8, 2, 2, 0.85)',
          border: '1px solid rgba(100, 25, 12, 0.55)',
          boxShadow: '0 0 0 1px rgba(80,18,8,0.2), 0 4px 60px rgba(0,0,0,0.75), 0 0 40px rgba(120,25,8,0.2)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: 'clamp(28px, 5vw, 52px)',
          position: 'relative',
        }}
      >
        <div
          className="absolute inset-x-0 top-0"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(200, 60, 20, 0.6), transparent)' }}
        />

        <div className="mb-8">
          <p
            className="mb-1.5 text-xs tracking-widest uppercase font-mono-nether"
            style={{ color: 'rgba(160, 70, 40, 0.8)' }}
          >
            Question {questionIndex + 1}
            {question.required && <span style={{ color: 'rgba(255,100,100,0.8)', marginLeft: 8 }}>* Required</span>}
          </p>
          <h2
            className="mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 700, color: '#f0e8e0', letterSpacing: '-0.01em' }}
          >
            {question.question}
          </h2>
          {question.description && (
            <p style={{ fontSize: 14, color: 'rgba(160, 120, 100, 0.85)', lineHeight: 1.6 }}>
              {question.description}
            </p>
          )}
        </div>

        <div className="mb-8">
          {(question.type === 'text' || question.type === 'email') && (
            <TextField
              question={question}
              value={strVal}
              onChange={(v) => onChange(v)}
              error={error}
            />
          )}

          {question.type === 'number' && (
            <NumberField
              question={question}
              value={strVal}
              onChange={(v) => onChange(v)}
              error={error}
            />
          )}

          {question.type === 'dropdown' && (
            <DropdownField
              question={question}
              value={strVal}
              onChange={(v) => onChange(v)}
              error={error}
            />
          )}

          {question.type === 'checkbox' && (
            <CheckboxGroupField
              question={question}
              value={arrVal}
              onChange={(v) => onChange(v)}
              error={error}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="flex items-center gap-2 text-sm transition-all"
            style={{
              color: !canGoBack ? 'rgba(100,60,40,0.4)' : 'rgba(160,100,70,0.8)',
              cursor: !canGoBack ? 'not-allowed' : 'pointer',
              background: 'transparent',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              if (canGoBack) (e.currentTarget as HTMLElement).style.color = 'rgba(200,140,100,1)'
            }}
            onMouseLeave={(e) => {
              if (canGoBack) (e.currentTarget as HTMLElement).style.color = 'rgba(160,100,70,0.8)'
            }}
          >
            ← Back
          </button>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={onNext}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: 'rgba(150, 32, 8, 0.85)',
                border: '1px solid rgba(210, 70, 25, 0.55)',
                color: '#f5d5b5',
                boxShadow: '0 0 20px rgba(160,35,8,0.35), inset 0 1px 0 rgba(255,120,60,0.15)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(190,45,12,0.9)'
                el.style.boxShadow = '0 0 30px rgba(200,50,10,0.5), inset 0 1px 0 rgba(255,140,70,0.25)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(150,32,8,0.85)'
                el.style.boxShadow = '0 0 20px rgba(160,35,8,0.35), inset 0 1px 0 rgba(255,120,60,0.15)'
              }}
            >
              {questionIndex < totalQuestions - 1 ? 'Continue' : 'Submit'} →
            </button>
            <span
              className="font-mono-nether"
              style={{ fontSize: 11, color: 'rgba(120,80,60,0.7)', letterSpacing: '0.05em' }}
            >
              Press Enter ↵
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
