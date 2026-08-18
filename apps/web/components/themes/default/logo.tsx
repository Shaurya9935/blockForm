'use client'

import React from 'react'

export function DefaultLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-indigo-700 rounded-[3px] flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" fill="white" />
          <rect x="5.5" y="1" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.6" />
          <rect x="1" y="5.5" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.6" />
          <rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.5" fill="white" />
        </svg>
      </div>
      <span className="text-[13px] font-semibold tracking-wide text-slate-700 uppercase">
        BlockForm
      </span>
    </div>
  )
}
