'use client'

import React from 'react'
import type { DepthIndicatorProps } from './types'

export function DepthIndicator({ current, total }: DepthIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-xs tracking-widest uppercase font-mono-nether"
        style={{ color: 'rgba(180, 100, 60, 0.8)' }}
      >
        DEPTH {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const idx = i + 1
          const isCompleted = idx < current
          const isCurrent = idx === current
          return (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: isCurrent ? 10 : 7,
                  height: isCurrent ? 10 : 7,
                  background: isCompleted
                    ? 'rgba(140, 30, 10, 0.8)'
                    : isCurrent
                    ? 'rgba(240, 100, 40, 1)'
                    : 'rgba(60, 15, 8, 0.8)',
                  border: isCurrent
                    ? '1px solid rgba(255, 140, 60, 0.6)'
                    : isCompleted
                    ? '1px solid rgba(120, 30, 10, 0.5)'
                    : '1px solid rgba(60, 20, 10, 0.4)',
                  animation: isCurrent ? 'progress-glow 2s ease-in-out infinite' : 'none',
                }}
              />
              {i < total - 1 && (
                <div
                  style={{
                    width: 16,
                    height: 1,
                    background: isCompleted ? 'rgba(160, 50, 20, 0.7)' : 'rgba(60, 15, 8, 0.5)',
                    transition: 'background 0.5s',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
