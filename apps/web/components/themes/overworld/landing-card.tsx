'use client'

import React, { useState } from 'react'
import type { LandingCardProps } from './types'

export function LandingCard({
  title = 'COLLEGE FEST 2026',
  subtitle = '⛏ BLOCKFORM',
  description = 'Tell us a little about yourself before you join the event.',
  totalQuestions = 6,
  estimatedTime = '~1 min',
  onEnter,
}: LandingCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="animate-fade-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {/* Floating card */}
      <div
        className="animate-float"
        style={{
          background: 'rgba(15,12,8,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(212,168,67,0.4)',
          padding: '48px 56px',
          maxWidth: 480,
          width: '90%',
          textAlign: 'center',
          clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, background: 'rgba(212,168,67,0.5)' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, background: 'rgba(212,168,67,0.5)' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 10, width: 8, height: 8, background: 'rgba(212,168,67,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 10, width: 8, height: 8, background: 'rgba(212,168,67,0.3)' }} />

        {/* Logo & Title */}
        <div style={{ marginBottom: 28 }}>
          <div className="pixel-font" style={{ fontSize: 9, color: 'rgba(212,168,67,0.7)', letterSpacing: '3px', marginBottom: 8 }}>
            {subtitle}
          </div>
          <div className="pixel-font" style={{ fontSize: 14, color: '#fff', letterSpacing: 2, lineHeight: 1.4 }}>
            {title}
          </div>
        </div>

        <div style={{ width: 48, height: 1.5, background: 'rgba(212,168,67,0.3)', margin: '0 auto 24px' }} />

        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, margin: '0 0 36px', fontFamily: 'Inter' }}>
          {description}
        </p>

        <button
          className="btn-primary"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onEnter}
          style={{ width: '100%', fontSize: 9 }}
        >
          {hovered ? 'LOADING WORLD…' : 'ENTER WORLD →'}
        </button>

        <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span>{totalQuestions} questions</span>
          <span style={{ width: 3, height: 3, background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
          <span>{estimatedTime}</span>
        </div>
      </div>

      {/* Ground shadow */}
      <div style={{
        width: '60%', height: 20,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
        marginTop: 8,
      }} />
    </div>
  )
}
