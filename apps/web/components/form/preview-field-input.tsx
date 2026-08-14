'use client'

import React from 'react'
import { getOptionValues } from '~/lib/utils'

interface PreviewFieldInputProps {
  field: {
    type: string
    isRequired?: boolean
    placeholder?: string | null
    labelKey?: string
    config?: any
  }
}

export function PreviewFieldInput({ field }: PreviewFieldInputProps) {
  const config = (field.config as any) || {}
  const options = getOptionValues(config.options)

  if (field.type === 'SELECT') {
    return (
      <select
        required={field.isRequired}
        className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] cursor-pointer"
      >
        <option value="">-- Select an option --</option>
        {options.map((optVal: string, i: number) => (
          <option key={i} value={optVal}>
            {optVal}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'CHECKBOX') {
    return (
      <div className="flex flex-col gap-2">
        {options.map((optVal: string, i: number) => (
          <label
            key={i}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#0d1117] border border-[#21262d] rounded-md text-[#eceae4] text-[13px] cursor-pointer hover:border-[#2d3741] transition-colors"
          >
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#6abf3c] cursor-pointer"
            />
            <span>{optVal}</span>
          </label>
        ))}
      </div>
    )
  }

  if (field.type === 'RATING') {
    const maxRating = config.maxRating || 5
    return (
      <div className="flex gap-2">
        {Array.from({ length: maxRating }).map((_, i) => (
          <span key={i} className="text-2xl text-[#fbbf24] cursor-pointer hover:scale-110 transition-transform">
            ★
          </span>
        ))}
      </div>
    )
  }

  if (field.type === 'TEXTAREA') {
    return (
      <textarea
        rows={4}
        placeholder={field.placeholder || ''}
        required={field.isRequired}
        className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] resize-y"
      />
    )
  }

  if (field.type === 'DATE') {
    return (
      <input
        type="date"
        required={field.isRequired}
        className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c]"
      />
    )
  }

  if (field.type === 'YES_NO') {
    return (
      <div className="flex gap-3">
        {['Yes', 'No'].map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0d1117] border border-[#21262d] rounded-md text-[#eceae4] text-[13px] cursor-pointer hover:border-[#2d3741] transition-colors"
          >
            <input type="radio" name={field.labelKey} value={opt} required={field.isRequired} />
            {opt}
          </label>
        ))}
      </div>
    )
  }

  return (
    <input
      type={field.type === 'NUMBER' ? 'number' : field.type === 'EMAIL' ? 'email' : field.type === 'PASSWORD' ? 'password' : 'text'}
      min={config.minValue}
      max={config.maxValue}
      placeholder={field.placeholder || ''}
      required={field.isRequired}
      className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c]"
    />
  )
}
