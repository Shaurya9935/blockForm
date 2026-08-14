'use client'

import React, { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { BLOCK_CONFIGS, type BlockType } from './builder-left-sidebar'
import type { FormBlockData } from './builder-right-sidebar'

// ─── Custom Nodes ─────────────────────────────────────────────────────────────

const StartNodeComponent: React.FC<NodeProps> = ({ data }) => {
  const title = (data?.title as string) || 'Form Start'
  const desc = (data?.description as string) || 'User begins form submission flow'

  return (
    <div
      style={{
        width: 280,
        backgroundColor: '#0d131a',
        border: '2px solid #6abf3c',
        borderRadius: 14,
        padding: '16px 18px',
        boxShadow: '0 8px 32px rgba(106,191,60,0.15)',
        color: '#eceae4',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(106,191,60,0.15)',
            border: '1px solid rgba(106,191,60,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🚀
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#6abf3c', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Workflow Trigger
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>{title}</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: '#8b9ab0', lineHeight: 1.4 }}>{desc}</p>
      <Handle
        type="source"
        position={Position.Right}
        id="start-out"
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#6abf3c',
          border: '2px solid #0d131a',
        }}
      />
    </div>
  )
}

const DEFAULT_CONFIG = BLOCK_CONFIGS[0]!

const FieldNodeComponent: React.FC<NodeProps> = ({ id, data, selected }) => {
  const blockData = data as unknown as FormBlockData
  const config = BLOCK_CONFIGS.find((b) => b.type === blockData.type) ?? DEFAULT_CONFIG

  const onSelectNode = data?.onSelectNode as ((id: string) => void) | undefined
  const onDeleteNode = data?.onDeleteNode as ((id: string) => void) | undefined
  const onMoveNodeUp = data?.onMoveNodeUp as ((id: string) => void) | undefined
  const onMoveNodeDown = data?.onMoveNodeDown as ((id: string) => void) | undefined

  return (
    <div
      onClick={() => onSelectNode?.(id)}
      style={{
        width: 320,
        backgroundColor: '#161b22',
        border: selected ? '2px solid #6abf3c' : '1.5px solid #21262d',
        borderRadius: 14,
        boxShadow: selected ? '0 0 0 4px rgba(106,191,60,0.18), 0 12px 36px rgba(0,0,0,0.6)' : '0 8px 24px rgba(0,0,0,0.4)',
        transition: 'all 0.15s ease',
        color: '#eceae4',
        fontFamily: "'Outfit', sans-serif",
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="field-in"
        style={{
          width: 10,
          height: 10,
          backgroundColor: selected ? '#6abf3c' : '#4e5a6a',
          border: '2px solid #161b22',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          backgroundColor: '#0d1117',
          borderBottom: '1px solid #21262d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            Step {blockData.index}
          </span>
          <span style={{ fontSize: 14 }}>{config.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#c8d8b8' }}>{config.label}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {blockData.isRequired && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: 4 }}>
              *Req
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onMoveNodeUp?.(id) }}
            title="Move Left"
            style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 12, padding: '2px 4px' }}
          >
            ◄
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveNodeDown?.(id) }}
            title="Move Right"
            style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 12, padding: '2px 4px' }}
          >
            ►
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteNode?.(id) }}
            title="Delete Block"
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 13, padding: '2px 4px', marginLeft: 4 }}
          >
            🗑
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
          {blockData.label || 'Untitled Question'}
        </div>
        {blockData.description && (
          <div style={{ fontSize: 11, color: '#6e7a8a', marginBottom: 10, lineHeight: 1.4 }}>
            {blockData.description}
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          {(blockData.type === 'TEXT' || blockData.type === 'EMAIL' || blockData.type === 'TEXTAREA' || blockData.type === 'DATE') && (
            <div
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: 6,
                fontSize: 12,
                color: '#4e5a6a',
                boxSizing: 'border-box',
              }}
            >
              {blockData.placeholder || (blockData.type === 'EMAIL' ? 'name@example.com' : 'User input preview...')}
            </div>
          )}

          {blockData.type === 'NUMBER' && (
            <div
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: 6,
                fontSize: 12,
                color: '#4e5a6a',
              }}
            >
              0 {blockData.minValue !== undefined ? `(Min: ${blockData.minValue})` : ''}
            </div>
          )}

          {(blockData.type === 'SELECT' || blockData.type === 'CHECKBOX') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(blockData.options || []).slice(0, 3).map((opt, i) => (
                <div key={opt.id || i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8b9ab0' }}>
                  <div style={{ width: 12, height: 12, border: '1px solid #2d3741', borderRadius: blockData.type === 'CHECKBOX' ? 3 : 6 }} />
                  <span>{opt.value || `Option ${i + 1}`}</span>
                </div>
              ))}
              {(blockData.options || []).length > 3 && (
                <div style={{ fontSize: 10, color: '#4e5a6a' }}>+{(blockData.options || []).length - 3} more options</div>
              )}
            </div>
          )}

          {blockData.type === 'RATING' && (
            <div style={{ display: 'flex', gap: 4, color: '#fbbf24', fontSize: 16 }}>
              {Array.from({ length: Math.min(blockData.maxRating || 5, 5) }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="field-out"
        style={{
          width: 10,
          height: 10,
          backgroundColor: selected ? '#6abf3c' : '#4e5a6a',
          border: '2px solid #161b22',
        }}
      />
    </div>
  )
}

const EndNodeComponent: React.FC<NodeProps> = ({ data }) => {
  const title = (data?.title as string) || 'Submission Complete'

  return (
    <div
      style={{
        width: 280,
        backgroundColor: '#0d131a',
        border: '2px solid #3b82f6',
        borderRadius: 14,
        padding: '16px 18px',
        boxShadow: '0 8px 32px rgba(59,130,246,0.15)',
        color: '#eceae4',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="end-in"
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#3b82f6',
          border: '2px solid #0d131a',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🎯
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#3b82f6', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Form End
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>{title}</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: '#8b9ab0' }}>Display thank-you message & collect response.</p>
    </div>
  )
}

// ─── Component Props ─────────────────────────────────────────────────────────

interface WorkflowMiddleSectionProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange<Node>
  onEdgesChange: OnEdgesChange<Edge>
  onConnect: OnConnect
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
}

export function WorkflowMiddleSection({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDragOver,
  onDrop,
}: WorkflowMiddleSectionProps) {
  const nodeTypes = useMemo(
    () => ({
      startNode: StartNodeComponent,
      fieldNode: FieldNodeComponent,
      endNode: EndNodeComponent,
    }),
    []
  )

  const fieldCount = nodes.filter((n) => n.type === 'fieldNode').length

  return (
    <div
      style={{ flex: 1, height: '100%', position: 'relative', overflow: 'hidden' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: '#0b0f14' }}
      >
        <Background color="#1b222c" gap={20} size={1} variant={BackgroundVariant.Dots} />
        <Controls
          style={{ backgroundColor: '#161b22', borderColor: '#21262d', color: '#eceae4', fill: '#eceae4' }}
        />
        <MiniMap
          style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}
          nodeColor="#6abf3c"
          maskColor="rgba(11, 15, 20, 0.7)"
        />

        <Panel position="top-right" style={{ background: 'none' }}>
          <div
            style={{
              backgroundColor: '#161b22',
              border: '1px solid #21262d',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              color: '#8b9ab0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Blocks: <strong style={{ color: '#6abf3c' }}>{fieldCount}</strong>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
