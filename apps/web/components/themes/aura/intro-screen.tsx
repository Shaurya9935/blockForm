'use client'

import React, { useState, useEffect } from 'react'
import type { IntroScreenProps } from './types'
import { BgDecor } from './bg-decor'

export function IntroScreen({
  yearBadge = 'OFFICIAL EVENT PASS',
  title = 'AURA',
  tagline = 'Your Event. Your Pass. Your Moment.',
  dateSticker = 'PASS REQUIRED · 2026',
  footerNote = 'OFFICIAL ACCESS PASS · VERIFIED',
  onEnter,
}: IntroScreenProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      className="grain"
      style={{
        minHeight: '100vh',
        background: '#080B14',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BgDecor step={0} />

      {/* Floating geometric shapes */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: 180,
          height: 180,
          border: '1px solid rgba(0,240,255,0.12)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '12%',
          width: 100,
          height: 100,
          border: '1px solid rgba(255,92,0,0.1)',
          transform: 'rotate(45deg)',
          animation: 'float 8s ease-in-out infinite 1s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 60,
          height: 60,
          background: 'rgba(186,255,41,0.06)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite 0.5s',
        }}
      />

      {/* Sticker: date / access badge */}
      <div
        className="anim-fade-up delay-1 font-anton-aura"
        style={{
          position: 'absolute',
          top: 32,
          right: 32,
          background: '#FF5C00',
          color: '#080B14',
          fontSize: 11,
          letterSpacing: 3,
          padding: '6px 14px',
          borderRadius: 2,
          transform: 'rotate(2deg)',
          zIndex: 10,
        }}
      >
        {dateSticker}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '60px 24px 120px' : '80px 72px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Year / Event badge */}
        <div
          className="anim-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            width: 'fit-content',
          }}
        >
          <div style={{ width: 32, height: 1, background: '#00F0FF' }} />
          <span
            className="font-mono-aura"
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: '#00F0FF',
              textTransform: 'uppercase',
            }}
          >
            {yearBadge}
          </span>
        </div>

        {/* Hero title */}
        <div className="anim-fade-up delay-1">
          <div
            className="font-anton-aura"
            style={{
              fontSize: isMobile ? 'clamp(72px, 22vw, 120px)' : 'clamp(100px, 14vw, 180px)',
              color: '#F5F0E8',
              letterSpacing: isMobile ? -2 : -4,
              lineHeight: 0.9,
              marginBottom: 0,
            }}
          >
            {title}
          </div>
          <div
            className="font-anton-aura"
            style={{
              fontSize: isMobile ? 'clamp(48px, 15vw, 80px)' : 'clamp(64px, 9vw, 120px)',
              color: '#00F0FF',
              letterSpacing: isMobile ? -1 : -3,
              lineHeight: 0.9,
              marginBottom: 32,
              WebkitTextStroke: isMobile ? '1px #00F0FF' : '2px #00F0FF',
              WebkitTextFillColor: 'transparent',
            }}
          >
            2026
          </div>
        </div>

        {/* Tagline */}
        <div className="anim-fade-up delay-2" style={{ marginBottom: 48 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: isMobile ? 14 : 17,
              letterSpacing: 3,
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.8,
              textTransform: 'uppercase',
            }}
          >
            {tagline}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(245,240,232,0.35)',
              marginTop: 12,
              letterSpacing: 0.5,
            }}
          >
            Registration takes less than 2 minutes.
          </div>
        </div>

        {/* CTA */}
        <div className="anim-fade-up delay-3">
          <button
            type="button"
            className="cta-btn"
            onClick={onEnter}
            style={{ fontSize: isMobile ? 16 : 18 }}
          >
            GET YOUR PASS
            <span style={{ fontSize: 20 }}>→</span>
          </button>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,240,255,0.04)',
          borderTop: '1px solid rgba(0,240,255,0.1)',
          padding: '12px 72px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <div className="font-mono-aura" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.25)' }}>
          BLOCKFORM × {title}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.2)', letterSpacing: 1 }}>
          {footerNote}
        </div>
      </div>
    </div>
  )
}

