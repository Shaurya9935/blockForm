'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useGetForm, useSubmitForm } from '~/hooks/api/form'
import { toast } from 'sonner'

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

              {field.type === 'YES_NO' ? (
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
                        border: `1.5px solid ${formData[field.id] === opt ? '#6abf3c' : '#21262d'}`,
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
                        checked={formData[field.id] === opt}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type === 'NUMBER' ? 'number' : field.type === 'EMAIL' ? 'email' : field.type === 'PASSWORD' ? 'password' : 'text'}
                  placeholder={field.placeholder || ''}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.isRequired}
                  disabled={isPending}
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
              )}
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
