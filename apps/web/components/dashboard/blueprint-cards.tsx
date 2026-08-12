'use client'

import React, { useState } from 'react'

export const BLUEPRINTS = [
  { emoji: '🏫', name: 'College Registration', desc: 'Collect student info, preferences and consents.', accent: '#c9a84c' },
  { emoji: '🎤', name: 'Event Feedback', desc: 'Post-event satisfaction and NPS form.', accent: '#6abf3c' },
  { emoji: '📋', name: 'Customer Survey', desc: 'Understand what your customers really need.', accent: '#60a5fa' },
  { emoji: '🎮', name: 'Gaming Community', desc: 'Polls and surveys for your gaming squad.', accent: '#a78bfa' },
]

export function BlueprintCard({ bp }: { bp: (typeof BLUEPRINTS)[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#161b22',
        border: `1px solid ${hov ? bp.accent + '44' : '#21262d'}`,
        borderRadius: 10,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 9,
          backgroundColor: bp.accent + '14',
          border: `1px solid ${bp.accent}28`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}
      >
        {bp.emoji}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#eceae4', marginBottom: 5 }}>{bp.name}</div>
        <div style={{ fontSize: 12, color: '#4e5a6a', lineHeight: 1.55 }}>{bp.desc}</div>
      </div>
      <button
        style={{
          marginTop: 'auto',
          backgroundColor: hov ? bp.accent + '22' : 'transparent',
          border: `1px solid ${hov ? bp.accent + '55' : '#2d3741'}`,
          color: hov ? bp.accent : '#6e7a8a',
          borderRadius: 6,
          padding: '7px 14px',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Outfit', sans-serif",
          cursor: 'pointer',
          transition: 'all 0.2s',
          textAlign: 'center',
        }}
      >
        Use Blueprint →
      </button>
    </div>
  )
}
