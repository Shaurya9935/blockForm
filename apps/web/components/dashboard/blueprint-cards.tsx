'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BLUEPRINTS, type BlueprintDefinition } from '~/lib/blueprints'

export { BLUEPRINTS }

export function BlueprintCard({ bp }: { bp: BlueprintDefinition }) {
  const router = useRouter()
  const [hov, setHov] = useState(false)

  const handleUseBlueprint = () => {
    router.push(`/dashboard/forms/builder?blueprint=${bp.id}`)
  }

  return (
    <div
      onClick={handleUseBlueprint}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#161b22',
        border: `1px solid ${hov ? bp.accent + '55' : '#21262d'}`,
        borderRadius: 12,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? `0 8px 24px ${bp.accent}18` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: bp.accent + '14',
            border: `1px solid ${bp.accent}28`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {bp.emoji}
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: bp.accent,
            backgroundColor: bp.accent + '15',
            border: `1px solid ${bp.accent}30`,
            padding: '3px 8px',
            borderRadius: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {bp.fieldsCount} Blocks
        </span>
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#eceae4', marginBottom: 5 }}>{bp.name}</div>
        <div style={{ fontSize: 12, color: '#6e7a8a', lineHeight: 1.55 }}>{bp.desc}</div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          handleUseBlueprint()
        }}
        style={{
          marginTop: 'auto',
          backgroundColor: hov ? bp.accent + '22' : 'transparent',
          border: `1px solid ${hov ? bp.accent + '66' : '#2d3741'}`,
          color: hov ? bp.accent : '#8b9ab0',
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif",
          cursor: 'pointer',
          transition: 'all 0.2s',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <span>Use Starter Pack</span>
        <span>→</span>
      </button>
    </div>
  )
}

