'use client'

import React, { useState } from 'react'

export function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7a8a" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7a8a" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

interface RegisterInputFieldProps {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  rightSlot?: React.ReactNode
  error?: string
}

export function RegisterInputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  rightSlot,
  error,
}: RegisterInputFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#b0bec5] tracking-[0.1px]">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-[#0d1117] border rounded-lg text-[14px] text-[#eceae4] font-['Outfit'] outline-none transition-colors duration-150 box-border ${
            rightSlot ? 'py-3 pr-11 pl-3.5' : 'py-3 px-3.5'
          } ${
            error
              ? 'border-[#dc2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]'
              : focused
              ? 'border-[#6abf3c] shadow-[0_0_0_3px_rgba(106,191,60,0.1)]'
              : 'border-[#2d3741]'
          }`}
        />
        {rightSlot && (
          <div className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <div className="text-[12px] text-[#dc2626] flex items-center gap-1">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  )
}
