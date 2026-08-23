'use client'

import React from 'react'

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#b0bec5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#b0bec5">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export function OAuthButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#161b22] border border-[#21262d] rounded-lg text-[#b0bec5] text-[13px] font-semibold font-['Outfit'] cursor-pointer transition-colors duration-150 hover:bg-[#1f2630] hover:border-[#3d4d5d]"
    >
      {icon}
      {label}
    </button>
  )
}

function getApiBaseUrl(): string {
  // Strip the /trpc suffix if present (NEXT_PUBLIC_API_URL may point at /trpc)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/trpc'
  return apiUrl.replace(/\/trpc\/?$/, '')
}

export function OAuthGroup() {
  const [showToast, setShowToast] = React.useState(false)
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleComingSoon = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setShowToast(true)
    toastTimer.current = setTimeout(() => setShowToast(false), 2500)
  }

  const handleGitHubSignIn = () => {
    const baseUrl = getApiBaseUrl()
    window.location.href = `${baseUrl}/api/auth/github`
  }

  return (
    <div className="relative flex flex-col gap-2">
      {/* Coming Soon Toast */}
      <div
        style={{
          position: 'absolute',
          top: '-54px',
          left: '50%',
          transform: `translateX(-50%) translateY(${showToast ? '0' : '6px'})`,
          opacity: showToast ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          whiteSpace: 'nowrap',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 13px',
            background: 'linear-gradient(135deg, #1a2030 0%, #161b22 100%)',
            border: '1px solid rgba(106,191,60,0.3)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(106,191,60,0.08)',
          }}
        >
          {/* Pixel icon */}
          <svg width="8" height="8" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
            <rect x="0" y="0" width="4" height="4" fill="#6abf3c" />
            <rect x="4" y="4" width="4" height="4" fill="#4e9c2e" />
            <rect x="4" y="0" width="4" height="4" fill="#3d7020" />
            <rect x="0" y="4" width="4" height="4" fill="#5aad32" />
          </svg>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#6abf3c', letterSpacing: '0.08em' }}>
            COMING SOON
          </span>
          {/* Caret */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid rgba(106,191,60,0.3)',
            }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <OAuthButton label="Google" icon={<GoogleIcon />} onClick={handleComingSoon} />
        <OAuthButton label="GitHub" icon={<GitHubIcon />} onClick={handleGitHubSignIn} />
        <OAuthButton label="Apple" icon={<AppleIcon />} onClick={handleComingSoon} />
      </div>
    </div>
  )
}

