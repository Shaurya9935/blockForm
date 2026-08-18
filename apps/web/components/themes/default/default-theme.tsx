'use client'

import React, { useState } from 'react'
import type { DefaultThemeProps, FormValues, FormErrors, Question } from './types'
import { DefaultLogo } from './logo'
import { InputField } from './input-field'
import { SuccessScreen } from './success-screen'
import './default.css'

function validate(q: Question, val: string | string[]): string {
  if (!q.required) return ''
  if (q.type === 'checkbox') return ''
  const v = typeof val === 'string' ? val.trim() : ''
  if (!v) return 'This field is required.'
  if (q.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return 'Enter a valid email address.'
  if (q.type === 'number' && (isNaN(Number(v)) || Number(v) < 0))
    return 'Enter a valid number.'
  return ''
}

export function DefaultTheme({
  title,
  description,
  questions,
  onSubmit,
  onReset,
}: DefaultThemeProps) {
  const [vals, setVals] = useState<FormValues>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    let hasError = false

    questions.forEach((q) => {
      const qKey = String(q.id)
      const err = validate(q, vals[qKey] ?? (q.type === 'checkbox' ? [] : ''))
      if (err) {
        newErrors[qKey] = err
        hasError = true
      }
    })

    if (hasError) {
      setErrors(newErrors)
      const firstErrKey = Object.keys(newErrors)[0]
      if (firstErrKey) {
        document.getElementById(`field-${firstErrKey}`)?.focus()
      }
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(vals)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <SuccessScreen
        onReset={() => {
          setSubmitted(false)
          setVals({})
          setErrors({})
          if (onReset) onReset()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 default-theme-root">
      <header className="px-6 pt-7 pb-0 border-b border-slate-100">
        <div className="max-w-[680px] mx-auto pb-5">
          <DefaultLogo />
        </div>
      </header>

      <main className="px-5 sm:px-6 py-12">
        <div className="max-w-[640px] mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-3">
            BLOCKFORM SURVEY
          </p>

          <h1 className="text-[28px] font-bold text-slate-900 mb-2">{title}</h1>

          {description && (
            <p className="text-[14px] text-slate-500 mb-10 leading-relaxed">{description}</p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {questions.map((q, idx) => {
              const qKey = String(q.id)
              const stepNum = q.num || String(idx + 1).padStart(2, '0')
              const labelText = q.question || q.label || ''

              return (
                <div key={qKey}>
                  <div className="py-7">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-xs font-semibold text-slate-400 tabular-nums mt-1 flex-shrink-0">
                        {stepNum}
                      </span>
                      <div className="flex-1">
                        <label
                          htmlFor={`field-${qKey}`}
                          className="block text-[16px] font-semibold text-slate-800 mb-1"
                        >
                          {labelText}
                          {q.required && <span className="text-indigo-600 ml-1">*</span>}
                        </label>

                        {q.description && (
                          <p className="text-[13px] text-slate-500 mb-3">{q.description}</p>
                        )}

                        <div className={q.description ? '' : 'mt-3'}>
                          <InputField
                            q={{ ...q, id: `field-${qKey}` }}
                            value={vals[qKey] ?? (q.type === 'checkbox' ? [] : '')}
                            error={errors[qKey] ?? ''}
                            onChange={(val) => {
                              setVals((prev) => ({ ...prev, [qKey]: val }))
                              if (errors[qKey]) {
                                setErrors((prev) => ({ ...prev, [qKey]: '' }))
                              }
                            }}
                          />

                          {errors[qKey] && (
                            <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 12 12"
                                fill="none"
                                className="flex-shrink-0"
                              >
                                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                                <path
                                  d="M6 4v2.5M6 8h.01"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              {errors[qKey]}
                            </p>
                          )}

                          {q.helper && !errors[qKey] && (
                            <p className="mt-1.5 text-[12px] text-slate-400">{q.helper}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {idx < questions.length - 1 && <div className="border-t border-slate-100" />}
                </div>
              )
            })}

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="
                  inline-flex items-center gap-2 px-6 py-3
                  bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900
                  disabled:bg-indigo-400 text-white text-[14px] font-semibold
                  rounded-lg transition-colors duration-150 cursor-pointer border-none
                "
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <circle
                        className="opacity-25"
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        className="opacity-75"
                        d="M8 2a6 6 0 0 1 6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  'Submit response'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-5 px-6 border-t border-slate-100">
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Powered by BlockForm</span>
          <span className="text-[11px] text-slate-400">Your response is private</span>
        </div>
      </footer>
    </div>
  )
}
