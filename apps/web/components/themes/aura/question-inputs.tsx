'use client'

import React, { useRef, useEffect } from 'react'
import type { Question, Dept, YearCode, Interest } from './types'

export const DEFAULT_DEPTS: { code: Dept; label: string }[] = [
  { code: 'ENG', label: 'Engineering' },
  { code: 'DESIGN', label: 'Design & UI/UX' },
  { code: 'PROD', label: 'Product & Tech' },
  { code: 'AI', label: 'AI & Data Science' },
  { code: 'BIZ', label: 'Business & Ops' },
  { code: 'OTHER', label: 'Other Domain' },
]

export const DEFAULT_YEARS: { code: YearCode; num: string; label: string }[] = [
  { code: 'GENERAL', num: '01', label: 'GENERAL ACCESS' },
  { code: 'VIP', num: '02', label: 'VIP PASS' },
  { code: 'CREATOR', num: '03', label: 'CREATOR TIER' },
  { code: 'STUDENT', num: '04', label: 'STUDENT PASS' },
]

export const DEFAULT_INTERESTS: Interest[] = [
  'KEYNOTES',
  'WORKSHOPS',
  'HACKATHON',
  'NETWORKING',
  'GAMING',
  'DESIGN',
  'AI & TECH',
  'MUSIC',
  'PANELS',
]


export function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div
      className="shake"
      style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 13,
        fontStyle: 'italic',
        color: '#FF5C00',
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span>⚠</span> {msg}
    </div>
  )
}

export function UnderlineInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
}: {
  type?: 'text' | 'email' | 'number'
  placeholder?: string
  value: string
  onChange: (val: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => ref.current?.focus(), 420)
    return () => clearTimeout(timer)
  }, [])

  return (
    <input
      ref={ref}
      type={type}
      className="underline-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      autoComplete="off"
    />
  )
}

export function DeptSelector({
  options = DEFAULT_DEPTS,
  selected,
  onSelect,
  onKeyDown,
}: {
  options?: { code: string; label: string }[]
  selected: string
  onSelect: (code: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginTop: 32,
      }}
    >
      {options.map((d) => (
        <button
          key={d.code}
          type="button"
          className={`dept-tile ${selected === d.code ? 'selected' : ''}`}
          onClick={() => onSelect(d.code)}
          onKeyDown={onKeyDown}
        >
          <div
            className="font-anton-aura"
            style={{
              fontSize: 22,
              letterSpacing: 1,
              color: selected === d.code ? '#00F0FF' : '#F5F0E8',
              transition: 'color 0.2s',
            }}
          >
            {d.code}
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'rgba(245,240,232,0.4)',
              marginTop: 4,
              letterSpacing: 0.5,
            }}
          >
            {d.label}
          </div>
        </button>
      ))}
    </div>
  )
}

export function YearSelector({
  options = DEFAULT_YEARS,
  selected,
  isMobile = false,
  onSelect,
  onKeyDown,
}: {
  options?: { code: string; num: string; label: string }[]
  selected: string
  isMobile?: boolean
  onSelect: (code: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
        gap: 10,
        marginTop: 32,
      }}
    >
      {options.map((y) => (
        <button
          key={y.code}
          type="button"
          className={`year-option ${selected === y.code ? 'selected' : ''}`}
          onClick={() => onSelect(y.code)}
          onKeyDown={onKeyDown}
        >
          <div
            className="font-anton-aura"
            style={{
              fontSize: 36,
              color: selected === y.code ? '#FF5C00' : 'rgba(245,240,232,0.15)',
              lineHeight: 1,
              transition: 'color 0.2s',
              letterSpacing: -1,
            }}
          >
            {y.num}
          </div>
          <div>
            <div
              className="font-anton-aura"
              style={{
                fontSize: 15,
                letterSpacing: 1,
                color: selected === y.code ? '#F5F0E8' : 'rgba(245,240,232,0.5)',
                transition: 'color 0.2s',
              }}
            >
              {y.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export function InterestTagSelector({
  options = DEFAULT_INTERESTS,
  selected,
  onToggle,
  onKeyDown,
}: {
  options?: string[]
  selected: string[]
  onToggle: (tag: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 32,
      }}
    >
      {options.map((tag) => {
        const isSelected = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            className={`interest-tag ${isSelected ? 'selected' : ''}`}
            onClick={() => onToggle(tag)}
            onKeyDown={onKeyDown}
          >
            {isSelected ? `✦ ${tag}` : tag}
          </button>
        )
      })}
    </div>
  )
}

export function OptionSelector({
  options,
  selected,
  onSelect,
  onKeyDown,
}: {
  options: string[]
  selected: string
  onSelect: (opt: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10,
        marginTop: 32,
      }}
    >
      {options.map((opt) => {
        const isSelected = selected === opt
        return (
          <button
            key={opt}
            type="button"
            className={`dept-tile ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(opt)}
            onKeyDown={onKeyDown}
          >
            <div
              className="font-anton-aura"
              style={{
                fontSize: 18,
                letterSpacing: 1,
                color: isSelected ? '#00F0FF' : '#F5F0E8',
                transition: 'color 0.2s',
              }}
            >
              {opt}
            </div>
          </button>
        )
      })}
    </div>
  )
}
