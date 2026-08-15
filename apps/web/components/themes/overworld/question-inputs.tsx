'use client'

import React, { useState, useEffect, useRef } from 'react'

interface FieldProps {
  inputRef?: React.RefObject<HTMLInputElement | null>
  placeholder?: string
  value: string
  error?: boolean
  onChange: (val: string) => void
}

export function TextInput({ inputRef, placeholder, value, error, onChange }: FieldProps) {
  return (
    <input
      ref={inputRef}
      className={`block-input${error ? ' error' : ''}`}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function EmailInput({ inputRef, placeholder, value, error, onChange }: FieldProps) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        className={`block-input${error ? ' error' : ''}`}
        type="email"
        placeholder={placeholder}
        value={value}
        style={{ paddingLeft: 48 }}
        onChange={(e) => onChange(e.target.value)}
      />
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 16,
        }}
      >
        ✉
      </div>
    </div>
  )
}

export function NumberInput({ inputRef, placeholder, value, error, onChange }: FieldProps) {
  return (
    <input
      ref={inputRef}
      className={`block-input${error ? ' error' : ''}`}
      type="number"
      min={0}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

interface DropdownInputProps {
  options: string[]
  value: string
  error?: boolean
  onChange: (val: string) => void
}

export function DropdownInput({ options, value, error, onChange }: DropdownInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={dropRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className={`block-input${error ? ' error' : ''}`}
        onClick={() => setDropdownOpen((o) => !o)}
        style={{
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: value ? '#fff' : 'rgba(255,255,255,0.3)',
        }}
      >
        <span>{value || 'Choose an option'}</span>
        <span
          style={{
            transition: 'transform 0.2s',
            transform: dropdownOpen ? 'rotate(180deg)' : 'none',
            fontSize: 12,
          }}
        >
          ▼
        </span>
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`dropdown-option${value === opt ? ' selected' : ''}`}
              onClick={() => {
                onChange(opt)
                setDropdownOpen(false)
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface CheckboxGroupProps {
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
}

export function CheckboxGroup({ options, values, onChange }: CheckboxGroupProps) {
  const toggleCheck = (opt: string) => {
    const next = values.includes(opt) ? values.filter((o) => o !== opt) : [...values, opt]
    onChange(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt) => {
        const isChecked = values.includes(opt)
        return (
          <div
            key={opt}
            className={`checkbox-block${isChecked ? ' checked' : ''}`}
            onClick={() => toggleCheck(opt)}
          >
            <div className="checkbox-inner">
              {isChecked && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="square" />
                </svg>
              )}
            </div>
            <span
              style={{
                color: isChecked ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 15,
                fontFamily: 'Inter',
              }}
            >
              {opt}
            </span>
          </div>
        )
      })}
    </div>
  )
}
