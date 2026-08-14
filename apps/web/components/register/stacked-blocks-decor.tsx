'use client'

import React from 'react'

export function StackedBlocksDecor() {
  return (
    <div className="flex flex-col gap-0.5 items-end opacity-45">
      {[
        { w: 10, color: '#6abf3c', shadow: '#3d7020' },
        { w: 14, color: '#888', shadow: '#555' },
        { w: 10, color: '#6B4423', shadow: '#4a2d16' },
        { w: 12, color: '#5D9E2F', shadow: '#3d7020' },
        { w: 8, color: '#888', shadow: '#555' },
      ].map((b, i) => (
        <svg key={i} width={b.w} height={b.w} viewBox="0 0 8 8" className="[image-rendering:pixelated]">
          <rect x="0" y="0" width="8" height="8" fill={b.color} />
          <rect x="0" y="0" width="8" height="2" fill={b.color} opacity="0.6" />
          <rect x="0" y="0" width="2" height="8" fill={b.shadow} opacity="0.5" />
        </svg>
      ))}
    </div>
  )
}
