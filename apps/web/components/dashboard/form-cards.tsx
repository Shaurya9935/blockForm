'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThumbCollege, ThumbEvent, ThumbStartup, ThumbGaming } from './thumbnails'

const THEMES: ('college' | 'event' | 'startup' | 'gaming')[] = ['college', 'event', 'startup', 'gaming']

const THUMB_MAP = {
  college: <ThumbCollege />,
  event: <ThumbEvent />,
  startup: <ThumbStartup />,
  gaming: <ThumbGaming />,
}

function formatEditedTime(date?: Date | string | null, fallback?: string) {
  if (fallback) return fallback
  if (!date) return 'Recently'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

export interface FormCardProps {
  form: {
    id: string
    title?: string
    name?: string
    description?: string | null
    desc?: string
    status?: 'published' | 'draft'
    responses?: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    edited?: string
    theme?: string | null
  }
  index?: number
}


export function FormCard({ form, index = 0 }: FormCardProps) {
  const router = useRouter()
  const [hov, setHov] = useState(false)

  const themeKey = ((form.theme && form.theme in THUMB_MAP) ? form.theme : THEMES[index % THEMES.length]) as keyof typeof THUMB_MAP

  const title = form.title || form.name || 'Untitled Form'
  const description = form.description || form.desc || 'No description provided.'
  const status = form.status || 'published'
  const responses = form.responses ?? 0
  const editedText = formatEditedTime(form.updatedAt || form.createdAt, form.edited)

  const handleOpenForm = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    router.push(`/dashboard/forms?id=${form.id}`)
  }

  const handleOpenResponse = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    router.push(`/dashboard/forms/${form.id}`)
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={handleOpenForm}
      className={`relative flex flex-col overflow-hidden rounded-[10px] bg-[#161b22] border transition-all duration-200 cursor-pointer ${
        hov
          ? 'border-[#2d3741] -translate-y-[3px] shadow-[0_12px_32px_rgba(0,0,0,0.3)]'
          : 'border-[#21262d]'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-[112px] overflow-hidden shrink-0">
        {THUMB_MAP[themeKey]}
        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-[5px] text-[10px] font-bold px-[9px] py-[3px] rounded-full backdrop-blur-sm font-['Outfit'] border ${
              status === 'published'
                ? 'bg-[rgba(106,191,60,0.15)] text-[#6abf3c] border-[rgba(106,191,60,0.3)]'
                : 'bg-[rgba(110,122,138,0.2)] text-[#6e7a8a] border-[rgba(110,122,138,0.2)]'
            }`}
          >
            <span
              className={`inline-block w-[5px] h-[5px] rounded-[1px] [image-rendering:pixelated] ${
                status === 'published' ? 'bg-[#6abf3c]' : 'bg-[#6e7a8a]'
              }`}
            />
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-[14px_16px_16px] flex-1 flex flex-col gap-2">
        <div>
          <div className="text-[14px] font-bold text-[#eceae4] mb-1 leading-[1.3]">
            {title}
          </div>
          <div className="text-[12px] text-[#4e5a6a] leading-[1.5]">{description}</div>
        </div>

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between">
          <div className="text-[12px] text-[#6e7a8a] flex items-center gap-[5px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="[image-rendering:pixelated]">
              <rect x="1" y="2" width="8" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="3" y="4" width="4" height="1" fill="currentColor" />
              <rect x="3" y="6" width="3" height="1" fill="currentColor" />
            </svg>
            {status === 'published' && responses > 0 ? `${responses.toLocaleString()} responses` : 'No responses yet'}
          </div>
          <div className="text-[11px] text-[#4e5a6a]">Edited {editedText}</div>
        </div>

        {/* Quick actions */}
        <div
          className={`flex gap-[6px] transition-all duration-200 ${
            hov ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          <button
            onClick={handleOpenForm}
            className="flex-1 py-[5px] bg-[#6abf3c] text-[#0d1117] rounded-[5px] text-[11px] font-semibold font-['Outfit'] cursor-pointer transition-all hover:bg-[#7dd44a]"
          >
            Open
          </button>
          <button
            onClick={handleOpenResponse}
            className="flex-1 py-[5px] bg-[#1f2630] text-[#8b9ab0] border border-[#2d3741] rounded-[5px] text-[11px] font-semibold font-['Outfit'] cursor-pointer transition-all hover:bg-[#2d3741] hover:text-[#eceae4]"
          >
            Responses
          </button>
        </div>
      </div>
    </div>
  )
}

export function EmptyForms({ onCreateForm }: { onCreateForm: () => void }) {
  return (
    <div className="border border-dashed border-[#21262d] rounded-[10px] py-[56px] px-6 flex flex-col items-center text-center gap-4">
      {/* Small block scene */}
      <svg width="80" height="60" viewBox="0 0 80 60" className="[image-rendering:pixelated]">
        <rect x="32" y="44" width="16" height="10" fill="#3d7a22" opacity="0.5" />
        <rect x="24" y="36" width="16" height="10" fill="#888" opacity="0.4" />
        <rect x="40" y="30" width="16" height="10" fill="#5D9E2F" opacity="0.5" />
        <rect x="8" y="48" width="12" height="12" fill="#888" opacity="0.25" className="outline outline-1 outline-dashed outline-[#2d3741]" />
        <rect x="60" y="42" width="12" height="12" fill="#888" opacity="0.25" className="outline outline-1 outline-dashed outline-[#2d3741]" />
        <rect x="48" y="50" width="10" height="10" fill="#888" opacity="0.15" className="outline outline-1 outline-dashed outline-[#2d3741]" />
      </svg>
      <div>
        <div className="text-[17px] font-bold text-[#8b9ab0] mb-[6px]">Your world is empty.</div>
        <p className="m-0 text-[13px] text-[#4e5a6a] leading-[1.6] max-w-[320px]">
          Start with a blank form or choose a blueprint to build your first experience.
        </p>
      </div>
      <div className="flex gap-[10px]">
        <button
          onClick={onCreateForm}
          className="bg-[#6abf3c] text-[#0d1117] border-none rounded-[7px] px-[18px] py-[10px] text-[13px] font-bold font-['Outfit'] cursor-pointer hover:bg-[#7dd44a] transition-colors"
        >
          Create Blank Form
        </button>
        <button
          className="bg-transparent text-[#8b9ab0] border border-[#2d3741] rounded-[7px] px-[18px] py-[10px] text-[13px] font-semibold font-['Outfit'] cursor-pointer hover:bg-[#1f2630] hover:text-[#eceae4] transition-colors"
        >
          Explore Templates
        </button>
      </div>
    </div>
  )
}
