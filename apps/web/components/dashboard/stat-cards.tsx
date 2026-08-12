'use client'

import React, { useState } from 'react'
import { IconTrend } from './icons'

export const STATS = [
  {
    label: 'Forms',
    value: '12',
    delta: '+2 this month',
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ imageRendering: 'pixelated' }}>
        <rect x="1" y="11" width="8" height="8" fill="#6abf3c" opacity="0.9" />
        <rect x="11" y="11" width="8" height="8" fill="#4e9c2e" opacity="0.8" />
        <rect x="6" y="3" width="8" height="8" fill="#7dd44a" opacity="0.85" />
      </svg>
    ),
    accent: '#6abf3c',
  },
  {
    label: 'Responses',
    value: '1,284',
    delta: '+142 this week',
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#60a5fa" strokeWidth="1.5">
        <rect x="2" y="4" width="16" height="12" rx="2" />
        <path d="M2 10h4l3 3 3-3h6" strokeLinecap="round" />
      </svg>
    ),
    accent: '#60a5fa',
  },
  {
    label: 'Completion',
    value: '72%',
    delta: '+5% vs last week',
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="2" width="16" height="16" fill="#4e5a6a" opacity="0.3" rx="2" />
        <path d="M5 10l4 4 7-7" stroke="#a78bfa" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    accent: '#a78bfa',
  },
  {
    label: 'Published',
    value: '8',
    delta: '4 drafts',
    positive: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#f59e0b" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 3v7l4 3" strokeLinecap="round" />
      </svg>
    ),
    accent: '#f59e0b',
  },
]

export function StatCard({ stat }: { stat: (typeof STATS)[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#161b22',
        border: `1px solid ${hov ? stat.accent + '44' : '#21262d'}`,
        borderRadius: 10,
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-2px)' : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#6e7a8a', fontWeight: 600 }}>{stat.label}</span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 7,
            backgroundColor: stat.accent + '14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stat.icon}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#eceae4',
            letterSpacing: '-1px',
            lineHeight: 1,
          }}
        >
          {stat.value}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: stat.positive === true ? '#6abf3c' : stat.positive === false ? '#dc2626' : '#4e5a6a',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {stat.positive === true && <IconTrend />}
          {stat.delta}
        </div>
      </div>
    </div>
  )
}
