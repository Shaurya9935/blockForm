'use client'

import React from 'react'
import type { IntroScreenProps } from './types'

export function IntroScreen({
  badge = 'The Nether',
  title = 'Something is waiting below.',
  description = 'Answer a few questions and make your way through the depths.',
  totalQuestions,
  estimatedTime = 'about 2 minutes',
  onEnter,
}: IntroScreenProps) {
  return (
    <main className="relative flex-1 flex items-center justify-center px-6 pb-20" style={{ zIndex: 10 }}>
      <div className="flex flex-col items-center text-center max-w-lg">
        <div
          className="intro-animate intro-animate-delay-1 mb-3 px-4 py-1 text-xs tracking-widest uppercase font-mono-nether"
          style={{
            color: 'rgba(180, 80, 40, 0.9)',
            border: '1px solid rgba(120, 30, 15, 0.5)',
            background: 'rgba(60, 10, 5, 0.5)',
          }}
        >
          {badge}
        </div>
        <h1
          className="intro-animate intro-animate-delay-2 mb-4 leading-tight"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700, color: '#f5e5d5', letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
        <p
          className="intro-animate intro-animate-delay-3 mb-10 leading-relaxed"
          style={{ fontSize: 17, color: 'rgba(180, 140, 120, 0.8)', maxWidth: 360 }}
        >
          {description}
        </p>
        <div className="intro-animate intro-animate-delay-4 flex flex-col items-center gap-4">
          <button
            onClick={onEnter}
            className="group flex items-center gap-3 px-8 py-4 text-base font-semibold transition-all duration-300 cursor-pointer"
            style={{
              background: 'rgba(160, 35, 10, 0.85)',
              border: '1px solid rgba(220, 80, 30, 0.6)',
              color: '#f5d5b5',
              letterSpacing: '0.03em',
              boxShadow: '0 0 24px rgba(180, 40, 10, 0.4), inset 0 1px 0 rgba(255, 120, 60, 0.2)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(200, 50, 15, 0.9)'
              el.style.boxShadow = '0 0 36px rgba(200, 50, 10, 0.6), inset 0 1px 0 rgba(255, 140, 70, 0.3)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(160, 35, 10, 0.85)'
              el.style.boxShadow = '0 0 24px rgba(180, 40, 10, 0.4), inset 0 1px 0 rgba(255, 120, 60, 0.2)'
            }}
          >
            Enter the Nether
            <span className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'rgba(255, 140, 80, 0.9)' }}>
              →
            </span>
          </button>
          <p
            className="font-mono-nether"
            style={{ fontSize: 12, color: 'rgba(140, 100, 80, 0.7)', letterSpacing: '0.05em' }}
          >
            {totalQuestions} questions · {estimatedTime}
          </p>
        </div>
      </div>
    </main>
  )
}
