'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useGetForm, useSubmitForm } from '~/hooks/api/form'
import { toast } from 'sonner'
import { getOptionValues } from '~/lib/utils'

function RenderFieldInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: any
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}) {
  const config = (field.config as any) || {}
  const options = getOptionValues(config.options)

  if (field.type === 'SELECT') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.isRequired}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 14px',
          backgroundColor: '#0d1117',
          border: '1.5px solid #21262d',
          borderRadius: 8,
          color: '#eceae4',
          fontSize: 14,
          fontFamily: "'Outfit', sans-serif",
          outline: 'none',
          boxSizing: 'border-box',
        }}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((optVal: string, i: number) => {
          const isChecked = selectedValues.includes(optVal)
          return (
            <label
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                backgroundColor: '#0d1117',
                border: `1.5px solid ${isChecked ? '#6abf3c' : '#21262d'}`,
                borderRadius: 8,
                color: '#eceae4',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxToggle(optVal)}
                disabled={disabled}
                style={{ width: 18, height: 18, accentColor: '#6abf3c', cursor: 'pointer' }}
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
      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const starVal = i + 1
          const isActive = starVal <= currentRating
          return (
            <button
              key={starVal}
              type="button"
              disabled={disabled}
              onClick={() => onChange(String(starVal))}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 28,
                color: isActive ? '#fbbf24' : '#4e5a6a',
                cursor: 'pointer',
                padding: '0 4px',
                transition: 'transform 0.15s, color 0.15s',
              }}
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
        style={{
          width: '100%',
          padding: '12px 14px',
          backgroundColor: '#0d1117',
          border: '1.5px solid #21262d',
          borderRadius: 8,
          color: '#eceae4',
          fontSize: 14,
          fontFamily: "'Outfit', sans-serif",
          outline: 'none',
          boxSizing: 'border-box',
          resize: 'vertical',
        }}
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
        style={{
          width: '100%',
          padding: '12px 14px',
          backgroundColor: '#0d1117',
          border: '1.5px solid #21262d',
          borderRadius: 8,
          color: '#eceae4',
          fontSize: 14,
          fontFamily: "'Outfit', sans-serif",
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    )
  }

  if (field.type === 'YES_NO') {
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {['Yes', 'No'].map((opt) => (
          <label
            key={opt}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: '#0d1117',
              border: `1.5px solid ${value === opt ? '#6abf3c' : '#21262d'}`,
              borderRadius: 8,
              color: '#eceae4',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <input
              type="radio"
              name={field.id}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(e.target.value)}
              required={field.isRequired}
              disabled={disabled}
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
      style={{
        width: '100%',
        padding: '12px 14px',
        backgroundColor: '#0d1117',
        border: '1.5px solid #21262d',
        borderRadius: 8,
        color: '#eceae4',
        fontSize: 14,
        fontFamily: "'Outfit', sans-serif",
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  )
}

export default function PublicFormSubmissionPage() {
  const params = useParams()
  const formId = (params?.form_id as string) || ''

  const { form, isLoading, error } = useGetForm(formId)
  const { submitFormAsync, isPending } = useSubmitForm()

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formId || !form?.fields) return

    const values = form.fields.map((field) => ({
      formFieldId: field.id,
      value: formData[field.id] || '',
    }))

    try {
      await submitFormAsync({
        formId,
        values,
      })
      setSubmitted(true)
      toast.success('Form response submitted successfully!')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit response')
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', color: '#6e7a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
        Loading form...
      </div>
    )
  }

  if (error || !form) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', color: '#eceae4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ backgroundColor: '#161b22', border: '1px solid #2d3741', borderRadius: 12, padding: 32, maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#f87171' }}>Form Not Found</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#6e7a8a' }}>{error?.message || 'This form does not exist or may have been deleted.'}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', color: '#eceae4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ backgroundColor: '#161b22', border: '1px solid #2d3741', borderRadius: 14, padding: 40, maxWidth: 480, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#a3e063' }}>Response Submitted!</h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: '#8b9ab0', lineHeight: 1.5 }}>
            Thank you for completing <strong>{form.title}</strong>. Your response has been recorded.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', padding: '40px 20px', fontFamily: "'Outfit', sans-serif" }}>
      <div
        style={{
          maxWidth: 620,
          margin: '0 auto',
          backgroundColor: '#161b22',
          border: '1px solid #21262d',
          borderRadius: 16,
          padding: '36px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ borderBottom: '1px solid #21262d', paddingBottom: 20, marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.5px' }}>
            {form.title}
          </h1>
          {form.description && (
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#8b9ab0', lineHeight: 1.6 }}>{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {form.fields.map((field) => (
            <div key={field.id} style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#c8d8b8', marginBottom: 6 }}>
                {field.label} {field.isRequired && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              {field.description && (
                <div style={{ fontSize: 12, color: '#4e5a6a', marginBottom: 8 }}>{field.description}</div>
              )}

              <RenderFieldInput
                field={field}
                value={formData[field.id] || ''}
                onChange={(val) => handleInputChange(field.id, val)}
                disabled={isPending}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: "'Outfit', sans-serif",
              cursor: isPending ? 'not-allowed' : 'pointer',
              marginTop: 12,
              boxShadow: '0 4px 16px rgba(106,191,60,0.25)',
            }}
          >
            {isPending ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>
    </div>
  )
}
