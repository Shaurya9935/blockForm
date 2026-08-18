'use client'

import React from 'react'
import { DefaultLogo } from './logo'

interface SuccessScreenProps {
  onReset?: () => void
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col default-theme-root">
      <header className="px-6 pt-7">
        <div className="max-w-[680px] mx-auto">
          <DefaultLogo />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 sm:px-6">
        <div className="max-w-[480px] mx-auto text-center question-enter">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l4.5 4.5L16 6"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-[24px] font-bold text-slate-900 mb-2">Response submitted</h2>
          <p className="text-[15px] text-slate-500 leading-relaxed mb-1">
            Thank you for your feedback.
          </p>
          <p className="text-[14px] text-slate-400">
            Your submission has been successfully recorded. You can safely close this window.
          </p>

          {onReset && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={onReset}
                className="text-[13px] text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150 bg-transparent border-none cursor-pointer"
              >
                Submit another response →
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-5 px-6 border-t border-slate-100">
        <div className="max-w-[640px] mx-auto text-center">
          <span className="text-[11px] text-slate-400">Powered by BlockForm</span>
        </div>
      </footer>
    </div>
  )
}
