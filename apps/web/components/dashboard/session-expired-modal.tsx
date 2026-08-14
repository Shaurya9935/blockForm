'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface SessionExpiredModalProps {
  isOpen: boolean
  onClose?: () => void
}

export function SessionExpiredModal({ isOpen }: SessionExpiredModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#161b22] border border-[#2d3741] rounded-2xl p-6 sm:p-8 max-w-[440px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col items-center">
        {/* Warning Icon Box */}
        <div className="w-14 h-14 rounded-2xl bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center text-2xl mb-4 text-[#ef4444]">
          🔒
        </div>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-md">
          <span className="font-['Press_Start_2P'] text-[7px] text-[#f87171] tracking-wider">
            AUTH REQUIRED
          </span>
        </div>

        {/* Title */}
        <h2 className="m-0 text-[20px] font-extrabold text-[#eceae4] tracking-[-0.3px] mb-2">
          Session Expired
        </h2>

        {/* Description */}
        <p className="m-0 text-[13.5px] text-[#8b9ab0] leading-relaxed mb-6">
          Your session has expired or you are not logged in. Please log in again to access your forms and workspace.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => router.push('/signin')}
            className="flex-1 py-2.5 px-4 bg-[#6abf3c] text-[#0d1117] border-none rounded-lg text-[13px] font-bold font-['Outfit'] cursor-pointer hover:bg-[#7dd44a] transition-all shadow-[0_2px_12px_rgba(106,191,60,0.2)]"
          >
            Log In Again
          </button>
          <button
            onClick={() => router.push('/home')}
            className="flex-1 py-2.5 px-4 bg-[#1f2630] text-[#8b9ab0] border border-[#2d3741] rounded-lg text-[13px] font-semibold font-['Outfit'] cursor-pointer hover:bg-[#2d3741] hover:text-[#eceae4] transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
