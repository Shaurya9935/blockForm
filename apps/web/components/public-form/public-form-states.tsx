'use client'

import React from 'react'

export function FormLoadingState() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#6e7a8a] flex items-center justify-center font-['Outfit']">
      Loading form...
    </div>
  )
}

export function FormNotFoundState({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#eceae4] flex items-center justify-center p-5 font-['Outfit']">
      <div className="bg-[#161b22] border border-[#2d3741] rounded-xl p-8 max-w-[420px] text-center">
        <div className="text-[32px] mb-3">⚠️</div>
        <h2 className="m-0 mb-2 text-[18px] text-[#f87171] font-bold">Form Not Found</h2>
        <p className="m-0 text-[13px] text-[#6e7a8a]">
          {message || 'This form does not exist or may have been deleted.'}
        </p>
      </div>
    </div>
  )
}

interface FormSuccessStateProps {
  formTitle: string
  onReset: () => void
}

export function FormSuccessState({ formTitle, onReset }: FormSuccessStateProps) {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#eceae4] flex items-center justify-center p-5 font-['Outfit']">
      <div className="bg-[#161b22] border border-[#2d3741] rounded-[14px] p-10 max-w-[480px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="text-[48px] mb-4">🎉</div>
        <h2 className="m-0 mb-2.5 text-[22px] font-extrabold text-[#a3e063]">Response Submitted!</h2>
        <p className="m-0 mb-6 text-[14px] text-[#8b9ab0] leading-relaxed">
          Thank you for completing <strong>{formTitle}</strong>. Your response has been recorded.
        </p>
        <button
          onClick={onReset}
          className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-5 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
        >
          Submit Another Response
        </button>
      </div>
    </div>
  )
}
