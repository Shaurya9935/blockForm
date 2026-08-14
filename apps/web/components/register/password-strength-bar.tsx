'use client'

import React from 'react'

export function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (pw.length === 0) return { level: 0, label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { level: 1, label: 'Weak' }
  if (score === 2 || score === 3) return { level: 2, label: 'Medium' }
  return { level: 3, label: 'Strong' }
}

export function PasswordStrengthBar({ password }: { password: string }) {
  const { level, label } = getPasswordStrength(password)
  if (level === 0) return null

  const colors: Record<number, string> = { 1: '#dc2626', 2: '#f59e0b', 3: '#6abf3c' }
  const color = colors[level]

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-0.5 rounded transition-colors duration-300 ${
              i <= level ? (level === 1 ? 'bg-[#dc2626]' : level === 2 ? 'bg-[#f59e0b]' : 'bg-[#6abf3c]') : 'bg-[#21262d]'
            }`}
          />
        ))}
      </div>
      <div
        className="text-[11px] font-semibold flex items-center gap-1.5"
        style={{ color }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-sm [image-rendering:pixelated]"
          style={{ backgroundColor: color }}
        />
        {label} password
      </div>
    </div>
  )
}
