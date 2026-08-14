'use client'

import React, { useState } from 'react'
import { BLOCK_CONFIGS, type BlockType } from './builder-left-sidebar'
import type { FormBlockData } from './builder-right-sidebar'

interface BlockListMiddleSectionProps {
  blocks: FormBlockData[]
  selectedBlockId: string | null
  onSelectBlock: (id: string) => void
  onUpdateBlock: (id: string, updates: Partial<FormBlockData>) => void
  onDeleteBlock: (id: string) => void
  onMoveBlockUp: (id: string) => void
  onMoveBlockDown: (id: string) => void
  onAddBlock: (type: BlockType) => void
  onReorderBlocks?: (draggedId: string, targetId: string) => void
}

export function BlockListMiddleSection({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onAddBlock,
  onReorderBlocks,
}: BlockListMiddleSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  if (blocks.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: '#0b0f14',
          color: '#eceae4',
          fontFamily: "'Outfit', sans-serif",
          padding: 32,
        }}
      >
        <div style={{ fontSize: 42, marginBottom: 16 }}>📝</div>
        <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#eceae4' }}>
          Start building your form
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6e7a8a', maxWidth: 320, textAlign: 'center' }}>
          Add your first question block from the Left Sidebar palette or click below.
        </p>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            style={{
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              padding: '11px 22px',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(106,191,60,0.3)',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            + Add Question Block
          </button>

          {pickerOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 240,
                backgroundColor: '#161b22',
                border: '1px solid #21262d',
                borderRadius: 10,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                zIndex: 100,
                overflow: 'hidden',
                padding: 6,
              }}
            >
              {BLOCK_CONFIGS.map((b) => (
                <div
                  key={b.type}
                  onClick={() => {
                    onAddBlock(b.type)
                    setPickerOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#c8d8b8',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(106,191,60,0.1)'
                    e.currentTarget.style.color = '#6abf3c'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#c8d8b8'
                  }}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#0b0f14',
        padding: '32px 40px 80px',
        fontFamily: "'Outfit', sans-serif",
        color: '#eceae4',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {blocks.map((block) => {
          const config = BLOCK_CONFIGS.find((b) => b.type === block.type) ?? BLOCK_CONFIGS[0]!
          const blockId = block.id || `node-${block.fieldId}`
          const isSelected = selectedBlockId === blockId
          const isDragging = draggingId === blockId
          const isDropTarget = dropTargetId === blockId && draggingId !== blockId

          return (
            <div key={blockId} style={{ position: 'relative', marginBottom: 16 }}>
              {/* Drop Target Indicator Bar */}
              {isDropTarget && (
                <div
                  style={{
                    height: 4,
                    backgroundColor: '#6abf3c',
                    borderRadius: 2,
                    marginBottom: 6,
                    boxShadow: '0 0 12px #6abf3c',
                    animation: 'pulse 1s infinite',
                  }}
                />
              )}

              {/* Block Card */}
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', blockId)
                  e.dataTransfer.effectAllowed = 'move'
                  setDraggingId(blockId)
                }}
                onDragEnd={() => {
                  setDraggingId(null)
                  setDropTargetId(null)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  if (dropTargetId !== blockId) {
                    setDropTargetId(blockId)
                  }
                }}
                onDragLeave={() => {
                  if (dropTargetId === blockId) {
                    setDropTargetId(null)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggingId && draggingId !== blockId) {
                    onReorderBlocks?.(draggingId, blockId)
                  }
                  setDraggingId(null)
                  setDropTargetId(null)
                }}
                onClick={() => onSelectBlock(blockId)}
                style={{
                  backgroundColor: isDragging ? '#12161d' : '#161b22',
                  border: isDropTarget
                    ? '2px solid #6abf3c'
                    : isSelected
                    ? '2px solid #6abf3c'
                    : '1.5px solid #21262d',
                  borderRadius: 12,
                  padding: '18px 20px',
                  boxShadow: isDropTarget
                    ? '0 0 0 4px rgba(106,191,60,0.25), 0 12px 32px rgba(106,191,60,0.15)'
                    : isSelected
                    ? '0 0 0 4px rgba(106,191,60,0.15), 0 8px 24px rgba(0,0,0,0.4)'
                    : '0 4px 16px rgba(0,0,0,0.3)',
                  opacity: isDragging ? 0.4 : 1,
                  transform: isDragging ? 'scale(0.98)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Drag Handle Grip */}
                    <span
                      title="Drag to reorder step"
                      style={{
                        color: '#4e5a6a',
                        cursor: 'grab',
                        fontSize: 16,
                        lineHeight: 1,
                        padding: '2px 4px',
                        userSelect: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#6abf3c')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#4e5a6a')}
                    >
                      ⠿
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 6,
                        backgroundColor: 'rgba(106,191,60,0.12)',
                        color: '#6abf3c',
                        border: '1px solid rgba(106,191,60,0.25)',
                      }}
                    >
                      Step {block.index}
                    </span>
                    <span style={{ fontSize: 16 }}>{config.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#c8d8b8' }}>{config.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8b9ab0', cursor: 'pointer' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Required</span>
                      <input
                        type="checkbox"
                        checked={block.isRequired}
                        onChange={(e) => onUpdateBlock(blockId, { isRequired: e.target.checked })}
                        style={{ width: 16, height: 16, accentColor: '#6abf3c', cursor: 'pointer' }}
                      />
                    </label>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveBlockUp(blockId)
                      }}
                      title="Move Up"
                      style={{
                        backgroundColor: '#0d1117',
                        color: '#8b9ab0',
                        border: '1px solid #21262d',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveBlockDown(blockId)
                      }}
                      title="Move Down"
                      style={{
                        backgroundColor: '#0d1117',
                        color: '#8b9ab0',
                        border: '1px solid #21262d',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteBlock(blockId)
                      }}
                      title="Delete Block"
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div style={{ marginBottom: 12 }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={block.label}
                    onChange={(e) => onUpdateBlock(blockId, { label: e.target.value })}
                    placeholder="Enter your question label..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#0d1117',
                      border: '1px solid #21262d',
                      borderRadius: 6,
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#eceae4',
                      outline: 'none',
                      fontFamily: "'Outfit', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Description Input */}
                <div style={{ marginBottom: 14 }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={block.description}
                    onChange={(e) => onUpdateBlock(blockId, { description: e.target.value })}
                    placeholder="Help description (optional)..."
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      backgroundColor: '#0d1117',
                      border: '1px solid #21262d',
                      borderRadius: 6,
                      fontSize: 12,
                      color: '#6e7a8a',
                      outline: 'none',
                      fontFamily: "'Outfit', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Field Live Preview */}
                <div style={{ padding: '12px 14px', backgroundColor: '#0d1117', borderRadius: 8, border: '1px solid #21262d' }}>
                  {(block.type === 'TEXT' || block.type === 'EMAIL' || block.type === 'TEXTAREA' || block.type === 'DATE') && (
                    <div style={{ fontSize: 13, color: '#4e5a6a' }}>
                      {block.placeholder || (block.type === 'EMAIL' ? 'name@example.com' : 'User input field...')}
                    </div>
                  )}

                  {block.type === 'NUMBER' && (
                    <div style={{ fontSize: 13, color: '#4e5a6a' }}>
                      Numeric Input {block.minValue !== undefined ? `(Min: ${block.minValue})` : ''}
                    </div>
                  )}

                  {(block.type === 'SELECT' || block.type === 'CHECKBOX') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(block.options || []).map((opt, i) => (
                        <div key={opt.id || i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8b9ab0' }}>
                          <div style={{ width: 14, height: 14, border: '1px solid #2d3741', borderRadius: block.type === 'CHECKBOX' ? 3 : 7 }} />
                          <span>{opt.value || `Option ${i + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {block.type === 'RATING' && (
                    <div style={{ display: 'flex', gap: 6, color: '#fbbf24', fontSize: 18 }}>
                      {Array.from({ length: Math.min(block.maxRating || 5, 10) }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
