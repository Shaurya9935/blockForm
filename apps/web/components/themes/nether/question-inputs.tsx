'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { Question } from './types'

export function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div
      className="flex items-start gap-2 text-sm"
      style={{
        color: 'rgba(255, 100, 60, 0.9)',
        padding: '6px 10px',
        borderRadius: 4,
        background: 'rgba(120, 20, 5, 0.2)',
        border: '1px solid rgba(180, 40, 15, 0.3)',
      }}
    >
      <span>▲</span>
      <span>{msg}</span>
    </div>
  )
}

export function TextField({
  question,
  value,
  onChange,
  error,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
  error: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type={question.type === 'email' ? 'email' : 'text'}
        className="nether-input w-full rounded px-4 py-3.5 text-base"
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

export function NumberField({
  question,
  value,
  onChange,
  error,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
  error: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="number"
        className="nether-input w-full rounded px-4 py-3.5 text-base"
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
        min={0}
      />
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

export function DropdownField({
  question,
  value,
  onChange,
  error,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
  error: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="nether-input w-full rounded px-4 py-3.5 text-base text-left flex items-center justify-between"
        style={{ cursor: 'pointer' }}
      >
        <span style={{ color: value ? '#f0e8e0' : 'rgba(180, 140, 120, 0.5)' }}>
          {value || 'Select an option'}
        </span>
        <span
          style={{
            color: 'rgba(200, 80, 40, 0.8)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            display: 'inline-block',
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded overflow-hidden"
          style={{
            background: 'rgba(10, 3, 2, 0.97)',
            border: '1px solid rgba(120, 30, 15, 0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(150,30,10,0.2)',
            zIndex: 100,
          }}
        >
          {question.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm transition-all"
              style={{
                color: value === opt ? '#ff8040' : '#c8b0a0',
                background: value === opt ? 'rgba(100,20,5,0.4)' : 'transparent',
                borderBottom: '1px solid rgba(60,15,8,0.4)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.background = 'rgba(80,15,5,0.5)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.background =
                  value === opt ? 'rgba(100,20,5,0.4)' : 'transparent'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}

export function CheckboxGroupField({
  question,
  value,
  onChange,
  error,
}: {
  question: Question
  value: string[]
  onChange: (v: string[]) => void
  error: string
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2.5">
        {question.options?.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer"
            style={{
              padding: '10px 14px',
              borderRadius: 6,
              transition: 'background 0.2s',
              background: value.includes(opt) ? 'rgba(80,15,5,0.35)' : 'rgba(15,5,5,0.3)',
              border: `1px solid ${value.includes(opt) ? 'rgba(180,50,20,0.5)' : 'rgba(80,20,10,0.3)'}`,
            }}
          >
            <input
              type="checkbox"
              className="checkbox-nether"
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span style={{ color: value.includes(opt) ? '#f0e0d0' : '#a08070', fontSize: 15 }}>
              {opt}
            </span>
          </label>
        ))}
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  )
}
