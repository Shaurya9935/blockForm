'use client'

import React from 'react'

// Ghast — white boxy creature with tentacles, drifts slowly
export function Ghast({ x, y, scale = 1, delay = 0 }: { x: number; y: number; scale?: number; delay?: number }) {
  const s = scale
  return (
    <g
      style={{
        animation: `ghast-drift 8s ${delay}s ease-in-out infinite`,
        transformOrigin: `${x + 30 * s}px ${y + 35 * s}px`,
      }}
    >
      {/* Body — large white/light grey cube */}
      <rect x={x} y={y} width={60 * s} height={50 * s} fill="#d8d0c8" />
      <rect x={x} y={y} width={60 * s} height={4 * s} fill="#ede8e4" />
      <rect x={x} y={y} width={4 * s} height={50 * s} fill="#ede8e4" />
      <rect x={x + 56 * s} y={y} width={4 * s} height={50 * s} fill="#b8b0a8" />
      <rect x={x} y={y + 46 * s} width={60 * s} height={4 * s} fill="#b8b0a8" />
      {/* Inner shading pixels */}
      <rect x={x + 4 * s} y={y + 4 * s} width={52 * s} height={42 * s} fill="#ccc4bc" />
      {/* Face — two dark eyes */}
      <rect x={x + 14 * s} y={y + 16 * s} width={8 * s} height={8 * s} fill="#1a0808" />
      <rect x={x + 38 * s} y={y + 16 * s} width={8 * s} height={8 * s} fill="#1a0808" />
      {/* Mouth — frown */}
      <rect x={x + 18 * s} y={y + 30 * s} width={4 * s} height={4 * s} fill="#1a0808" />
      <rect x={x + 22 * s} y={y + 34 * s} width={16 * s} height={4 * s} fill="#1a0808" />
      <rect x={x + 38 * s} y={y + 30 * s} width={4 * s} height={4 * s} fill="#1a0808" />
      {/* Tentacles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const tx = x + (4 + i * 9) * s
        const baseY = y + 50 * s
        const len = (20 + (i % 3) * 10) * s
        return (
          <g key={i} style={{ animation: `tentacle-sway ${2 + i * 0.3}s ${i * 0.2}s ease-in-out infinite` }}>
            <rect x={tx} y={baseY} width={4 * s} height={len * 0.5} fill="#c8c0b8" />
            <rect x={tx} y={baseY + len * 0.5} width={4 * s} height={len * 0.3} fill="#b0a8a0" />
            <rect x={tx} y={baseY + len * 0.8} width={4 * s} height={len * 0.2} fill="#989090" />
          </g>
        )
      })}
    </g>
  )
}

// Piglin — beige pig-headed humanoid with gold sword
export function Piglin({ x, y, scale = 1, flipped = false }: { x: number; y: number; scale?: number; flipped?: boolean }) {
  const s = scale
  const flip = flipped ? `scale(-1,1) translate(${-(x * 2 + 32 * s)}px, 0)` : undefined
  return (
    <g transform={flip} style={{ animation: `piglin-idle 3s ease-in-out infinite` }}>
      {/* Head */}
      <rect x={x + 8 * s} y={y} width={24 * s} height={20 * s} fill="#c8a878" />
      <rect x={x + 8 * s} y={y} width={24 * s} height={2 * s} fill="#d8b888" />
      <rect x={x + 8 * s} y={y} width={2 * s} height={20 * s} fill="#d8b888" />
      <rect x={x + 30 * s} y={y} width={2 * s} height={20 * s} fill="#a08858" />
      {/* Snout */}
      <rect x={x + 12 * s} y={y + 12 * s} width={16 * s} height={8 * s} fill="#b89868" />
      {/* Nostrils */}
      <rect x={x + 14 * s} y={y + 14 * s} width={4 * s} height={4 * s} fill="#7a5030" />
      <rect x={x + 22 * s} y={y + 14 * s} width={4 * s} height={4 * s} fill="#7a5030" />
      {/* Eyes */}
      <rect x={x + 10 * s} y={y + 6 * s} width={4 * s} height={4 * s} fill="#e84020" />
      <rect x={x + 26 * s} y={y + 6 * s} width={4 * s} height={4 * s} fill="#e84020" />
      {/* Gold helmet accent */}
      <rect x={x + 8 * s} y={y} width={24 * s} height={4 * s} fill="#c8a800" />
      <rect x={x + 8 * s} y={y} width={4 * s} height={8 * s} fill="#c8a800" />
      <rect x={x + 28 * s} y={y} width={4 * s} height={8 * s} fill="#c8a800" />
      {/* Body */}
      <rect x={x + 6 * s} y={y + 20 * s} width={28 * s} height={20 * s} fill="#c8a878" />
      {/* Gold chestplate */}
      <rect x={x + 8 * s} y={y + 22 * s} width={24 * s} height={16 * s} fill="#b89800" />
      <rect x={x + 10 * s} y={y + 24 * s} width={20 * s} height={12 * s} fill="#c8a800" />
      {/* Arms */}
      <rect x={x} y={y + 20 * s} width={6 * s} height={16 * s} fill="#b89868" />
      <rect x={x + 34 * s} y={y + 20 * s} width={6 * s} height={16 * s} fill="#b89868" />
      {/* Legs */}
      <rect x={x + 8 * s} y={y + 40 * s} width={10 * s} height={16 * s} fill="#887048" />
      <rect x={x + 22 * s} y={y + 40 * s} width={10 * s} height={16 * s} fill="#887048" />
      {/* Gold sword in right hand */}
      <rect x={x + 40 * s} y={y + 18 * s} width={4 * s} height={24 * s} fill="#c8a800" />
      <rect x={x + 38 * s} y={y + 20 * s} width={8 * s} height={4 * s} fill="#a08800" />
      <rect x={x + 40 * s} y={y + 14 * s} width={4 * s} height={6 * s} fill="#e0c020" />
    </g>
  )
}

// Glowstone cluster — pixelated orange/yellow glowing blob
export function Glowstone({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const S = size * 8
  const cols = ['#f0a020', '#e88010', '#ffc040', '#d07010', '#f8b830']
  const grid = [
    [0, 1, 1, 1, 0],
    [1, 2, 4, 2, 1],
    [1, 4, 2, 4, 1],
    [1, 2, 4, 2, 1],
    [0, 1, 3, 1, 0],
  ]
  return (
    <g style={{ animation: `glowstone-pulse 2.5s ease-in-out infinite`, filter: `drop-shadow(0 0 ${6 * size}px rgba(255,160,30,0.8))` }}>
      {grid.map((row, ry) =>
        row.map((c, cx) =>
          c > 0 ? (
            <rect
              key={`${ry}-${cx}`}
              x={x + cx * S}
              y={y + ry * S}
              width={S}
              height={S}
              fill={cols[c - 1]}
            />
          ) : null
        )
      )}
    </g>
  )
}

// Quartz block — white/off-white layered block
export function QuartzBlock({ x, y, w = 24, h = 24 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#e8e4e0" />
      <rect x={x} y={y} width={w} height={3} fill="#f4f0ec" />
      <rect x={x} y={y} width={3} height={h} fill="#f4f0ec" />
      <rect x={x + w - 3} y={y} width={3} height={h} fill="#c8c4c0" />
      <rect x={x} y={y + h - 3} width={w} height={3} fill="#c8c4c0" />
      {/* Vein lines */}
      <rect x={x + 6} y={y + 2} width={2} height={h - 4} fill="rgba(180,176,172,0.6)" />
      <rect x={x + 14} y={y + 2} width={2} height={h - 4} fill="rgba(180,176,172,0.6)" />
    </g>
  )
}

// Netherrack block — dark red pitted block
export function NetherrackBlock({ x, y, w = 24, h = 24 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#5a1010" />
      <rect x={x} y={y} width={w} height={2} fill="#6a1a1a" />
      <rect x={x} y={y} width={2} height={h} fill="#6a1a1a" />
      <rect x={x + w - 2} y={y} width={2} height={h} fill="#3a0808" />
      <rect x={x} y={y + h - 2} width={w} height={2} fill="#3a0808" />
      {/* Pits */}
      <rect x={x + 5} y={y + 5} width={4} height={3} fill="#2a0404" />
      <rect x={x + 14} y={y + 10} width={3} height={4} fill="#2a0404" />
      <rect x={x + 8} y={y + 16} width={4} height={3} fill="#2a0404" />
    </g>
  )
}

// Nether brick wall segment
export function NetherBrickWall({ x, y, cols: c = 4, rows: r = 3 }: { x: number; y: number; cols?: number; rows?: number }) {
  const BW = 20
  const BH = 10
  return (
    <g>
      {Array.from({ length: r }, (_, row) =>
        Array.from({ length: c }, (_, col) => {
          const offset = row % 2 === 0 ? 0 : BW / 2
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={x + col * (BW + 2) + offset}
                y={y + row * (BH + 2)}
                width={BW}
                height={BH}
                fill="#2d1010"
              />
              <rect
                x={x + col * (BW + 2) + offset}
                y={y + row * (BH + 2)}
                width={BW}
                height={2}
                fill="#3d1818"
              />
              <rect
                x={x + col * (BW + 2) + offset}
                y={y + row * (BH + 2)}
                width={2}
                height={BH}
                fill="#3d1818"
              />
              <rect
                x={x + col * (BW + 2) + offset + BW - 2}
                y={y + row * (BH + 2)}
                width={2}
                height={BH}
                fill="#1a0808"
              />
            </g>
          )
        })
      )}
    </g>
  )
}

// Nether Portal — purple swirling frame
export function NetherPortal({ x, y, w = 60, h = 100 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      {/* Obsidian frame */}
      <rect x={x} y={y} width={w} height={h} fill="#180820" />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} fill="transparent" />
      {/* Portal swirl inside */}
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} fill="#4020a0" opacity="0.7" style={{ animation: 'portal-swirl 3s ease-in-out infinite' }} />
      <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} fill="#6030c0" opacity="0.5" style={{ animation: 'portal-swirl 2s 0.5s ease-in-out infinite reverse' }} />
      <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} fill="#8050e0" opacity="0.4" style={{ animation: 'portal-swirl 4s 1s ease-in-out infinite' }} />
      {/* Obsidian block details */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x} y={y + i * (h / 4)} width={8} height={h / 4 - 2} fill="#200a30" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + w - 8} y={y + i * (h / 4)} width={8} height={h / 4 - 2} fill="#200a30" />
      ))}
      {/* Glow */}
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} fill="none" style={{ filter: 'drop-shadow(0 0 12px rgba(130, 60, 240, 0.8))' }} />
    </g>
  )
}

// Hanging crimson vines
export function CrimsonVines({ x, y, count = 5 }: { x: number; y: number; count?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const vx = x + i * 14
        const len = 20 + (i * 17) % 50
        const hue = i % 2 === 0 ? '#8b1020' : '#a01828'
        return (
          <g key={i} style={{ animation: `vine-sway ${3 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }}>
            <rect x={vx} y={y} width={4} height={len * 0.4} fill={hue} />
            <rect x={vx} y={y + len * 0.4} width={4} height={len * 0.3} fill="#6a0c18" />
            <rect x={vx} y={y + len * 0.7} width={4} height={len * 0.3} fill="#500a14" />
            {/* Leaf nubs */}
            <rect x={vx - 4} y={y + len * 0.3} width={4} height={6} fill="#8b1020" />
            <rect x={vx + 4} y={y + len * 0.6} width={4} height={6} fill="#8b1020" />
          </g>
        )
      })}
    </g>
  )
}

// Teal lantern
export function NetherLantern({ x, y }: { x: number; y: number }) {
  return (
    <g style={{ filter: 'drop-shadow(0 0 8px rgba(40, 200, 180, 0.7))' }}>
      {/* Chain */}
      <rect x={x + 4} y={y - 12} width={2} height={12} fill="#606060" />
      {/* Body */}
      <rect x={x} y={y} width={10} height={12} fill="#204848" />
      <rect x={x + 1} y={y + 1} width={8} height={10} fill="#30a898" opacity="0.9" />
      <rect x={x} y={y} width={10} height={2} fill="#406868" />
      <rect x={x} y={y + 10} width={10} height={2} fill="#182e2e" />
    </g>
  )
}

// Ember particles
export function Embers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 22 }, (_, i) => {
        const left = 3 + (i * 29 + 13) % 94
        const delay = (i * 0.65) % 7
        const duration = 4 + (i * 0.35) % 4
        const size = 2 + (i * 0.25) % 3
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: `${4 + (i * 9) % 22}%`,
              width: size,
              height: size,
              background:
                i % 4 === 0
                  ? 'rgba(255, 130, 40, 0.95)'
                  : i % 4 === 1
                  ? 'rgba(255, 60, 20, 0.85)'
                  : i % 4 === 2
                  ? 'rgba(255, 200, 60, 0.8)'
                  : 'rgba(220, 80, 20, 0.7)',
              animation: `ember-float ${duration}s ${delay}s ease-in infinite`,
            }}
          />
        )
      })}
    </div>
  )
}
