'use client'

import React from 'react'
import type { BlockType, SelectOption } from './builder-left-sidebar'
import { normalizeOptions } from '~/lib/utils'

export interface FormBlockData {
  fieldId?: string
  id?: string
  label: string
  labelKey: string
  type: BlockType
  description: string
  placeholder: string
  isRequired: boolean
  index: number
  options: SelectOption[]
  maxRating: number
  minValue?: number
  maxValue?: number
  workflowX?: number
  workflowY?: number
  [key: string]: unknown
}

const uid = () => Math.random().toString(36).slice(2, 9)

interface BuilderRightSidebarProps {
  selectedBlockData: FormBlockData | null
  selectedBlockId: string | null
  onClose: () => void
  onUpdateSelectedBlock: (updates: Partial<FormBlockData>) => void
  onDeleteSelectedBlock?: (id: string) => void
  onMoveNodeUp?: (id: string) => void
  onMoveNodeDown?: (id: string) => void
}

export function BuilderRightSidebar({
  selectedBlockData,
  selectedBlockId,
  onClose,
  onUpdateSelectedBlock,
  onDeleteSelectedBlock,
  onMoveNodeUp,
  onMoveNodeDown,
}: BuilderRightSidebarProps) {
  if (!selectedBlockData || !selectedBlockId) {
    return (
      <aside
        style={{
          width: 320,
          backgroundColor: '#0f1419',
          borderLeft: '1px solid #21262d',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            color: '#4e5a6a',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#8b9ab0', marginBottom: 4 }}>
            No Block Selected
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>
            Click any block on the canvas or form list to inspect and edit its settings.
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside
      style={{
        width: 320,
        backgroundColor: '#0f1419',
        borderLeft: '1px solid #21262d',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div
          style={{
            padding: '16px 18px 14px',
            borderBottom: '1px solid #21262d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>Block Inspector</div>
            <div style={{ fontSize: 11, color: '#6abf3c' }}>
              Step #{selectedBlockData.index} • {selectedBlockData.type}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#4e5a6a',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {/* Question Input */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: '#8b9ab0',
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              Question Label
            </label>
            <textarea
              rows={2}
              value={selectedBlockData.label || ''}
              onChange={(e) => onUpdateSelectedBlock({ label: e.target.value })}
              placeholder="Enter question..."
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: 6,
                fontSize: 13,
                color: '#eceae4',
                outline: 'none',
                fontFamily: "'Outfit', sans-serif",
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Help Description Input */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: '#8b9ab0',
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              Help Description (Optional)
            </label>
            <input
              type="text"
              value={selectedBlockData.description || ''}
              onChange={(e) => onUpdateSelectedBlock({ description: e.target.value })}
              placeholder="Provide additional instructions..."
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: 6,
                fontSize: 12,
                color: '#eceae4',
                outline: 'none',
                fontFamily: "'Outfit', sans-serif",
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Placeholder Input */}
          {(selectedBlockData.type === 'TEXT' ||
            selectedBlockData.type === 'EMAIL' ||
            selectedBlockData.type === 'TEXTAREA' ||
            selectedBlockData.type === 'NUMBER') && (
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#8b9ab0',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}
              >
                Placeholder Text
              </label>
              <input
                type="text"
                value={selectedBlockData.placeholder || ''}
                onChange={(e) => onUpdateSelectedBlock({ placeholder: e.target.value })}
                placeholder="e.g. Type your answer here..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#eceae4',
                  outline: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Required Toggle */}
          <div
            style={{
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0d1117',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #21262d',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#eceae4' }}>Required Field</div>
              <div style={{ fontSize: 10, color: '#4e5a6a' }}>Require respondent to complete this</div>
            </div>
            <input
              type="checkbox"
              checked={Boolean(selectedBlockData.isRequired)}
              onChange={(e) => onUpdateSelectedBlock({ isRequired: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: '#6abf3c', cursor: 'pointer' }}
            />
          </div>

          {/* Options Manager for SELECT / CHECKBOX */}
          {(selectedBlockData.type === 'SELECT' || selectedBlockData.type === 'CHECKBOX') && (() => {
            const currentOptions = normalizeOptions(selectedBlockData.options)
            return (
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#8b9ab0',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  Options ({currentOptions.length})
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                  {currentOptions.map((opt, i) => (
                    <div key={opt.id || i} style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        value={opt.value}
                        onChange={(e) => {
                          const newOpts = currentOptions.map((o, idx) =>
                            idx === i ? { ...o, value: e.target.value } : o
                          )
                          onUpdateSelectedBlock({ options: newOpts })
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          backgroundColor: '#0d1117',
                          border: '1px solid #21262d',
                          borderRadius: 6,
                          fontSize: 12,
                          color: '#eceae4',
                          outline: 'none',
                          fontFamily: "'Outfit', sans-serif",
                        }}
                        placeholder={`Option ${i + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOpts = currentOptions.filter((_, idx) => idx !== i)
                          onUpdateSelectedBlock({ options: newOpts })
                        }}
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.1)',
                          color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 6,
                          padding: '0 8px',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const newOpts = [...currentOptions, { id: uid(), value: '' }]
                    onUpdateSelectedBlock({ options: newOpts })
                  }}
                  style={{
                    backgroundColor: '#161b22',
                    color: '#6abf3c',
                    border: '1px solid rgba(106,191,60,0.3)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  + Add Choice Option
                </button>
              </div>
            )
          })()}

          {/* Rating Scale Manager */}
          {selectedBlockData.type === 'RATING' && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#8b9ab0',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}
              >
                Star Rating Scale
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[3, 5, 7, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => onUpdateSelectedBlock({ maxRating: n })}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      backgroundColor: selectedBlockData.maxRating === n ? '#6abf3c' : '#0d1117',
                      color: selectedBlockData.maxRating === n ? '#0d1117' : '#8b9ab0',
                      border: `1px solid ${selectedBlockData.maxRating === n ? '#6abf3c' : '#21262d'}`,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {n} Stars
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Number Min/Max Manager */}
          {selectedBlockData.type === 'NUMBER' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#8b9ab0',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  Min Value
                </label>
                <input
                  type="number"
                  value={selectedBlockData.minValue ?? ''}
                  onChange={(e) =>
                    onUpdateSelectedBlock({
                      minValue: e.target.value !== '' ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="No minimum"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #21262d',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#eceae4',
                    outline: 'none',
                    fontFamily: "'Outfit', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#8b9ab0',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  Max Value
                </label>
                <input
                  type="number"
                  value={selectedBlockData.maxValue ?? ''}
                  onChange={(e) =>
                    onUpdateSelectedBlock({
                      maxValue: e.target.value !== '' ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="No maximum"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #21262d',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#eceae4',
                    outline: 'none',
                    fontFamily: "'Outfit', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          {/* Reorder and Delete Actions */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #21262d' }}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: '#8b9ab0',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              Reorder Step Position
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => onMoveNodeUp?.(selectedBlockId)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#161b22',
                  color: '#eceae4',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                ◄ Move Up / Left
              </button>
              <button
                onClick={() => onMoveNodeDown?.(selectedBlockId)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#161b22',
                  color: '#eceae4',
                  border: '1px solid #21262d',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                ► Move Down / Right
              </button>
            </div>

            {onDeleteSelectedBlock && (
              <button
                onClick={() => onDeleteSelectedBlock(selectedBlockId)}
                style={{
                  width: '100%',
                  padding: '9px',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                🗑 Delete Block
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
