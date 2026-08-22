'use client'

import React, { useState, useEffect } from 'react'
import type { SuccessScreenProps } from './types'
import { FestivalPass } from './festival-pass'
import { BgDecor } from './bg-decor'

export function SuccessScreen({
  title = "YOU'RE IN.",
  subtitle = 'Your registration has been confirmed.',
  formData,
  passId,
  onReset,
}: SuccessScreenProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleShare = () => {
    const text = `I got my pass! 🎉 Pass ID: ${passId} · Verified Access`
    if (navigator.share) {
      navigator.share({ text })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div
      className="grain"
      style={{
        minHeight: '100vh',
        background: '#080B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 24 : 48,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BgDecor step={7} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560 }}>
        {/* Title */}
        <div
          className="anim-fade-up font-anton-aura"
          style={{
            fontSize: isMobile ? 64 : 96,
            color: '#BAFF29',
            letterSpacing: -2,
            lineHeight: 0.9,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          className="anim-fade-up delay-1"
          style={{
            fontSize: 16,
            color: 'rgba(245,240,232,0.5)',
            marginBottom: 40,
            letterSpacing: 0.5,
          }}
        >
          {subtitle}
        </div>

        {/* Confirmed pass */}
        <div className="anim-pass delay-2" style={{ marginBottom: 32 }}>
          <FestivalPass data={formData} passId={passId} confirmed />
        </div>

        {/* Confirmation line */}
        <div
          className="anim-fade-up delay-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(186,255,41,0.15)',
              border: '1px solid #BAFF29',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <polyline
                points="2,6 5,9 10,3"
                stroke="#BAFF29"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 13, color: '#BAFF29', letterSpacing: 1 }}>
            Registration confirmed · {passId}
          </span>
        </div>

        {/* Actions */}
        <div className="anim-fade-up delay-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="ghost-btn" onClick={handleShare}>
            Share ↗
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              if (onReset) onReset()
              else window.location.reload()
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}

