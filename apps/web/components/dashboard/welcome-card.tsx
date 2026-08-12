'use client'

import React from 'react'
import { HeroLandscape } from './thumbnails'
import { IconPlus } from './icons'

export function WelcomeCard({ onCreateForm }: { onCreateForm: () => void }) {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#161b22',
        border: '1px solid #21262d',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 180,
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(106,191,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(106,191,60,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Text content */}
      <div style={{ flex: 1, padding: '32px 32px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(106,191,60,0.1)',
            border: '1px solid rgba(106,191,60,0.2)',
            borderRadius: 100,
            padding: '4px 12px',
            marginBottom: 16,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: 1, backgroundColor: '#6abf3c', imageRendering: 'pixelated' }} />
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: '#6abf3c', letterSpacing: '0.5px' }}>
            WORKSPACE
          </span>
        </div>

        <h1
          style={{
            margin: '0 0 10px',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.7px',
            color: '#eceae4',
            lineHeight: 1.15,
          }}
        >
          Your world is waiting.
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6e7a8a', lineHeight: 1.65, maxWidth: 400 }}>
          Build forms, collect responses, and turn ideas into experiences — block by block.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onCreateForm}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 7,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(106,191,60,0.25)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = '#7dd44a'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = '#6abf3c'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            <IconPlus />
            Create Form
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              color: '#8b9ab0',
              border: '1px solid #2d3741',
              borderRadius: 7,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#4d6070'
              ;(e.currentTarget as HTMLElement).style.color = '#eceae4'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2d3741'
              ;(e.currentTarget as HTMLElement).style.color = '#8b9ab0'
            }}
          >
            Explore Templates
          </button>
        </div>
      </div>

      {/* Landscape illustration */}
      <div
        className="hero-landscape"
        style={{ flex: '0 0 320px', position: 'relative', overflow: 'hidden' }}
      >
        <HeroLandscape />
        {/* Left fade */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: 'linear-gradient(to right, #161b22, transparent)',
          }}
        />
      </div>
    </div>
  )
}
