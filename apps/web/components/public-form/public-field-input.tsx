'use client'

import React from 'react'
import { getOptionValues } from '~/lib/utils'

interface PublicFieldInputProps {
  field: {
    id: string
    type: string
    isRequired?: boolean
    placeholder?: string | null
    config?: any
  }
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}

export function PublicFieldInput({
  field,
  value,
  onChange,
  disabled,
}: PublicFieldInputProps) {
  const config = (field.config as any) || {}
  const options = getOptionValues(config.options)

  if (field.type === 'SELECT') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.isRequired}
        disabled={disabled}
        className="w-full px-3.5 py-3 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] cursor-pointer disabled:opacity-50"
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
    const selectedValues = value ? value.split(',').map((s) => s.trim()) : []

    const handleCheckboxToggle = (optVal: string) => {
      let nextValues: string[]
      if (selectedValues.includes(optVal)) {
        nextValues = selectedValues.filter((v) => v !== optVal)
      } else {
        nextValues = [...selectedValues, optVal]
      }
      onChange(nextValues.join(', '))
    }

    return (
      <div className="flex flex-col gap-2">
        {options.map((optVal: string, i: number) => {
          const isChecked = selectedValues.includes(optVal)
          return (
            <label
              key={i}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 bg-[#0d1117] border rounded-lg text-[#eceae4] text-[14px] cursor-pointer transition-all ${
                isChecked ? 'border-[#6abf3c]' : 'border-[#21262d] hover:border-[#2d3741]'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxToggle(optVal)}
                disabled={disabled}
                className="w-4 h-4 accent-[#6abf3c] cursor-pointer"
              />
              <span>{optVal}</span>
            </label>
          )
        })}
      </div>
    )
  }

  if (field.type === 'RATING') {
    const maxRating = config.maxRating || 5
    const currentRating = Number(value || 0)

    return (
      <div className="flex gap-2">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starVal = i + 1
          const isActive = starVal <= currentRating
          return (
            <button
              key={starVal}
              type="button"
              disabled={disabled}
              onClick={() => onChange(String(starVal))}
              className={`bg-transparent border-none text-[28px] cursor-pointer p-1 transition-all hover:scale-110 ${
                isActive ? 'text-[#fbbf24]' : 'text-[#4e5a6a]'
              }`}
            >
              ★
            </button>
          )
        })}
      </div>
    )
  }

  if (field.type === 'TEXTAREA') {
    return (
      <textarea
        rows={4}
        placeholder={field.placeholder || ''}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.isRequired}
        disabled={disabled}
        className="w-full px-3.5 py-3 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] resize-y disabled:opacity-50"
      />
    )
  }

  if (field.type === 'DATE') {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.isRequired}
        disabled={disabled}
        className="w-full px-3.5 py-3 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] disabled:opacity-50"
      />
    )
  }

  if (field.type === 'YES_NO') {
    return (
      <div className="flex gap-3">
        {['Yes', 'No'].map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-4 py-2.5 bg-[#0d1117] border rounded-lg text-[#eceae4] text-[14px] cursor-pointer transition-all ${
              value === opt ? 'border-[#6abf3c]' : 'border-[#21262d] hover:border-[#2d3741]'
            }`}
          >
            <input
              type="radio"
              name={field.id}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(e.target.value)}
              required={field.isRequired}
              disabled={disabled}
              className="accent-[#6abf3c]"
            />
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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={field.isRequired}
      disabled={disabled}
      className="w-full px-3.5 py-3 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] disabled:opacity-50"
    />
  )
}
