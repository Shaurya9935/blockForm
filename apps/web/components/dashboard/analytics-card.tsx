'use client'

import React from 'react'
import { IconTrend } from './icons'
import { ResponseChart } from './thumbnails'

export function AnalyticsCard() {
  return (
    <div
      style={{
        backgroundColor: '#161b22',
        border: '1px solid #21262d',
        borderRadius: 10,
        overflow: 'hidden',
        flex: '0 0 300px',
      }}
      className="analytics-card"
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #21262d',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: '#eceae4', marginBottom: 2 }}>Response Overview</div>
        <div style={{ fontSize: 11, color: '#4e5a6a' }}>Last 15 days</div>
      </div>

      <div style={{ padding: '20px 20px 16px' }}>
        {/* Numbers */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#eceae4', letterSpacing: '-1px', lineHeight: 1 }}>
            1,284
          </div>
          <div
            style={{
              marginTop: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              color: '#6abf3c',
              fontWeight: 600,
            }}
          >
            <IconTrend />
            +18.4% this week
          </div>
        </div>

        {/* Chart */}
        <div style={{ marginBottom: 16 }}>
          <ResponseChart />
        </div>

        {/* Mini breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'College Fest', value: 438, color: '#c9a84c', pct: 34 },
            { label: 'Event Feedback', value: 284, color: '#6abf3c', pct: 22 },
            { label: 'Startup Survey', value: 562, color: '#60a5fa', pct: 44 },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#6e7a8a' }}>{item.label}</span>
                <span style={{ fontSize: 11, color: '#8b9ab0', fontWeight: 600 }}>{item.value}</span>
              </div>
              <div style={{ height: 3, backgroundColor: '#1f2630', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.pct}%`,
                    backgroundColor: item.color,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            marginTop: 16,
            width: '100%',
            padding: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #21262d',
            borderRadius: 6,
            color: '#6abf3c',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(106,191,60,0.06)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(106,191,60,0.3)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#21262d'
          }}
        >
          View Full Analytics →
        </button>
      </div>
    </div>
  )
}
