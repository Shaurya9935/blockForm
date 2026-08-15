'use client'

import React from 'react'
import type { SuccessScreenProps } from './types'

export function SuccessScreen({
  badge = 'Mission complete',
  title = 'YOU MADE IT.',
  message = 'Your response has been submitted successfully.',
  footerHint = 'Thanks for making it this far.',
  onReset,
}: SuccessScreenProps) {
  return (
    <main className="relative flex-1 flex items-center justify-center px-6 pb-20" style={{ zIndex: 10 }}>
      <div
        className="flex flex-col items-center text-center max-w-md"
        style={{ animation: 'success-portal 0.8s cubic-bezier(0.22,1,0.36,1) forwards' }}
      >
        <div
          className="mb-8 flex items-center justify-center"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '2px solid rgba(200, 60, 20, 0.6)',
            boxShadow: '0 0 40px rgba(200,60,20,0.5), inset 0 0 30px rgba(120,20,5,0.4)',
            background: 'radial-gradient(circle at 40% 40%, rgba(80,15,5,0.8), rgba(10,2,2,0.9))',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, rgba(200,80,30,0.8), rgba(100,20,5,0.5))',
              boxShadow: '0 0 20px rgba(240,100,40,0.6)',
            }}
          />
        </div>
        <p
          className="mb-2 text-xs tracking-widest uppercase font-mono-nether"
          style={{ color: 'rgba(180, 80, 40, 0.8)' }}
        >
          {badge}
        </p>
        <h2
          className="mb-4"
          style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, color: '#f5e5d5', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {title}
        </h2>
        <p className="mb-3" style={{ fontSize: 17, color: 'rgba(200,155,125,0.9)', lineHeight: 1.6 }}>
          {message}
        </p>
        <p className="mb-10" style={{ fontSize: 14, color: 'rgba(140,100,80,0.7)' }}>
          {footerHint}
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => {
              if (onReset) onReset()
              else window.location.reload()
            }}
            className="px-7 py-3 text-sm font-medium transition-all cursor-pointer"
            style={{
              background: 'rgba(40,8,3,0.8)',
              border: '1px solid rgba(120,35,15,0.5)',
              color: 'rgba(200,150,120,0.9)',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(180,60,25,0.7)'
              el.style.color = '#f0d5b5'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(120,35,15,0.5)'
              el.style.color = 'rgba(200,150,120,0.9)'
            }}
          >
            Return Home
          </button>
          <p
            className="font-mono-nether"
            style={{ fontSize: 11, color: 'rgba(100,70,55,0.7)', letterSpacing: '0.04em' }}
          >
            ✓ Response saved successfully
          </p>
        </div>
      </div>
    </main>
  )
}
