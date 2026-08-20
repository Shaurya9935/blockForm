'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { SuccessScreenProps } from './types'

export function SuccessScreen({
  title = 'Thanks for your response!',
  message = 'Your response has been successfully submitted.\nSee you at College Fest 2026!',
  onReset,
}: SuccessScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect()
    canvas.width = rect.width || window.innerWidth
    canvas.height = rect.height || window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      life: number
      maxLife: number
    }> = []

    const colors = ['#d4a843', '#f0c850', '#5a8a3c', '#7ab84e', '#87ceeb', '#fff5cc']

    // Spawn particles
    const spawn = () => {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 300,
          y: canvas.height / 2 + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 5 - 1,
          color: colors[Math.floor(Math.random() * colors.length)] ?? '#d4a843',
          size: Math.random() * 8 + 4,
          life: 0,
          maxLife: 80 + Math.random() * 60,
        })
      }
    }
    spawn()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08
        p.vx *= 0.99

        const alpha = 1 - p.life / p.maxLife
        if (alpha <= 0) {
          particles.splice(i, 1)
          return
        }

        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      })

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const handleReturnHome = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.reload()
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Sky */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e8c87a 0%, #c49050 40%, #8b5c2a 70%, #1e1e1e 100%)', zIndex: 0 }} />

      {/* Particles canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

      {/* Content */}
      {show && (
        <div className="animate-celebration" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          {/* Portal / structure visual */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32, alignItems: 'flex-end' }}>
            {[40, 56, 72, 88, 72, 56, 40].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: h,
                  background:
                    i === 3
                      ? 'linear-gradient(180deg, #f0c850 0%, #d4a843 100%)'
                      : i === 0 || i === 6
                      ? '#5a8a3c'
                      : i === 1 || i === 5
                      ? '#7ab84e'
                      : '#9aaa5a',
                  clipPath: 'polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)',
                  boxShadow: i === 3 ? '0 0 20px rgba(240,200,80,0.6)' : 'none',
                  animation: `overworld-blockBuild 0.4s ease ${i * 0.06}s both`,
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>

          {/* Card */}
          <div
            style={{
              background: 'rgba(10,8,6,0.88)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(212,168,67,0.5)',
              padding: '40px 44px',
              clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,67,0.15)',
            }}
          >
            <div className="pixel-font" style={{ fontSize: 14, color: '#d4a843', letterSpacing: 2, marginBottom: 16, lineHeight: 1.5 }}>
              ✨ BUILD<br />COMPLETE
            </div>

            <div style={{ width: 60, height: 1.5, background: 'rgba(212,168,67,0.3)', margin: '0 auto 20px' }} />

            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 10px', fontFamily: 'Inter' }}>
              {title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, margin: '0 0 28px', fontFamily: 'Inter', whiteSpace: 'pre-line' }}>
              {message}
            </p>

            {/* Full progress bar */}
            <div style={{ display: 'flex', gap: 5, marginBottom: 28, justifyContent: 'center' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 14,
                    background: 'var(--gold)',
                    clipPath: 'polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)',
                    animation: `overworld-blockBuild 0.3s ease ${i * 0.08}s both`,
                    transformOrigin: 'bottom center',
                    boxShadow: '0 2px 8px rgba(212,168,67,0.4)',
                  }}
                />
              ))}
            </div>

            <button
              className="btn-ghost"
              onClick={handleReturnHome}
              style={{ width: '100%', padding: '12px', fontSize: 13 }}
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
