'use client'

import React from 'react'
import type { Question } from './types'

interface InputFieldProps {
  q: Question
  value: string | string[]
  error: string
  onChange: (val: string | string[]) => void
}

export function InputField({ q, value, error, onChange }: InputFieldProps) {
  const labelText = q.question || q.label || ''
  const isSelect = q.type === 'select' || q.type === 'dropdown'
  const isRadio = q.type === 'radio'
  const isCheckbox = q.type === 'checkbox'

  const inputClass = `
    w-full px-4 py-3 text-[15px] bg-white border rounded-lg text-slate-800
    placeholder:text-slate-400 transition-all duration-150 outline-none
    ${
      error
        ? 'border-red-400 ring-2 ring-red-100 focus:border-red-400 focus:ring-red-100'
        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
    }
  `

  if (isSelect) {
    return (
      <select
        className={inputClass}
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      >
        <option value="">{q.placeholder ?? 'Select an option'}</option>
        {q.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )
  }

  if (isRadio) {
    return (
      <div className="space-y-2" role="radiogroup" aria-label={labelText}>
        {q.options?.map((opt) => {
          const checked = value === opt
          return (
            <label
              key={opt}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer
                transition-all duration-150 select-none
                ${
                  checked
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div
                className={`
                w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                transition-colors duration-150
                ${checked ? 'border-indigo-600' : 'border-slate-300'}
              `}
              >
                {checked && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
              </div>
              <input
                type="radio"
                className="sr-only"
                name={String(q.id)}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
              />
              <span className="text-[15px] font-medium">{opt}</span>
            </label>
          )
        })}
      </div>
    )
  }

  if (isCheckbox) {
    const vals = (value as string[]) || []
    return (
      <div className="space-y-2">
        {q.options?.map((opt) => {
          const checked = vals.includes(opt)
          return (
            <label
              key={opt}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer
                transition-all duration-150 select-none
                ${
                  checked
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div
                className={`
                w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center
                transition-all duration-150
                ${checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'}
              `}
              >
                {checked && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3l2.5 2.5L8 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                value={opt}
                checked={checked}
                onChange={() => {
                  onChange(checked ? vals.filter((v) => v !== opt) : [...vals, opt])
                }}
              />
              <span className="text-[15px] font-medium">{opt}</span>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <input
      type={q.type === 'email' ? 'email' : q.type === 'number' ? 'number' : 'text'}
      className={inputClass}
      value={(value as string) || ''}
      placeholder={q.placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      min={q.type === 'number' ? 0 : undefined}
    />
  )
}
