'use client'

import React, { useState } from 'react'
import {
  IconBlocks,
  IconGrid,
  IconList,
  IconTemplate,
  IconChart,
  IconInbox,
  IconPlus,
  IconSettings,
  IconHelp
} from './icons'
import { BlockSeparator } from './thumbnails'
import { NavItem } from './types'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'

export function NavBtn({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 16px 9px 20px',
        background: isActive
          ? 'linear-gradient(90deg, rgba(106,191,60,0.12) 0%, rgba(106,191,60,0.04) 100%)'
          : hov
          ? 'rgba(255,255,255,0.03)'
          : 'none',
        border: 'none',
        borderLeft: `2px solid ${isActive ? '#6abf3c' : 'transparent'}`,
        cursor: 'pointer',
        color: isActive ? '#a3e063' : hov ? '#c8d8b8' : '#6e7a8a',
        fontSize: 13.5,
        fontWeight: isActive ? 600 : 500,
        fontFamily: "'Outfit', sans-serif",
        textAlign: 'left',
        transition: 'color 0.12s, background 0.12s, border-color 0.12s',
        letterSpacing: '0.1px',
      }}
    >
      {/* Icon */}
      <span
        style={{
          flexShrink: 0,
          color: isActive ? '#6abf3c' : hov ? '#8b9ab0' : '#4e5a6a',
          transition: 'color 0.12s',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span style={{ flex: 1 }}>{item.label}</span>

      {/* Badge */}
      {item.badge !== undefined && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            backgroundColor: isActive ? 'rgba(106,191,60,0.2)' : '#1a2030',
            color: isActive ? '#6abf3c' : '#4e5a6a',
            borderRadius: 4,
            padding: '2px 6px',
            fontFamily: "'Outfit', sans-serif",
            border: `1px solid ${isActive ? 'rgba(106,191,60,0.25)' : '#21262d'}`,
            transition: 'all 0.12s',
          }}
        >
          {item.badge}
        </span>
      )}
    </button>
  )
}

export function Sidebar({
  active,
  onNav,
  onCreateForm,
  collapsed,
  onClose,
}: {
  active: string
  onNav: (id: string) => void
  onCreateForm: () => void
  collapsed: boolean
  onClose: () => void
}) {
  const [createHov, setCreateHov] = useState(false)

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          onClick={onClose}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(2px)',
            zIndex: 39,
          }}
          className="mobile-overlay"
        />
      )}

      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          backgroundColor: '#0b0f14',
          borderRight: '1px solid #1a2030',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '18px 20px 16px',
            borderBottom: '1px solid #1a2030',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {/* Pixel cube mark */}
          <svg width="26" height="26" viewBox="0 0 26 26" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
            <rect x="5" y="2" width="16" height="10" fill="#5D9E2F" />
            <rect x="5" y="2" width="16" height="3" fill="#7dd44a" />
            <rect x="5" y="2" width="3" height="10" fill="#4aaa32" />
            <rect x="2" y="10" width="12" height="14" fill="#3d7020" />
            <rect x="2" y="10" width="3" height="14" fill="#4e9c2e" />
            <rect x="14" y="10" width="10" height="14" fill="#2a5014" />
            <rect x="17" y="4" width="5" height="2" fill="#8B5A2B" opacity="0.9" />
            <rect x="19" y="4" width="2" height="5" fill="#6B3D1E" opacity="0.9" />
          </svg>

          <div>
            <div
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: 10,
                color: '#eceae4',
                letterSpacing: '-0.3px',
                lineHeight: 1.4,
              }}
            >
              Block<span style={{ color: '#6abf3c' }}>Form</span>
            </div>
          </div>
        </div>

        {/* ── Nav ──────────────────────────────────────────────────── */}
        <nav style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
          {/* ── WORKSPACE section ──────────────────────────────────── */}
          <div style={{ marginBottom: 2 }}>
            <div
              style={{
                padding: '10px 20px 5px',
                fontFamily: "'Press Start 2P'",
                fontSize: 6.5,
                color: '#2d3d2a',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Workspace
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: <IconGrid /> },
              { id: 'forms',     label: 'Forms',     icon: <IconList /> },
              { id: 'templates', label: 'Templates',  icon: <IconTemplate /> },
            ].map((item) => (
              <NavBtn
                key={item.id}
                item={item}
                isActive={active === item.id}
                onClick={() => onNav(item.id)}
              />
            ))}
          </div>

          {/* Block separator */}
          <BlockSeparator />

          {/* ── BUILD section ──────────────────────────────────────── */}
          <div style={{ marginBottom: 2 }}>
            <div
              style={{
                padding: '10px 20px 5px',
                fontFamily: "'Press Start 2P'",
                fontSize: 6.5,
                color: '#2d3d2a',
                letterSpacing: '2px',
              }}
            >
              Build
            </div>

            {/* Create Form — primary CTA style */}
            <div style={{ padding: '4px 12px 4px' }}>
              <button
                onClick={onCreateForm}
                onMouseEnter={() => setCreateHov(true)}
                onMouseLeave={() => setCreateHov(false)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 14px',
                  backgroundColor: createHov ? '#5aaa30' : '#4e9c2e',
                  border: '1px solid rgba(106,191,60,0.4)',
                  borderRadius: 7,
                  cursor: 'pointer',
                  color: '#eceae4',
                  fontSize: 13.5,
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.15s',
                  boxShadow: createHov
                    ? '0 4px 16px rgba(106,191,60,0.25)'
                    : '0 2px 8px rgba(106,191,60,0.12)',
                  letterSpacing: '0.1px',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <IconPlus />
                </span>
                Create Form
              </button>
            </div>

            {/* Theme Gallery */}
            <NavBtn
              item={{ id: 'themes', label: 'Theme Gallery', icon: <IconBlocks /> }}
              isActive={active === 'themes'}
              onClick={() => onNav('themes')}
            />
          </div>

          {/* Block separator */}
          <BlockSeparator />
        </nav>

        {/* ── User profile ─────────────────────────────────────────── */}
        <UserFooter />
      </aside>
    </>
  )
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function UserFooter() {
  const { user } = useGetLoggedInUserInfo()
  const [signingOut, setSigningOut] = useState(false)

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/trpc')
        .replace(/\/trpc\/?$/, '')
      await fetch(`${apiBase}/api/auth/signout`, {
        method: 'GET',
        credentials: 'include',
      })
    } catch {
      // network error — proceed anyway
    }
    // Hard redirect so Next.js router cache doesn't keep stale user data
    window.location.replace('/signin')
  }

  return (
    <div
      style={{
        borderTop: '1px solid #1a2030',
        padding: '14px 16px',
        flexShrink: 0,
        backgroundColor: '#090d11',
      }}
    >
      {/* User row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #5D9E2F 0%, #2a5014 100%)',
            border: '1.5px solid rgba(106,191,60,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            color: '#eceae4',
            flexShrink: 0,
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.5px',
          }}
        >
          {initials}
        </div>

        {/* Name + plan */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#c8d8b8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}
          >
            {user?.fullName ?? '—'}
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#4e5a6a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: 1,
            }}
          >
            {user?.email ?? ''}
          </div>
        </div>

        {/* Sign-out button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title="Sign out"
          style={{
            background: 'none',
            border: 'none',
            color: '#3d4d5d',
            cursor: signingOut ? 'not-allowed' : 'pointer',
            padding: 6,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'color 0.15s, background 0.15s',
            opacity: signingOut ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!signingOut) {
              ;(e.currentTarget as HTMLElement).style.color = '#ef4444'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)'
            }
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = '#3d4d5d'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }}
        >
          {signingOut ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
          ) : (
            <SignOutIcon />
          )}
        </button>
      </div>
    </div>
  )
}
