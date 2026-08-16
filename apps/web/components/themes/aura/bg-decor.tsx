'use client'

import React from 'react'
import type { BgDecorProps } from './types'

const BG_ACCENT_LABELS = [
  '', // landing — step 0
  'NAME', // step 1
  'MAIL', // step 2
  'DEPT', // step 3
  'YEAR', // step 4
  'FEST', // step 5
  'REVIEW', // step 6
  'AURA', // step 7
]

export function BgDecor({ step }: BgDecorProps) {
  const label = BG_ACCENT_LABELS[step] ?? 'AURA'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Blurred blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'opacity 0.8s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '-10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(255,92,0,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'opacity 0.8s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(186,255,41,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Giant background type */}
      <div
        className="font-anton-aura"
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-20px',
          fontSize: 'clamp(140px, 20vw, 240px)',
          color: 'rgba(245,240,232,0.025)',
          letterSpacing: -4,
          lineHeight: 1,
          userSelect: 'none',
          transition: 'opacity 0.6s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>

      {/* Diagonal lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="30%" y2="0" stroke="rgba(245,240,232,0.03)" strokeWidth="1" />
        <line x1="70%" y1="100%" x2="100%" y2="20%" stroke="rgba(245,240,232,0.03)" strokeWidth="1" />
        <line x1="0" y1="60%" x2="50%" y2="0" stroke="rgba(0,240,255,0.02)" strokeWidth="1" />
      </svg>

      {/* Top edge accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.3) 40%, rgba(255,92,0,0.3) 70%, transparent 100%)',
        }}
      />
    </div>
  )
}
