'use client'

import React, { useState } from 'react'
import { Form } from './types'
import { ThumbCollege, ThumbEvent, ThumbStartup, ThumbGaming } from './thumbnails'
import { IconDots } from './icons'

export const FORMS: Form[] = [
  {
    id: '1',
    name: 'College Fest Registration',
    desc: 'Registration form for the annual college festival.',
    status: 'published',
    responses: 438,
    edited: '2 hours ago',
    theme: 'college',
  },
  {
    id: '2',
    name: 'Event Feedback Survey',
    desc: 'Post-event satisfaction form for attendees.',
    status: 'published',
    responses: 284,
    edited: 'Yesterday',
    theme: 'event',
  },
  {
    id: '3',
    name: 'Startup Survey',
    desc: 'Collect feedback from potential early users.',
    status: 'published',
    responses: 127,
    edited: '3 days ago',
    theme: 'startup',
  },
  {
    id: '4',
    name: 'Gaming Community Survey',
    desc: 'Find out what games your community wants to play.',
    status: 'draft',
    responses: 0,
    edited: '5 days ago',
    theme: 'gaming',
  },
]

const THEMES: ('college' | 'event' | 'startup' | 'gaming')[] = ['college', 'event', 'startup', 'gaming']

const THUMB_MAP = {
  college: <ThumbCollege />,
  event: <ThumbEvent />,
  startup: <ThumbStartup />,
  gaming: <ThumbGaming />,
}

function formatEditedTime(date?: Date | string | null, fallback?: string) {
  if (fallback) return fallback
  if (!date) return 'Recently'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

export interface FormCardProps {
  form: {
    id: string
    title?: string
    name?: string
    description?: string | null
    desc?: string
    status?: 'published' | 'draft'
    responses?: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    edited?: string
    theme?: 'college' | 'event' | 'startup' | 'gaming'
  }
  index?: number
}

export function FormCard({ form, index = 0 }: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hov, setHov] = useState(false)

  const themeKey = (form.theme || THEMES[index % THEMES.length]) as keyof typeof THUMB_MAP
  const title = form.title || form.name || 'Untitled Form'
  const description = form.description || form.desc || 'No description provided.'
  const status = form.status || 'published'
  const responses = form.responses ?? 0
  const editedText = formatEditedTime(form.updatedAt || form.createdAt, form.edited)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false)
        setMenuOpen(false)
      }}
      style={{
        backgroundColor: '#161b22',
        border: `1px solid ${hov ? '#2d3741' : '#21262d'}`,
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 12px 32px rgba(0,0,0,0.3)' : 'none',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 112, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {THUMB_MAP[themeKey]}
        {/* Status badge */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 100,
              backgroundColor: status === 'published' ? 'rgba(106,191,60,0.15)' : 'rgba(110,122,138,0.2)',
              color: status === 'published' ? '#6abf3c' : '#6e7a8a',
              border: `1px solid ${status === 'published' ? 'rgba(106,191,60,0.3)' : 'rgba(110,122,138,0.2)'}`,
              backdropFilter: 'blur(4px)',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: 1,
                backgroundColor: status === 'published' ? '#6abf3c' : '#6e7a8a',
                display: 'inline-block',
                imageRendering: 'pixelated',
              }}
            />
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Three-dot menu */}
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: 'rgba(13,17,23,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(4px)',
              color: '#b0bec5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}
          >
            <IconDots />
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 32,
                right: 0,
                backgroundColor: '#1f2630',
                border: '1px solid #2d3741',
                borderRadius: 8,
                padding: '4px 0',
                minWidth: 140,
                zIndex: 20,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {['Open', 'Edit', 'Responses', 'Analytics', 'Duplicate', 'Delete'].map((action) => (
                <button
                  key={action}
                  style={{
                    width: '100%',
                    padding: '7px 14px',
                    background: 'none',
                    border: 'none',
                    color: action === 'Delete' ? '#dc2626' : '#b0bec5',
                    fontSize: 13,
                    fontFamily: "'Outfit', sans-serif",
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = '#2d3741'
                    if (action !== 'Delete') (e.currentTarget as HTMLElement).style.color = '#eceae4'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = action === 'Delete' ? '#dc2626' : '#b0bec5'
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#eceae4', marginBottom: 4, lineHeight: 1.3 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: '#4e5a6a', lineHeight: 1.5 }}>{description}</div>
        </div>

        {/* Meta */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: '#6e7a8a', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
              <rect x="1" y="2" width="8" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="3" y="4" width="4" height="1" fill="currentColor" />
              <rect x="3" y="6" width="3" height="1" fill="currentColor" />
            </svg>
            {status === 'published' && responses > 0 ? `${responses.toLocaleString()} responses` : 'No responses yet'}
          </div>
          <div style={{ fontSize: 11, color: '#4e5a6a' }}>Edited {editedText}</div>
        </div>

        {/* Quick actions */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            opacity: hov ? 1 : 0,
            transform: hov ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        >
          {['Open', 'Edit', 'Responses'].map((a, i) => (
            <button
              key={a}
              style={{
                flex: 1,
                padding: '5px 0',
                backgroundColor: i === 0 ? '#6abf3c' : '#1f2630',
                color: i === 0 ? '#0d1117' : '#8b9ab0',
                border: i === 0 ? 'none' : '1px solid #2d3741',
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EmptyForms({ onCreateForm }: { onCreateForm: () => void }) {
  return (
    <div
      style={{
        border: '1px dashed #21262d',
        borderRadius: 10,
        padding: '56px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16,
      }}
    >
      {/* Small block scene */}
      <svg width="80" height="60" viewBox="0 0 80 60" style={{ imageRendering: 'pixelated' }}>
        <rect x="32" y="44" width="16" height="10" fill="#3d7a22" opacity="0.5" />
        <rect x="24" y="36" width="16" height="10" fill="#888" opacity="0.4" />
        <rect x="40" y="30" width="16" height="10" fill="#5D9E2F" opacity="0.5" />
        <rect x="8" y="48" width="12" height="12" fill="#888" opacity="0.25" style={{ outline: '1px dashed #2d3741' }} />
        <rect x="60" y="42" width="12" height="12" fill="#888" opacity="0.25" style={{ outline: '1px dashed #2d3741' }} />
        <rect x="48" y="50" width="10" height="10" fill="#888" opacity="0.15" style={{ outline: '1px dashed #2d3741' }} />
      </svg>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>Your world is empty.</div>
        <p style={{ margin: 0, fontSize: 13, color: '#4e5a6a', lineHeight: 1.6, maxWidth: 320 }}>
          Start with a blank form or choose a blueprint to build your first experience.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCreateForm}
          style={{
            backgroundColor: '#6abf3c',
            color: '#0d1117',
            border: 'none',
            borderRadius: 7,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
          }}
        >
          Create Blank Form
        </button>
        <button
          style={{
            backgroundColor: 'transparent',
            color: '#8b9ab0',
            border: '1px solid #2d3741',
            borderRadius: 7,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
          }}
        >
          Explore Templates
        </button>
      </div>
    </div>
  )
}
