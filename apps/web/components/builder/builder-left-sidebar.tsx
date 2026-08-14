'use client'

import React from 'react'

export type BlockType =
  | 'TEXT'
  | 'EMAIL'
  | 'NUMBER'
  | 'SELECT'
  | 'CHECKBOX'
  | 'RATING'
  | 'DATE'
  | 'TEXTAREA'

export interface SelectOption {
  id: string
  value: string
}

export interface BlockConfigItem {
  type: BlockType
  icon: string
  label: string
  description: string
  category: 'input' | 'choice' | 'advanced'
}

export const BLOCK_CONFIGS: BlockConfigItem[] = [
  { type: 'TEXT', icon: '📝', label: 'Text', description: 'Single line text input', category: 'input' },
  { type: 'EMAIL', icon: '✉️', label: 'Email', description: 'Email address field', category: 'input' },
  { type: 'NUMBER', icon: '🔢', label: 'Number', description: 'Numeric input with optional min/max', category: 'input' },
  { type: 'SELECT', icon: '📋', label: 'Dropdown / Select', description: 'Single choice from list', category: 'choice' },
  { type: 'CHECKBOX', icon: '☑️', label: 'Checkboxes', description: 'Multiple selection options', category: 'choice' },
]

interface BuilderLeftSidebarProps {
  searchFilter: string
  setSearchFilter: (value: string) => void
  onAddBlock: (blockType: BlockType) => void
}

export function BuilderLeftSidebar({
  searchFilter,
  setSearchFilter,
  onAddBlock,
}: BuilderLeftSidebarProps) {
  const filteredBlocks = BLOCK_CONFIGS.filter(
    (b) =>
      b.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.description.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <aside
      style={{
        width: 280,
        backgroundColor: '#0f1419',
        borderRight: '1px solid #21262d',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #21262d' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
          Field Blocks Palette
        </div>
        <input
          type="text"
          placeholder="Search blocks..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: 6,
            fontSize: 12,
            color: '#eceae4',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: "'Outfit', sans-serif",
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: '#4e5a6a',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Drag or Click to Add
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredBlocks.map((b) => (
            <div
              key={b.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', b.type)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onClick={() => onAddBlock(b.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                backgroundColor: '#161b22',
                border: '1px solid #21262d',
                borderRadius: 10,
                cursor: 'grab',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(106,191,60,0.4)'
                e.currentTarget.style.backgroundColor = '#1c232d'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#21262d'
                e.currentTarget.style.backgroundColor = '#161b22'
              }}
            >
              <div style={{ fontSize: 20 }}>{b.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#eceae4' }}>{b.label}</div>
                <div style={{ fontSize: 11, color: '#6e7a8a' }}>{b.description}</div>
              </div>
              <div style={{ color: '#4e5a6a', fontSize: 14 }}>+</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #21262d', fontSize: 11, color: '#4e5a6a', textAlign: 'center' }}>
        💡 Tip: Drag blocks onto the workflow canvas or click to add.
      </div>
    </aside>
  )
}
