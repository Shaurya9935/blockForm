'use client'

import React from 'react'
import { PublicFieldInput } from './public-field-input'

interface PublicFormContainerProps {
  form: {
    title: string
    description?: string | null
    fields: any[]
  }
  formData: Record<string, string>
  onInputChange: (fieldId: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
}

export function PublicFormContainer({
  form,
  formData,
  onInputChange,
  onSubmit,
  isPending,
}: PublicFormContainerProps) {
  return (
    <div className="min-h-screen bg-[#0a0e14] p-5 md:py-10 md:px-5 font-['Outfit']">
      <div className="max-w-[620px] mx-auto bg-[#161b22] border border-[#21262d] rounded-2xl p-6 md:p-[36px] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        {/* Form Header */}
        <div className="border-b border-[#21262d] pb-5 mb-7">
          <h1 className="m-0 text-[24px] font-extrabold text-[#eceae4] tracking-[-0.5px]">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-2 mb-0 text-[14px] text-[#8b9ab0] leading-relaxed">{form.description}</p>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={onSubmit}>
          {form.fields.map((field) => (
            <div key={field.id} className="mb-6">
              <label className="block text-[14px] font-bold text-[#c8d8b8] mb-1.5">
                {field.label} {field.isRequired && <span className="text-[#ef4444]">*</span>}
              </label>
              {field.description && (
                <div className="text-[12px] text-[#4e5a6a] mb-2">{field.description}</div>
              )}

              <PublicFieldInput
                field={field}
                value={formData[field.id] || ''}
                onChange={(val) => onInputChange(field.id, val)}
                disabled={isPending}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-[#6abf3c] text-[#0d1117] border-none rounded-lg text-[15px] font-extrabold font-['Outfit'] cursor-pointer mt-3 shadow-[0_4px_16px_rgba(106,191,60,0.25)] hover:bg-[#7dd44a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>
    </div>
  )
}
