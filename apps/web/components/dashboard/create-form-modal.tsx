'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconPlus } from './icons'
import { useCreateForm } from '~/hooks/api/form'
import { BLUEPRINTS } from '~/lib/blueprints'

export function CreateFormModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [startType, setStartType] = useState<'blank' | 'blueprint'>('blank')
  const [selectedBlueprint, setSelectedBlueprint] = useState('event-feedback')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [focused, setFocused] = useState(false)
  const [descFocused, setDescFocused] = useState(false)

  const { createFormAsync, isPending, error, isError } = useCreateForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (startType === 'blueprint') {
      onClose()
      router.push(`/dashboard/forms/builder?blueprint=${selectedBlueprint}`)
      return
    }

    if (!name.trim() || isPending) return
    try {
      await createFormAsync({
        title: name.trim(),
        description: description.trim() || undefined,
      })
      onClose()
    } catch (err) {
      console.error('Failed to create form:', err)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#161b22',
          border: '1px solid #2d3741',
          borderRadius: 14,
          padding: '32px',
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: 8,
                color: '#4e5a6a',
                marginBottom: 8,
                letterSpacing: '1px',
              }}
            >
              NEW BUILD
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.4px' }}>
              Create a new form
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 20, padding: 4 }}
          >
            ×
          </button>
        </div>

        {/* Start options */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#8b9ab0', display: 'block', marginBottom: 10 }}>
            Start with
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { id: 'blank', icon: '📄', label: 'Blank form', desc: 'Start from scratch' },
              { id: 'blueprint', icon: '📐', label: 'Blueprint', desc: 'Use starter pack' },
            ].map((opt) => {
              const active = startType === opt.id
              return (
                <div
                  key={opt.id}
                  onClick={() => setStartType(opt.id as any)}
                  style={{
                    padding: '14px',
                    backgroundColor: active ? 'rgba(106,191,60,0.08)' : '#0d1117',
                    border: `1.5px solid ${active ? 'rgba(106,191,60,0.35)' : '#21262d'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{opt.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? '#eceae4' : '#8b9ab0', marginBottom: 2 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#4e5a6a' }}>{opt.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {startType === 'blueprint' ? (
          /* Blueprint selector */
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#8b9ab0', display: 'block', marginBottom: 10 }}>
              Select Starter Blueprint
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
              {BLUEPRINTS.map((bp) => {
                const isSelected = selectedBlueprint === bp.id
                return (
                  <div
                    key={bp.id}
                    onClick={() => setSelectedBlueprint(bp.id)}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: isSelected ? `${bp.accent}14` : '#0d1117',
                      border: `1px solid ${isSelected ? `${bp.accent}55` : '#21262d'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{bp.emoji}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#eceae4' }}>{bp.name}</div>
                        <div style={{ fontSize: 11, color: '#6e7a8a' }}>{bp.fieldsCount} Pre-configured blocks</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: bp.accent, fontSize: 12, fontWeight: 700 }}>✓ Selected</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Error message */}
            {isError && (
              <div
                style={{
                  padding: '10px 14px',
                  marginBottom: 16,
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: 8,
                  color: '#f87171',
                  fontSize: 13,
                }}
              >
                {error?.message || 'Failed to create form. Please try again.'}
              </div>
            )}

            {/* Form name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#8b9ab0', display: 'block', marginBottom: 7 }}>
                Form Name <span style={{ color: '#6abf3c' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Customer Feedback, Event Signup"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#0d1117',
                  border: `1.5px solid ${focused ? '#6abf3c' : '#2d3741'}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#eceae4',
                  fontFamily: "'Outfit', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                  boxShadow: focused ? '0 0 0 3px rgba(106,191,60,0.1)' : 'none',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#8b9ab0', display: 'block', marginBottom: 7 }}>
                Description <span style={{ color: '#4e5a6a', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                placeholder="What is this form for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#0d1117',
                  border: `1.5px solid ${descFocused ? '#6abf3c' : '#2d3741'}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#eceae4',
                  fontFamily: "'Outfit', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                  resize: 'none',
                  boxShadow: descFocused ? '0 0 0 3px rgba(106,191,60,0.1)' : 'none',
                }}
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            style={{
              flex: 1,
              padding: '11px',
              backgroundColor: 'transparent',
              border: '1px solid #2d3741',
              borderRadius: 7,
              color: '#8b9ab0',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={startType === 'blank' && (!name.trim() || isPending)}
            style={{
              flex: 2,
              padding: '11px',
              backgroundColor: startType === 'blueprint' || (name.trim() && !isPending) ? '#6abf3c' : '#3a4a2f',
              border: 'none',
              borderRadius: 7,
              color: startType === 'blueprint' || (name.trim() && !isPending) ? '#0d1117' : '#6e7a8a',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: startType === 'blueprint' || (name.trim() && !isPending) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: startType === 'blueprint' || (name.trim() && !isPending) ? '0 4px 16px rgba(106,191,60,0.25)' : 'none',
            }}
          >
            <IconPlus />
            {startType === 'blueprint'
              ? 'Open in Builder →'
              : isPending
                ? 'Creating...'
                : name.trim()
                  ? `Create "${name}"`
                  : 'Create Form'}
          </button>
        </div>
      </form>
    </div>
  )
}
