import React from 'react'

export const ACTIVITIES = [
  { icon: '📨', text: 'College Fest Registration received 24 new responses.', time: '2 min ago', accent: '#6abf3c' },
  { icon: '🚀', text: 'Event Feedback was published.', time: '1 hour ago', accent: '#60a5fa' },
  { icon: '✏️', text: 'You edited Startup Survey.', time: '3 hours ago', accent: '#f59e0b' },
  { icon: '🏆', text: 'Gaming Community Survey reached 100 responses.', time: 'Yesterday', accent: '#a78bfa' },
  { icon: '📋', text: 'College Fest Registration was duplicated.', time: '2 days ago', accent: '#6e7a8a' },
]

export function ActivityFeed() {
  return (
    <div
      style={{
        backgroundColor: '#161b22',
        border: '1px solid #21262d',
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #21262d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: '#eceae4' }}>Recent Activity</span>
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: '#2d3741' }}>LIVE</span>
      </div>

      {/* Items */}
      <div>
        {ACTIVITIES.map((a, i) => (
          <div
            key={i}
            style={{
              padding: '13px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              borderBottom: i < ACTIVITIES.length - 1 ? '1px solid #1a2030' : 'none',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#1a2030')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            {/* Pixel-ish icon container */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                backgroundColor: a.accent + '14',
                border: `1px solid ${a.accent}28`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {a.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#b0bec5', lineHeight: 1.5 }}>{a.text}</div>
              <div style={{ fontSize: 11, color: '#2d3741', marginTop: 3 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
