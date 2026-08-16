'use client'

import React from 'react'
import type { ProgressBarProps } from './types'

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`progress-step ${i === current - 1 ? 'active' : i < current - 1 ? 'done' : ''}`}
        />
      ))}
      <span
        className="font-mono-aura"
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: 'rgba(245,240,232,0.35)',
          marginLeft: 4,
        }}
      >
        BUILDING YOUR PASS · {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
  )
}
