'use client'

import React from 'react'
import type { FestivalPassProps } from './types'

export const QR_PATTERN = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
]

export function FestivalPass({ data, passId, confirmed = false }: FestivalPassProps) {
  const { name = '', dept = '', year = '', interests = [] } = data || {}
  const firstName = name.split(' ')[0]?.toUpperCase() ?? ''
  const lastName = name.split(' ').slice(1).join(' ').toUpperCase() || ''

  return (
    <div className="festival-pass anim-pass" style={{ height: '100%' }}>
      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 2,
          height: '60%',
          background: 'linear-gradient(180deg, #00F0FF 0%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: 2,
          background: 'linear-gradient(270deg, #00F0FF 0%, transparent 100%)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <div className="font-anton-aura" style={{ fontSize: 28, color: '#00F0FF', letterSpacing: 3, lineHeight: 1 }}>
            AURA
          </div>
          <div className="font-anton-aura" style={{ fontSize: 14, color: 'rgba(245,240,232,0.4)', letterSpacing: 6, marginTop: 2 }}>
            2026
          </div>
        </div>
        <div
          className="font-mono-aura"
          style={{
            background: confirmed ? 'rgba(186,255,41,0.15)' : 'rgba(0,240,255,0.08)',
            border: `1px solid ${confirmed ? 'rgba(186,255,41,0.5)' : 'rgba(0,240,255,0.25)'}`,
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 9,
            letterSpacing: 2,
            color: confirmed ? '#BAFF29' : '#00F0FF',
          }}
        >
          {confirmed ? '✓ CONFIRMED' : 'FESTIVAL PASS'}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(0,240,255,0.4) 0%, transparent 80%)', marginBottom: 20 }} />

      {/* Attendee name */}
      <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.35)', marginBottom: 6 }}>
          ATTENDEE
        </div>
        {name ? (
          <div
            className="font-anton-aura"
            style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              color: '#F5F0E8',
              letterSpacing: 1,
              lineHeight: 1.1,
              transition: 'all 0.4s ease',
            }}
          >
            {firstName}
            {lastName && (
              <>
                <br />
                {lastName}
              </>
            )}
          </div>
        ) : (
          <div
            className="font-anton-aura"
            style={{
              fontSize: 24,
              color: 'rgba(245,240,232,0.12)',
              letterSpacing: 1,
            }}
          >
            YOUR NAME
          </div>
        )}
      </div>

      {/* Dept + Year */}
      <div style={{ display: 'flex', gap: 28, marginBottom: 20, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.35)', marginBottom: 4 }}>
            DEPT
          </div>
          <div
            className="font-anton-aura"
            style={{
              fontSize: 20,
              color: dept ? '#BAFF29' : 'rgba(245,240,232,0.12)',
              transition: 'color 0.35s ease',
              letterSpacing: 1,
            }}
          >
            {dept || '——'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.35)', marginBottom: 4 }}>
            YEAR
          </div>
          <div
            className="font-anton-aura"
            style={{
              fontSize: 20,
              color: year ? '#FF5C00' : 'rgba(245,240,232,0.12)',
              transition: 'color 0.35s ease',
              letterSpacing: 1,
            }}
          >
            {year ? (year.includes('YR') ? year : `${year} YR`) : '——'}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div style={{ minHeight: 48, position: 'relative', zIndex: 1, marginBottom: 20 }}>
        {interests && interests.length > 0 ? (
          <>
            <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.35)', marginBottom: 8 }}>
              INTERESTS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {interests.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: '#FF5C00',
                    background: 'rgba(255,92,0,0.12)',
                    border: '1px solid rgba(255,92,0,0.3)',
                    borderRadius: 3,
                    padding: '3px 7px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.12)' }}>
              INTERESTS TO APPEAR HERE
            </div>
          </div>
        )}
      </div>

      {/* QR / Barcode */}
      {confirmed && (
        <div style={{ marginBottom: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ background: '#F5F0E8', padding: 6, borderRadius: 4 }}>
              {QR_PATTERN.slice(0, 12).map((row, ri) => (
                <div key={ri} style={{ display: 'flex' }}>
                  {row.slice(0, 12).map((cell, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 4,
                        height: 4,
                        background: cell ? '#080B14' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div
                className="font-mono-aura"
                style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,232,0.3)', marginBottom: 4 }}
              >
                SCAN AT ENTRY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 6,
                      background: `rgba(0,240,255,${0.15 + (i % 3) * 0.12})`,
                      borderRadius: 1,
                      width: `${55 + (i % 4) * 10}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(245,240,232,0.07)', margin: '0 0 16px' }} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div className="font-mono-aura" style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(245,240,232,0.4)' }}>
          {passId}
        </div>
        <div style={{ fontSize: 9, color: 'rgba(245,240,232,0.25)', letterSpacing: 1 }}>
          15–17 FEB · CSJMU
        </div>
      </div>
    </div>
  )
}
