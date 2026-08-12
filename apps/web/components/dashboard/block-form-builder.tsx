'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useCreateForm, useBulkCreateFormFields, useCreateFormField, useDeleteFormField, useGetForms } from '~/hooks/api/form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type BlockType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'SELECT' | 'CHECKBOX' | 'RATING' | 'DATE'

interface SelectOption {
  id: string
  value: string
}

interface FormBlock {
  id: string // local ID
  type: BlockType
  question: string
  description: string
  required: boolean
  placeholder: string
  options: SelectOption[] // for SELECT / CHECKBOX
  maxRating: number       // for RATING
  minValue?: number       // for NUMBER
  maxValue?: number       // for NUMBER
}

interface BlockFormBuilderProps {
  onClose: () => void
}

// ─── Block Library Config ─────────────────────────────────────────────────────

const BLOCK_TYPES: { type: BlockType; icon: string; label: string; description: string }[] = [
  { type: 'TEXT',     icon: '📝', label: 'Text',     description: 'Short or long text input' },
  { type: 'EMAIL',    icon: '✉️',  label: 'Email',    description: 'Email address field' },
  { type: 'NUMBER',   icon: '🔢', label: 'Number',   description: 'Numeric input field' },
  { type: 'SELECT',   icon: '📋', label: 'Select',   description: 'Multiple choice options' },
  { type: 'CHECKBOX', icon: '☑️',  label: 'Checkbox', description: 'Yes / No toggle' },
  { type: 'RATING',   icon: '⭐', label: 'Rating',   description: 'Star rating scale' },
  { type: 'DATE',     icon: '📅', label: 'Date',     description: 'Date picker field' },
]

// ─── Utils ────────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2)

const createBlock = (type: BlockType): FormBlock => ({
  id: uid(),
  type,
  question: '',
  description: '',
  required: false,
  placeholder: '',
  options: type === 'SELECT' || type === 'CHECKBOX'
    ? [{ id: uid(), value: 'Option 1' }, { id: uid(), value: 'Option 2' }]
    : [],
  maxRating: 5,
})

const labelKeyFromQuestion = (q: string, idx: number) =>
  `${q.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 35) || 'field'}_${idx + 1}`

const fractionalIndex = (idx: number, total: number) => {
  const base = String.fromCharCode(97 + (idx % 26))
  return `${String(idx).padStart(4, '0')}${base}`
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const builderStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

  .bf-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: #0b0f14;
    display: flex;
    flex-direction: column;
    font-family: 'Outfit', sans-serif;
    animation: bf-slide-in 0.22s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes bf-slide-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bf-block-card {
    position: relative;
    background: #161b22;
    border: 1.5px solid #21262d;
    border-radius: 10px;
    padding: 0;
    margin-bottom: 12px;
    transition: border-color 0.15s, box-shadow 0.15s;
    cursor: default;
    overflow: visible;
  }

  .bf-block-card.selected {
    border-color: rgba(106,191,60,0.6);
    box-shadow: 0 0 0 3px rgba(106,191,60,0.08);
  }

  .bf-block-card.dragging {
    opacity: 0.5;
    transform: scale(0.98);
  }

  .bf-block-card-enter {
    animation: bf-block-settle 0.28s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes bf-block-settle {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .bf-library-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.12s;
    color: #c8d8b8;
    font-size: 13px;
    font-weight: 600;
    user-select: none;
  }

  .bf-library-item:hover {
    background: rgba(106,191,60,0.07);
    border-color: rgba(106,191,60,0.2);
    color: #a3e063;
    transform: translateX(2px);
  }

  .bf-library-item:active {
    transform: scale(0.97);
  }

  .bf-drag-handle {
    color: #3d4f3e;
    cursor: grab;
    font-size: 16px;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s;
    line-height: 1;
  }

  .bf-drag-handle:hover {
    color: #6abf3c;
  }

  .bf-question-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #eceae4;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    padding: 0;
    resize: none;
    line-height: 1.5;
  }

  .bf-question-input::placeholder {
    color: #3d4f3e;
    font-weight: 500;
  }

  .bf-desc-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #6e7a8a;
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    padding: 0;
    resize: none;
    line-height: 1.4;
  }

  .bf-desc-input::placeholder {
    color: #2d3a2d;
  }

  .bf-drop-indicator {
    height: 3px;
    background: linear-gradient(90deg, transparent, #6abf3c, transparent);
    border-radius: 2px;
    margin: 4px 0;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .bf-drop-indicator.active {
    opacity: 1;
  }

  .bf-toggle {
    width: 32px;
    height: 18px;
    border-radius: 9px;
    position: relative;
    cursor: pointer;
    border: none;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .bf-toggle::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
  }

  .bf-toggle.on {
    background: #6abf3c;
  }

  .bf-toggle.on::after {
    transform: translateX(14px);
  }

  .bf-toggle.off {
    background: #2d3741;
  }

  .bf-panel-input {
    width: 100%;
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 6px;
    color: #eceae4;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    padding: 8px 10px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }

  .bf-panel-input:focus {
    border-color: rgba(106,191,60,0.4);
  }

  .bf-canvas-area {
    flex: 1;
    overflow-y: auto;
    padding: 32px 28px 80px;
  }

  .bf-canvas-area::-webkit-scrollbar {
    width: 4px;
  }
  .bf-canvas-area::-webkit-scrollbar-track { background: transparent; }
  .bf-canvas-area::-webkit-scrollbar-thumb { background: #21262d; border-radius: 2px; }

  .bf-right-panel {
    overflow-y: auto;
  }

  .bf-right-panel::-webkit-scrollbar {
    width: 4px;
  }
  .bf-right-panel::-webkit-scrollbar-track { background: transparent; }
  .bf-right-panel::-webkit-scrollbar-thumb { background: #21262d; border-radius: 2px; }

  .bf-block-picker {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 260px;
    background: #161b22;
    border: 1px solid #2d3741;
    border-radius: 10px;
    box-shadow: 0 20px 48px rgba(0,0,0,0.6);
    z-index: 100;
    overflow: hidden;
    animation: bf-slide-in 0.15s ease;
  }

  .bf-block-picker-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #c8d8b8;
    transition: background 0.1s;
  }

  .bf-block-picker-item:hover {
    background: rgba(106,191,60,0.1);
    color: #a3e063;
  }

  .bf-kbd {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 4px;
    color: #4e5a6a;
    font-size: 10px;
    padding: 2px 6px;
    font-family: monospace;
  }
`

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyCanvas: React.FC<{ onAddBlock: (type: BlockType) => void; pickerOpen: boolean; setPickerOpen: (v: boolean) => void }> = ({
  onAddBlock, pickerOpen, setPickerOpen
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420, textAlign: 'center' }}>
    {/* Block stack illustration */}
    <div style={{ marginBottom: 28, position: 'relative', width: 80, height: 72 }}>
      {/* Stack of blocks */}
      {[
        { bottom: 0, left: 8, bg: '#1f3322', border: '#2d4d2a', size: 56 },
        { bottom: 14, left: 16, bg: '#1a2e1d', border: '#263d23', size: 48 },
        { bottom: 26, left: 22, bg: '#152619', border: '#1f3320', size: 38 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: b.bottom,
            left: b.left,
            width: b.size,
            height: b.size * 0.35,
            backgroundColor: b.bg,
            border: `1.5px solid ${b.border}`,
            borderRadius: 4,
          }}
        />
      ))}
      <div style={{ position: 'absolute', top: 0, left: 24, fontSize: 22 }}>⛏</div>
    </div>

    <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#c8d8b8', letterSpacing: '-0.4px' }}>
      Start building your form
    </h3>
    <p style={{ margin: '0 0 24px', fontSize: 13, color: '#4e5a6a', maxWidth: 280, lineHeight: 1.6 }}>
      Every great build starts with one block. Click a block from the library, or use the button below.
    </p>

    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setPickerOpen(!pickerOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#6abf3c',
          color: '#0d1117',
          border: 'none',
          borderRadius: 8,
          padding: '11px 20px',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif",
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(106,191,60,0.3)',
        }}
      >
        + Add Block
      </button>

      {pickerOpen && (
        <BlockPicker onAddBlock={(type) => { onAddBlock(type); setPickerOpen(false) }} />
      )}
    </div>

    <p style={{ margin: '12px 0 0', fontSize: 12, color: '#2d3741' }}>or drag a block here</p>
  </div>
)

// ─── Block Picker Popup ───────────────────────────────────────────────────────

const BlockPicker: React.FC<{ onAddBlock: (type: BlockType) => void }> = ({ onAddBlock }) => {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = BLOCK_TYPES.filter(b =>
    b.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bf-block-picker">
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #21262d' }}>
        <input
          ref={inputRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search blocks…"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#eceae4',
            fontSize: 13,
            fontFamily: "'Outfit', sans-serif",
          }}
        />
      </div>
      {filtered.map(b => (
        <div key={b.type} className="bf-block-picker-item" onClick={() => onAddBlock(b.type)}>
          <span style={{ fontSize: 16 }}>{b.icon}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Block Type Badge ─────────────────────────────────────────────────────────

const BlockTypeBadge: React.FC<{ type: BlockType }> = ({ type }) => {
  const bt = BLOCK_TYPES.find(b => b.type === type)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(106,191,60,0.1)', color: '#6abf3c', border: '1px solid rgba(106,191,60,0.2)', letterSpacing: '0.5px' }}>
      {bt?.icon} {bt?.label.toUpperCase()}
    </span>
  )
}

// ─── Form Block Card ──────────────────────────────────────────────────────────

interface BlockCardProps {
  block: FormBlock
  index: number
  selected: boolean
  isNew: boolean
  draggingId: string | null
  dropTarget: number | null
  onSelect: () => void
  onUpdate: (updates: Partial<FormBlock>) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onDragOver: (idx: number) => void
  onDrop: (idx: number) => void
  questionRef: (el: HTMLTextAreaElement | null) => void
}

const BlockCard: React.FC<BlockCardProps> = ({
  block, index, selected, isNew, draggingId, dropTarget,
  onSelect, onUpdate, onDelete, onDragStart, onDragEnd, onDragOver, onDrop,
  questionRef,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isDragging = draggingId === block.id
  const isDropTarget = dropTarget === index

  return (
    <div>
      {/* Drop indicator above */}
      <div className={`bf-drop-indicator ${isDropTarget ? 'active' : ''}`} />

      <div
        className={`bf-block-card ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isNew ? 'bf-block-card-enter' : ''}`}
        onClick={onSelect}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move'
          onDragStart()
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => { e.preventDefault(); onDragOver(index) }}
        onDrop={(e) => { e.preventDefault(); onDrop(index) }}
      >
        {/* Block header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Drag handle */}
            <span
              className="bf-drag-handle"
              onClick={(e) => e.stopPropagation()}
            >
              ⠿
            </span>
            <BlockTypeBadge type={block.type} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Required toggle */}
            <span style={{ fontSize: 11, color: '#4e5a6a', fontWeight: 600 }}>Required</span>
            <button
              className={`bf-toggle ${block.required ? 'on' : 'off'}`}
              onClick={(e) => { e.stopPropagation(); onUpdate({ required: !block.required }) }}
              title="Toggle required"
            />

            {/* Three-dot menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
                style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 16, padding: '2px 6px', borderRadius: 4 }}
              >
                ⋮
              </button>
              {menuOpen && (
                <div
                  style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: '#161b22', border: '1px solid #2d3741', borderRadius: 8, width: 160, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', overflow: 'hidden' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { label: 'Duplicate', icon: '⧉' },
                    { label: 'Move Up',   icon: '↑' },
                    { label: 'Move Down', icon: '↓' },
                  ].map(action => (
                    <button key={action.label} onClick={() => setMenuOpen(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: '9px 12px', color: '#c8d8b8', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif" }}>
                      <span style={{ width: 16 }}>{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                  <div style={{ borderTop: '1px solid #21262d', margin: '4px 0' }} />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete() }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: '9px 12px', color: '#f87171', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif" }}
                  >
                    <span style={{ width: 16 }}>🗑</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question input */}
        <div style={{ padding: '10px 14px 0' }}>
          <textarea
            ref={questionRef}
            className="bf-question-input"
            value={block.question}
            onChange={e => onUpdate({ question: e.target.value })}
            placeholder={`Enter your question here…`}
            rows={1}
            onClick={(e) => e.stopPropagation()}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#eceae4', fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", padding: 0, resize: 'none', lineHeight: 1.5, overflow: 'hidden' }}
          />
          <textarea
            className="bf-desc-input"
            value={block.description}
            onChange={e => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)"
            rows={1}
            onClick={(e) => e.stopPropagation()}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#6e7a8a', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: 0, resize: 'none', lineHeight: 1.4, overflow: 'hidden', marginTop: 4 }}
          />
        </div>

        {/* Field Preview */}
        <BlockFieldPreview block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

// ─── Block Field Preview ──────────────────────────────────────────────────────

const BlockFieldPreview: React.FC<{ block: FormBlock; onUpdate: (u: Partial<FormBlock>) => void }> = ({ block, onUpdate }) => {
  const style = {
    wrapper: { padding: '10px 14px 14px' },
    input: {
      width: '100%', padding: '9px 12px', backgroundColor: '#0d1117', border: '1px solid #21262d',
      borderRadius: 6, color: '#6e7a8a', fontSize: 13, fontFamily: "'Outfit', sans-serif",
      outline: 'none', boxSizing: 'border-box' as const,
    },
  }

  if (block.type === 'TEXT' || block.type === 'EMAIL' || block.type === 'DATE') {
    return (
      <div style={style.wrapper}>
        <input style={style.input} placeholder={block.placeholder || block.type === 'EMAIL' ? 'name@email.com' : 'Type your answer…'} readOnly />
      </div>
    )
  }

  if (block.type === 'NUMBER') {
    return (
      <div style={style.wrapper}>
        <input type="number" style={style.input} placeholder="0" readOnly />
      </div>
    )
  }

  if (block.type === 'SELECT' || block.type === 'CHECKBOX') {
    return (
      <div style={style.wrapper}>
        {block.options.map((opt, i) => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 16, height: 16, border: '1.5px solid #2d3741', borderRadius: block.type === 'CHECKBOX' ? 3 : 8, flexShrink: 0 }} />
            <input
              value={opt.value}
              onChange={e => {
                const newOpts = block.options.map((o, j) => j === i ? { ...o, value: e.target.value } : o)
                onUpdate({ options: newOpts })
              }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#8b9ab0', fontSize: 13, fontFamily: "'Outfit', sans-serif", flex: 1 }}
              placeholder={`Option ${i + 1}`}
            />
            <button
              onClick={(e) => { e.stopPropagation(); onUpdate({ options: block.options.filter((_, j) => j !== i) }) }}
              style={{ background: 'none', border: 'none', color: '#3d4f3e', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}
            >×</button>
          </div>
        ))}
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ options: [...block.options, { id: uid(), value: '' }] }) }}
          style={{ background: 'none', border: 'none', color: '#6abf3c', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 0', fontFamily: "'Outfit', sans-serif" }}
        >
          + Add option
        </button>
      </div>
    )
  }

  if (block.type === 'RATING') {
    return (
      <div style={style.wrapper}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: block.maxRating }).map((_, i) => (
            <span key={i} style={{ fontSize: 22, cursor: 'default', color: '#4e5a6a' }}>★</span>
          ))}
        </div>
      </div>
    )
  }

  return null
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

const RightPanel: React.FC<{ block: FormBlock | null; onUpdate: (u: Partial<FormBlock>) => void }> = ({ block, onUpdate }) => {
  if (!block) {
    return (
      <div style={{ flex: '0 0 296px', background: '#0f1419', borderLeft: '1px solid #21262d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>⚙️</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#3d4f3e', marginBottom: 6 }}>Block Settings</div>
        <div style={{ fontSize: 12, color: '#2d3741', lineHeight: 1.5 }}>Select a block to configure its settings</div>
      </div>
    )
  }

  const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#4e5a6a', marginBottom: 6, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{label}</div>
      {children}
    </div>
  )

  return (
    <div className="bf-right-panel" style={{ flex: '0 0 296px', background: '#0f1419', borderLeft: '1px solid #21262d', display: 'flex', flexDirection: 'column' }}>
      {/* Panel header */}
      <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>{BLOCK_TYPES.find(b => b.type === block.type)?.icon}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#eceae4' }}>Block Settings</div>
          <div style={{ fontSize: 10, color: '#4e5a6a', marginTop: 1 }}>{BLOCK_TYPES.find(b => b.type === block.type)?.description}</div>
        </div>
      </div>

      <div style={{ padding: '18px 18px', flex: 1 }}>
        <Row label="Question">
          <textarea
            className="bf-panel-input"
            value={block.question}
            onChange={e => onUpdate({ question: e.target.value })}
            placeholder="Enter your question"
            rows={2}
            style={{ width: '100%', background: '#0d1117', border: '1px solid #21262d', borderRadius: 6, color: '#eceae4', fontSize: 13, fontFamily: "'Outfit', sans-serif", padding: '8px 10px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </Row>

        <Row label="Description">
          <input className="bf-panel-input" value={block.description} onChange={e => onUpdate({ description: e.target.value })} placeholder="Helper text (optional)" />
        </Row>

        <Row label="Required">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className={`bf-toggle ${block.required ? 'on' : 'off'}`}
              onClick={() => onUpdate({ required: !block.required })}
            />
            <span style={{ fontSize: 12, color: block.required ? '#6abf3c' : '#4e5a6a', fontWeight: 600 }}>
              {block.required ? 'Required' : 'Optional'}
            </span>
          </div>
        </Row>

        {(block.type === 'TEXT' || block.type === 'EMAIL' || block.type === 'NUMBER') && (
          <Row label="Placeholder">
            <input className="bf-panel-input" value={block.placeholder} onChange={e => onUpdate({ placeholder: e.target.value })} placeholder="Placeholder text…" />
          </Row>
        )}

        {block.type === 'RATING' && (
          <Row label="Max Stars">
            <div style={{ display: 'flex', gap: 6 }}>
              {[3, 5, 7, 10].map(n => (
                <button
                  key={n}
                  onClick={() => onUpdate({ maxRating: n })}
                  style={{ padding: '5px 10px', background: block.maxRating === n ? '#6abf3c' : '#0d1117', border: `1px solid ${block.maxRating === n ? '#6abf3c' : '#21262d'}`, borderRadius: 5, color: block.maxRating === n ? '#0d1117' : '#8b9ab0', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
                >
                  {n}
                </button>
              ))}
            </div>
          </Row>
        )}

        {block.type === 'NUMBER' && (
          <>
            <Row label="Min Value">
              <input type="number" className="bf-panel-input" value={block.minValue ?? ''} onChange={e => onUpdate({ minValue: +e.target.value })} placeholder="No minimum" />
            </Row>
            <Row label="Max Value">
              <input type="number" className="bf-panel-input" value={block.maxValue ?? ''} onChange={e => onUpdate({ maxValue: +e.target.value })} placeholder="No maximum" />
            </Row>
          </>
        )}

        {(block.type === 'SELECT' || block.type === 'CHECKBOX') && (
          <Row label={`Options (${block.options.length})`}>
            {block.options.map((opt, i) => (
              <div key={opt.id} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input
                  className="bf-panel-input"
                  value={opt.value}
                  onChange={e => {
                    const newOpts = block.options.map((o, j) => j === i ? { ...o, value: e.target.value } : o)
                    onUpdate({ options: newOpts })
                  }}
                  style={{ flex: 1, background: '#0d1117', border: '1px solid #21262d', borderRadius: 6, color: '#eceae4', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }}
                  placeholder={`Option ${i + 1}`}
                />
                <button
                  onClick={() => onUpdate({ options: block.options.filter((_, j) => j !== i) })}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, color: '#f87171', cursor: 'pointer', padding: '0 8px', fontSize: 13 }}
                >×</button>
              </div>
            ))}
            <button
              onClick={() => onUpdate({ options: [...block.options, { id: uid(), value: '' }] })}
              style={{ background: 'none', border: 'none', color: '#6abf3c', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 0', fontFamily: "'Outfit', sans-serif" }}
            >
              + Add option
            </button>
          </Row>
        )}
      </div>
    </div>
  )
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export const BlockFormBuilder: React.FC<BlockFormBuilderProps> = ({ onClose }) => {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState('Untitled Form')
  const [editingTitle, setEditingTitle] = useState(false)
  const [blocks, setBlocks] = useState<FormBlock[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newBlockId, setNewBlockId] = useState<string | null>(null)
  const [librarySearch, setLibrarySearch] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [publishedFormId, setPublishedFormId] = useState<string | null>(null)

  const questionRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map())
  const titleInputRef = useRef<HTMLInputElement>(null)

  const { createFormAsync } = useCreateForm()
  const { bulkCreateFormFieldsAsync } = useBulkCreateFormFields()

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null

  // ── Block Operations ──────────────────────────────────────────────────────

  const addBlock = useCallback((type: BlockType) => {
    const block = createBlock(type)
    setBlocks(prev => [...prev, block])
    setSelectedId(block.id)
    setNewBlockId(block.id)
    setSaved(false)
    // focus question input after render
    setTimeout(() => {
      const el = questionRefs.current.get(block.id)
      if (el) { el.focus(); el.setSelectionRange(0, 0) }
    }, 50)
    setTimeout(() => setNewBlockId(null), 400)
  }, [])

  const updateBlock = useCallback((id: string, updates: Partial<FormBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    setSaved(false)
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      const newBlocks = prev.filter(b => b.id !== id)
      // select adjacent block
      if (newBlocks.length > 0) {
        setSelectedId(newBlocks[Math.max(0, idx - 1)]?.id ?? null)
      } else {
        setSelectedId(null)
      }
      return newBlocks
    })
    setSaved(false)
  }, [])

  // ── Drag Reorder ──────────────────────────────────────────────────────────

  const handleDrop = useCallback((targetIdx: number) => {
    if (!draggingId) return
    setBlocks(prev => {
      const from = prev.findIndex(b => b.id === draggingId)
      if (from === -1) return prev
      const copy = [...prev]
      const [moved] = copy.splice(from, 1)
      const to = targetIdx > from ? targetIdx - 1 : targetIdx
      copy.splice(to, 0, moved!)
      return copy
    })
    setDraggingId(null)
    setDropTarget(null)
    setSaved(false)
  }, [draggingId])

  // ── Publish ───────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!formTitle.trim()) { toast.error('Please enter a form title'); return }
    if (blocks.length === 0) { toast.error('Add at least one block before publishing'); return }
    setSaving(true)
    try {
      const { id: formId } = await createFormAsync({ title: formTitle.trim() })

      const fieldsToCreate = blocks.map((b, i) => ({
        label: b.question || `${BLOCK_TYPES.find(bt => bt.type === b.type)?.label || 'Field'} Question`,
        labelKey: labelKeyFromQuestion(b.question || b.type.toLowerCase(), i),
        description: b.description || '',
        placeholder: b.placeholder || undefined,
        isRequired: Boolean(b.required),
        index: String(i + 1),
        type: b.type as any,
      }))

      await bulkCreateFormFieldsAsync({
        formId,
        fields: fieldsToCreate,
      })

      setSaved(true)
      setPublishedFormId(formId)
      toast.success('🎉 Form published successfully!')
      onClose()
      router.push('/dashboard/forms')
    } catch (err: any) {
      console.error('Publish form error:', err)
      toast.error(err?.message || 'Failed to publish form')
    } finally {
      setSaving(false)
    }
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPickerOpen(v => !v)
      }
      if (e.key === 'Escape') {
        setPickerOpen(false)
        setMenuOpen(null)
        setPreviewModalOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const filteredLibrary = BLOCK_TYPES.filter(b =>
    b.label.toLowerCase().includes(librarySearch.toLowerCase())
  )

  return (
    <>
      <style>{builderStyles}</style>
      <div className="bf-overlay">

        {/* ── TOP NAV ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 52, borderBottom: '1px solid #21262d', background: '#0d1117', flexShrink: 0, gap: 16 }}>
          {/* Left: Logo + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 18, padding: '0 6px 0 0', lineHeight: 1 }}
              title="Close builder"
            >←</button>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#6abf3c', letterSpacing: '-0.5px', flexShrink: 0 }}>⛏ BlockForm</span>
            <div style={{ width: 1, height: 20, background: '#21262d' }} />
            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={formTitle}
                onChange={e => { setFormTitle(e.target.value); setSaved(false) }}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(106,191,60,0.4)', outline: 'none', color: '#eceae4', fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif", minWidth: 120, maxWidth: 280 }}
                autoFocus
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                style={{ background: 'none', border: 'none', color: '#c8d8b8', fontSize: 14, fontWeight: 700, cursor: 'text', fontFamily: "'Outfit', sans-serif", padding: 0 }}
              >
                {formTitle}
              </button>
            )}
          </div>

          {/* Center: Save status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: saved ? '#4e5a6a' : '#6abf3c', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: saved ? '#2d3741' : '#6abf3c', display: 'inline-block' }} />
            {saved ? 'Saved' : 'Unsaved changes'}
          </div>

          {/* Right: Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                if (blocks.length > 0) {
                  setPreviewModalOpen(true)
                } else {
                  toast.info('Add at least one block to preview')
                }
              }}
              style={{ background: 'none', border: '1px solid #21262d', borderRadius: 7, color: '#c8d8b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 14px', fontFamily: "'Outfit', sans-serif" }}
            >
              👁 Preview
            </button>
            <button
              style={{ background: 'none', border: '1px solid #21262d', borderRadius: 7, color: '#c8d8b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 14px', fontFamily: "'Outfit', sans-serif" }}
              onClick={() => {
                if (publishedFormId) {
                  navigator.clipboard.writeText(`${window.location.origin}/form/${publishedFormId}`)
                  toast.success('Form link copied to clipboard!')
                } else {
                  toast.info('Publish the form first to get a share link')
                }
              }}
            >
              Share
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              style={{
                background: saving ? '#2d3741' : 'linear-gradient(135deg, #6abf3c, #4d9e26)',
                border: 'none',
                borderRadius: 7,
                color: saving ? '#4e5a6a' : '#0d1117',
                fontSize: 13,
                fontWeight: 800,
                cursor: saving ? 'not-allowed' : 'pointer',
                padding: '7px 18px',
                fontFamily: "'Outfit', sans-serif",
                boxShadow: saving ? 'none' : '0 2px 12px rgba(106,191,60,0.35)',
              }}
            >
              {saving ? 'Publishing…' : '⬆ Publish'}
            </button>
          </div>
        </div>

        {/* ── THREE COLUMN WORKSPACE ──────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* LEFT — Block Library */}
          <div style={{ width: 240, background: '#0d1117', borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {/* Library header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #21262d' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#eceae4', marginBottom: 2 }}>Blocks</div>
              <div style={{ fontSize: 11, color: '#4e5a6a' }}>Click to add to form</div>
            </div>

            {/* Search */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid #21262d' }}>
              <input
                value={librarySearch}
                onChange={e => setLibrarySearch(e.target.value)}
                placeholder="Search blocks…"
                style={{ width: '100%', background: '#161b22', border: '1px solid #21262d', borderRadius: 6, color: '#c8d8b8', fontSize: 12, fontFamily: "'Outfit', sans-serif", padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Block list */}
            <div style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
              {filteredLibrary.map(bt => (
                <div
                  key={bt.type}
                  className="bf-library-item"
                  onClick={() => addBlock(bt.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('block-type', bt.type)
                  }}
                  title={bt.description}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{bt.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{bt.label}</div>
                    <div style={{ fontSize: 10, color: '#3d4f3e', marginTop: 1 }}>{bt.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Keyboard hint */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid #21262d' }}>
              <div style={{ fontSize: 10, color: '#2d3741', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="bf-kbd">⌘K</span>
                <span>Quick add block</span>
              </div>
            </div>
          </div>

          {/* CENTER — Form Canvas */}
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0b0f14' }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              const blockType = e.dataTransfer.getData('block-type') as BlockType
              if (blockType) addBlock(blockType)
            }}
          >
            {/* Canvas toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 28px', borderBottom: '1px solid #21262d', flexShrink: 0, backgroundColor: '#0b0f14' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#c8d8b8' }}>Build your form</div>
                <div style={{ fontSize: 11, color: '#4e5a6a', marginTop: 1 }}>Add blocks and arrange them in the order you want.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#4e5a6a' }}>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
                <div style={{ width: 1, height: 16, background: '#21262d' }} />
                <span className="bf-kbd">⌘Z</span>
                <span style={{ fontSize: 10, color: '#2d3741' }}>Undo</span>
              </div>
            </div>

            {/* Scrollable canvas */}
            <div
              className="bf-canvas-area"
              onClick={() => { setSelectedId(null); setPickerOpen(false) }}
            >
              {blocks.length === 0 ? (
                <EmptyCanvas onAddBlock={addBlock} pickerOpen={pickerOpen} setPickerOpen={setPickerOpen} />
              ) : (
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                  {blocks.map((block, idx) => (
                    <BlockCard
                      key={block.id}
                      block={block}
                      index={idx}
                      selected={selectedId === block.id}
                      isNew={newBlockId === block.id}
                      draggingId={draggingId}
                      dropTarget={dropTarget}
                      onSelect={() => { setSelectedId(block.id); setPickerOpen(false) }}
                      onUpdate={updates => updateBlock(block.id, updates)}
                      onDelete={() => deleteBlock(block.id)}
                      onDragStart={() => setDraggingId(block.id)}
                      onDragEnd={() => { setDraggingId(null); setDropTarget(null) }}
                      onDragOver={targetIdx => setDropTarget(targetIdx)}
                      onDrop={targetIdx => handleDrop(targetIdx)}
                      questionRef={el => {
                        if (el) questionRefs.current.set(block.id, el)
                        else questionRefs.current.delete(block.id)
                      }}
                    />
                  ))}

                  {/* Add Block button at bottom of canvas */}
                  <div style={{ position: 'relative', marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPickerOpen(!pickerOpen) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#161b22',
                        border: '1.5px dashed #2d3741',
                        borderRadius: 8,
                        color: '#4e5a6a',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '10px 24px',
                        fontFamily: "'Outfit', sans-serif",
                        transition: 'all 0.15s',
                        width: '100%',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#6abf3c'
                        ;(e.currentTarget as HTMLElement).style.color = '#6abf3c'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#2d3741'
                        ;(e.currentTarget as HTMLElement).style.color = '#4e5a6a'
                      }}
                    >
                      + Add Block
                    </button>
                    {pickerOpen && (
                      <BlockPicker onAddBlock={type => { addBlock(type); setPickerOpen(false) }} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Properties Panel */}
          <RightPanel block={selectedBlock} onUpdate={updates => selectedId && updateBlock(selectedId, updates)} />
        </div>
      </div>

      {/* Live Form Preview Modal */}
      {previewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(11,15,20,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 580,
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#161b22',
              border: '1px solid #21262d',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #21262d', paddingBottom: 16, marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#6abf3c', letterSpacing: '0.5px' }}>LIVE PREVIEW</span>
                <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: '#eceae4' }}>{formTitle}</h2>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#6e7a8a', fontSize: 20, cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); toast.success('Form response preview submitted!') }}>
              {blocks.map((block, idx) => (
                <div key={block.id} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#c8d8b8', marginBottom: 6 }}>
                    {idx + 1}. {block.question || 'Untitled Question'} {block.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  {block.description && (
                    <div style={{ fontSize: 12, color: '#4e5a6a', marginBottom: 6 }}>{block.description}</div>
                  )}

                  {block.type === 'SELECT' || block.type === 'CHECKBOX' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(block.options || []).map((opt) => (
                        <label
                          key={opt.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: 6, color: '#eceae4', fontSize: 13, cursor: 'pointer' }}
                        >
                          <input type={block.type === 'CHECKBOX' ? 'checkbox' : 'radio'} name={block.id} value={opt.value} />
                          {opt.value || 'Option'}
                        </label>
                      ))}
                    </div>
                  ) : block.type === 'RATING' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {Array.from({ length: block.maxRating || 5 }).map((_, i) => (
                        <span key={i} style={{ fontSize: 24, color: '#4e5a6a', cursor: 'pointer' }}>★</span>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={block.type === 'NUMBER' ? 'number' : block.type === 'EMAIL' ? 'email' : block.type === 'DATE' ? 'date' : 'text'}
                      placeholder={block.placeholder || 'Type response...'}
                      required={block.required}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#0d1117',
                        border: '1px solid #21262d',
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#6abf3c',
                  color: '#0d1117',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: 12,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Submit Response Preview
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
