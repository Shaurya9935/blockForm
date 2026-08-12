'use client'

import React, { useState } from 'react'
import { IconSearch, IconBell } from './icons'

export function Header({
  onMenuToggle,
  onCreateForm,
}: {
  onMenuToggle: () => void
  onCreateForm: () => void
}) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: 'rgba(13,17,23,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #21262d',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 60,
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#6e7a8a',
          cursor: 'pointer',
          padding: 4,
          flexShrink: 0,
        }}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect y="3" width="20" height="2.5" rx="1" />
          <rect y="9" width="20" height="2.5" rx="1" />
          <rect y="15" width="20" height="2.5" rx="1" />
        </svg>
      </button>

      {/* Greeting */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#eceae4', lineHeight: 1.2 }}>
          Good morning, Shaurya 👋
        </div>
        <div style={{ fontSize: 12, color: '#4e5a6a', marginTop: 1 }}>
          Ready to build something?
        </div>
      </div>

      {/* Search */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flex: '0 0 220px',
        }}
        className="search-bar"
      >
        <div style={{ position: 'absolute', left: 10, color: '#4e5a6a' }}>
          <IconSearch />
        </div>
        <input
          placeholder="Search forms…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: '100%',
            padding: '7px 12px 7px 34px',
            backgroundColor: '#161b22',
            border: `1px solid ${searchFocused ? '#6abf3c' : '#21262d'}`,
            borderRadius: 7,
            fontSize: 13,
            color: '#eceae4',
            fontFamily: "'Outfit', sans-serif",
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />
      </div>

      {/* Notifications */}
      <button
        style={{
          position: 'relative',
          background: 'none',
          border: '1px solid #21262d',
          borderRadius: 7,
          padding: '7px 8px',
          color: '#6e7a8a',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#3d4d5d'
          ;(e.currentTarget as HTMLElement).style.color = '#eceae4'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#21262d'
          ;(e.currentTarget as HTMLElement).style.color = '#6e7a8a'
        }}
      >
        <IconBell />
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            borderRadius: 2,
            backgroundColor: '#6abf3c',
            border: '1.5px solid #0d1117',
          }}
        />
      </button>

      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #6abf3c, #3d7020)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
          color: '#0d1117',
          cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
          flexShrink: 0,
        }}
      >
        SG
      </div>
    </header>
  )
}
