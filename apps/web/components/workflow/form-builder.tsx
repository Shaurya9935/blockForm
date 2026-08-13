'use client'

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { toast } from 'sonner'
import {
  useGetForm,
  useGetFormFields,
  useBulkCreateFormFields,
  useUpdateFormField,
  useDeleteFormField,
} from '~/hooks/api/form'

// ─── Block Types & Config ───────────────────────────────────────────────────

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

export interface FormBlockData {
  fieldId?: string
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
  [key: string]: unknown
}

const BLOCK_CONFIGS: {
  type: BlockType
  icon: string
  label: string
  description: string
  category: 'input' | 'choice' | 'advanced'
}[] = [
  { type: 'TEXT', icon: '📝', label: 'Short Text', description: 'Single line text input', category: 'input' },
  { type: 'TEXTAREA', icon: '💬', label: 'Long Text', description: 'Multi-line paragraph text', category: 'input' },
  { type: 'EMAIL', icon: '✉️', label: 'Email', description: 'Email address field', category: 'input' },
  { type: 'NUMBER', icon: '🔢', label: 'Number', description: 'Numeric input with optional min/max', category: 'input' },
  { type: 'SELECT', icon: '📋', label: 'Dropdown / Select', description: 'Single choice from list', category: 'choice' },
  { type: 'CHECKBOX', icon: '☑️', label: 'Checkboxes', description: 'Multiple selection options', category: 'choice' },
  { type: 'RATING', icon: '⭐', label: 'Star Rating', description: 'Star scale rating field', category: 'advanced' },
  { type: 'DATE', icon: '📅', label: 'Date Picker', description: 'Select calendar date', category: 'advanced' },
]

const uid = () => Math.random().toString(36).slice(2, 9)

const generateLabelKey = (label: string, fallbackIdx: number) => {
  const clean = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return clean || `field_${fallbackIdx + 1}`
}

// ─── Custom Nodes ─────────────────────────────────────────────────────────────

// 1. Start Node
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

// 2. Field Block Node
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

      {/* Node Header */}
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

      {/* Node Body / Field Question */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
          {blockData.label || 'Untitled Question'}
        </div>
        {blockData.description && (
          <div style={{ fontSize: 11, color: '#6e7a8a', marginBottom: 10, lineHeight: 1.4 }}>
            {blockData.description}
          </div>
        )}

        {/* Live Field Preview */}
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
              {blockData.options.slice(0, 3).map((opt, i) => (
                <div key={opt.id || i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8b9ab0' }}>
                  <div style={{ width: 12, height: 12, border: '1px solid #2d3741', borderRadius: blockData.type === 'CHECKBOX' ? 3 : 6 }} />
                  <span>{opt.value || `Option ${i + 1}`}</span>
                </div>
              ))}
              {blockData.options.length > 3 && (
                <div style={{ fontSize: 10, color: '#4e5a6a' }}>+{blockData.options.length - 3} more options</div>
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

// 3. End Node
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

// ─── Main Flow Inner Component ────────────────────────────────────────────────

interface WorkflowCanvasProps {
  formId?: string
}

function WorkflowCanvas({ formId }: WorkflowCanvasProps) {
  const router = useRouter()
  const reactFlowInstance = useReactFlow()

  // API Hooks
  const { form, isLoading: formLoading } = useGetForm(formId || '')
  const { fields, isLoading: fieldsLoading } = useGetFormFields(formId || '')
  const { bulkCreateFormFieldsAsync, isPending: isSavingFields } = useBulkCreateFormFields()
  const { deleteFormFieldAsync } = useDeleteFormField()

  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('Untitled Form Workflow')
  const [searchFilter, setSearchFilter] = useState('')

  // Define nodeTypes inside useMemo to prevent re-creation
  const nodeTypes = useMemo(
    () => ({
      startNode: StartNodeComponent,
      fieldNode: FieldNodeComponent,
      endNode: EndNodeComponent,
    }),
    []
  )

  // Sync form title
  useEffect(() => {
    if (form?.title) {
      setFormTitle(form.title)
    }
  }, [form])

  // Select Node Handler
  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id)
  }, [])

  // Delete Node Handler
  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const filtered = nds.filter((n) => n.id !== id)
        // Re-index remaining field nodes
        let step = 1
        return filtered.map((n) => {
          if (n.type === 'fieldNode') {
            const data = n.data as unknown as FormBlockData
            const newIndex = step++
            return {
              ...n,
              data: { ...data, index: newIndex },
            }
          }
          return n
        })
      })
      setSelectedNodeId((prev) => (prev === id ? null : prev))
      toast.success('Block removed from workflow')
    },
    [setNodes]
  )

  // Move Node Up Handler
  const handleMoveNodeUp = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const fieldIndices = nds
          .map((n, idx) => (n.type === 'fieldNode' ? idx : -1))
          .filter((i) => i !== -1)
        const currentFieldIdxPos = fieldIndices.findIndex((i) => nds[i]?.id === id)
        if (currentFieldIdxPos <= 0) return nds // already top

        const swapIdx1 = fieldIndices[currentFieldIdxPos - 1]
        const swapIdx2 = fieldIndices[currentFieldIdxPos]

        if (swapIdx1 === undefined || swapIdx2 === undefined) return nds

        const newNds = [...nds]
        const tempPos = { ...newNds[swapIdx1]!.position }
        newNds[swapIdx1]!.position = { ...newNds[swapIdx2]!.position }
        newNds[swapIdx2]!.position = tempPos

        const temp = newNds[swapIdx1]!
        newNds[swapIdx1] = newNds[swapIdx2]!
        newNds[swapIdx2] = temp

        // Re-index step numbers
        let step = 1
        return newNds.map((n) => {
          if (n.type === 'fieldNode') {
            const data = n.data as unknown as FormBlockData
            return { ...n, data: { ...data, index: step++ } }
          }
          return n
        })
      })
    },
    [setNodes]
  )

  // Move Node Down Handler
  const handleMoveNodeDown = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const fieldIndices = nds
          .map((n, idx) => (n.type === 'fieldNode' ? idx : -1))
          .filter((i) => i !== -1)
        const currentFieldIdxPos = fieldIndices.findIndex((i) => nds[i]?.id === id)
        if (currentFieldIdxPos === -1 || currentFieldIdxPos >= fieldIndices.length - 1) return nds // already bottom

        const swapIdx1 = fieldIndices[currentFieldIdxPos]
        const swapIdx2 = fieldIndices[currentFieldIdxPos + 1]

        if (swapIdx1 === undefined || swapIdx2 === undefined) return nds

        const newNds = [...nds]
        const tempPos = { ...newNds[swapIdx1]!.position }
        newNds[swapIdx1]!.position = { ...newNds[swapIdx2]!.position }
        newNds[swapIdx2]!.position = tempPos

        const temp = newNds[swapIdx1]!
        newNds[swapIdx1] = newNds[swapIdx2]!
        newNds[swapIdx2] = temp

        // Re-index step numbers
        let step = 1
        return newNds.map((n) => {
          if (n.type === 'fieldNode') {
            const data = n.data as unknown as FormBlockData
            return { ...n, data: { ...data, index: step++ } }
          }
          return n
        })
      })
    },
    [setNodes]
  )

  // Helper to construct edges for sequential flow
  const buildSequentialEdges = useCallback((nodesList: Node[]): Edge[] => {
    const newEdges: Edge[] = []
    const fieldNodes = nodesList.filter((n) => n.type === 'fieldNode')

    if (nodesList.find((n) => n.id === 'start-node')) {
      const targetId = fieldNodes.length > 0 ? fieldNodes[0]!.id : 'end-node'
      newEdges.push({
        id: `e-start-${targetId}`,
        source: 'start-node',
        sourceHandle: 'start-out',
        target: targetId,
        targetHandle: targetId === 'end-node' ? 'end-in' : 'field-in',
        animated: true,
        style: { stroke: '#6abf3c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
      })
    }

    for (let i = 0; i < fieldNodes.length; i++) {
      const current = fieldNodes[i]!
      const next = i < fieldNodes.length - 1 ? fieldNodes[i + 1]! : nodesList.find((n) => n.id === 'end-node')
      if (next) {
        newEdges.push({
          id: `e-${current.id}-${next.id}`,
          source: current.id,
          sourceHandle: 'field-out',
          target: next.id,
          targetHandle: next.id === 'end-node' ? 'end-in' : 'field-in',
          animated: true,
          style: { stroke: '#6abf3c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
        })
      }
    }

    return newEdges
  }, [])

  // Auto Layout Handler
  const handleAutoLayout = useCallback(() => {
    setNodes((nds) => {
      let currentX = 80
      const startN = nds.find((n) => n.id === 'start-node')
      const fieldNs = nds.filter((n) => n.type === 'fieldNode')
      const endN = nds.find((n) => n.id === 'end-node')

      const updatedNodes: Node[] = []

      if (startN) {
        updatedNodes.push({ ...startN, position: { x: currentX, y: 180 } })
        currentX += 340
      }

      fieldNs.forEach((fn) => {
        updatedNodes.push({ ...fn, position: { x: currentX, y: 180 } })
        currentX += 380
      })

      if (endN) {
        updatedNodes.push({ ...endN, position: { x: currentX, y: 180 } })
      }

      setEdges(buildSequentialEdges(updatedNodes))
      return updatedNodes
    })
    toast.success('Workflow auto-aligned left to right')
  }, [setNodes, setEdges, buildSequentialEdges])

  // Populate nodes from API fields or default template
  useEffect(() => {
    if (fieldsLoading) return

    const initialNodes: Node[] = [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 80, y: 180 },
        data: { title: form?.title || 'Form Entry', description: 'Respondent starts here' },
        deletable: false,
      },
    ]

    let currentX = 420
    let stepCount = 1

    if (fields && fields.length > 0) {
      fields.forEach((f) => {
        const fieldNodeId = `node-${f.id}`
        const config = (f.config as any) || {}
        const posX = f.workflowX ?? currentX
        const posY = f.workflowY ?? 180

        initialNodes.push({
          id: fieldNodeId,
          type: 'fieldNode',
          position: { x: posX, y: posY },
          data: {
            fieldId: f.id,
            label: f.label,
            labelKey: f.labelKey,
            type: (f.type as BlockType) || 'TEXT',
            description: f.description || '',
            placeholder: f.placeholder || '',
            isRequired: f.isRequired,
            index: stepCount++,
            options: config.options || [{ id: uid(), value: 'Option 1' }, { id: uid(), value: 'Option 2' }],
            maxRating: config.maxRating || 5,
            minValue: config.minValue,
            maxValue: config.maxValue,
            onSelectNode: handleSelectNode,
            onDeleteNode: handleDeleteNode,
            onMoveNodeUp: handleMoveNodeUp,
            onMoveNodeDown: handleMoveNodeDown,
          },
        })
        currentX = Math.max(currentX + 380, posX + 380)
      })
    } else {
      // Starter demo node
      const demoFieldId = `node-${uid()}`
      initialNodes.push({
        id: demoFieldId,
        type: 'fieldNode',
        position: { x: currentX, y: 180 },
        data: {
          label: 'Full Name',
          labelKey: 'full_name',
          type: 'TEXT',
          description: 'Please enter your legal name',
          placeholder: 'John Doe',
          isRequired: true,
          index: stepCount++,
          options: [],
          maxRating: 5,
          onSelectNode: handleSelectNode,
          onDeleteNode: handleDeleteNode,
          onMoveNodeUp: handleMoveNodeUp,
          onMoveNodeDown: handleMoveNodeDown,
        },
      })
      currentX += 380
    }

    initialNodes.push({
      id: 'end-node',
      type: 'endNode',
      position: { x: currentX, y: 180 },
      data: { title: 'Form Completed' },
      deletable: false,
    })

    setNodes(initialNodes)
    setEdges(buildSequentialEdges(initialNodes))
  }, [fields, fieldsLoading, form?.title, handleSelectNode, handleDeleteNode, handleMoveNodeUp, handleMoveNodeDown, buildSequentialEdges, setNodes, setEdges])

  // Update edges whenever nodes order changes
  useEffect(() => {
    setEdges(buildSequentialEdges(nodes))
  }, [nodes, buildSequentialEdges, setEdges])

  // Connect edges manually handler
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#6abf3c', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
          },
          eds
        )
      ),
    [setEdges]
  )

  // Drag & Drop Add Block handler from Sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const addBlockToCanvas = useCallback(
    (blockType: BlockType, position?: { x: number; y: number }) => {
      const config = BLOCK_CONFIGS.find((b) => b.type === blockType)
      const newNodeId = `node-${uid()}`

      setNodes((nds) => {
        const fieldNodes = nds.filter((n) => n.type === 'fieldNode')
        const nextIndex = fieldNodes.length + 1

        let dropPos = position
        if (!dropPos) {
          const lastFieldPos = fieldNodes.length > 0 ? fieldNodes[fieldNodes.length - 1]!.position : { x: 80, y: 180 }
          dropPos = { x: lastFieldPos.x + 380, y: lastFieldPos.y }
        }

        const newNode: Node = {
          id: newNodeId,
          type: 'fieldNode',
          position: dropPos,
          data: {
            label: `${config?.label || 'New'} Question`,
            labelKey: generateLabelKey(config?.label || 'field', nextIndex),
            type: blockType,
            description: '',
            placeholder: '',
            isRequired: false,
            index: nextIndex,
            options: blockType === 'SELECT' || blockType === 'CHECKBOX'
              ? [{ id: uid(), value: 'Option 1' }, { id: uid(), value: 'Option 2' }]
              : [],
            maxRating: 5,
            onSelectNode: handleSelectNode,
            onDeleteNode: handleDeleteNode,
            onMoveNodeUp: handleMoveNodeUp,
            onMoveNodeDown: handleMoveNodeDown,
          },
        }

        // Shift end node right if needed
        const updated = nds.map((n) => (n.id === 'end-node' ? { ...n, position: { x: n.position.x + 380, y: n.position.y } } : n))
        const endNodeIdx = updated.findIndex((n) => n.id === 'end-node')

        if (endNodeIdx !== -1) {
          updated.splice(endNodeIdx, 0, newNode)
        } else {
          updated.push(newNode)
        }

        return updated
      })

      setSelectedNodeId(newNodeId)
      toast.success(`Added ${config?.label || blockType} block`)
    },
    [setNodes, handleSelectNode, handleDeleteNode, handleMoveNodeUp, handleMoveNodeDown]
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const blockType = event.dataTransfer.getData('application/reactflow') as BlockType
      if (!blockType) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addBlockToCanvas(blockType, position)
    },
    [reactFlowInstance, addBlockToCanvas]
  )

  // Selected Node Data reference
  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId])
  const selectedBlockData = (selectedNode?.data as unknown as FormBlockData) || null

  // Update selected block data
  const handleUpdateSelectedNode = useCallback(
    (updates: Partial<FormBlockData>) => {
      if (!selectedNodeId) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === selectedNodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                ...updates,
              },
            }
          }
          return n
        })
      )
    },
    [selectedNodeId, setNodes]
  )

  // Save Workflow handler
  const handleSaveWorkflow = async () => {
    if (!formId) {
      toast.success('Workflow draft updated!')
      return
    }

    const fieldNodes = nodes.filter((n) => n.type === 'fieldNode')
    if (fieldNodes.length === 0) {
      toast.error('Add at least one field block to save the workflow')
      return
    }

    try {
      const validTypes = ['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD', 'SELECT', 'CHECKBOX', 'RATING', 'DATE']

      const payloadFields = fieldNodes.map((n, idx) => {
        const d = n.data as unknown as FormBlockData
        const rawType = String(d.type || 'TEXT').toUpperCase()
        const fieldType = validTypes.includes(rawType) ? rawType : 'TEXT'
        const label = (d.label || `Question ${idx + 1}`).trim().slice(0, 100)
        const labelKey = (d.labelKey || generateLabelKey(label, idx)).trim().slice(0, 100)
        const description = (d.description || '').trim().slice(0, 300)
        const placeholder = d.placeholder ? String(d.placeholder).trim() : null

        const config = {
          options: d.options || [],
          maxRating: d.maxRating,
          minValue: d.minValue,
          maxValue: d.maxValue,
        }

        return {
          label: label || `Question ${idx + 1}`,
          labelKey: labelKey || `field_${idx + 1}`,
          type: fieldType as any,
          description,
          placeholder,
          isRequired: Boolean(d.isRequired),
          index: String(idx + 1),
          config,
          workflowX: Math.round(n.position.x),
          workflowY: Math.round(n.position.y),
        }
      })

      await bulkCreateFormFieldsAsync({
        formId,
        fields: payloadFields,
      })

      toast.success('Form workflow saved successfully!')
    } catch (err: any) {
      console.error('Save workflow error:', err)
      toast.error(err?.message || 'Failed to save workflow')
    }
  }

  const filteredBlocks = BLOCK_CONFIGS.filter((b) =>
    b.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.description.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0b0f14', color: '#eceae4', fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Header Bar */}
      <header
        style={{
          height: 60,
          backgroundColor: '#0f1419',
          borderBottom: '1px solid #21262d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => router.push(formId ? `/dashboard/forms?id=${formId}` : '/dashboard/forms')}
            style={{
              backgroundColor: '#161b22',
              color: '#8b9ab0',
              border: '1px solid #21262d',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Back
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
              {formTitle}
            </div>
            <div style={{ fontSize: 11, color: '#6abf3c', fontWeight: 600 }}>
              Interactive React Flow Workflow Designer
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleAutoLayout}
            style={{
              backgroundColor: '#161b22',
              color: '#a3e063',
              border: '1px solid rgba(106,191,60,0.3)',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ⚡ Auto-Layout Flow
          </button>

          <button
            onClick={handleSaveWorkflow}
            disabled={isSavingFields}
            style={{
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 800,
              cursor: isSavingFields ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(106,191,60,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isSavingFields ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Palette, React Flow Canvas, Right Inspector */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar: Block Library */}
        <aside
          style={{
            width: 280,
            backgroundColor: '#0f1419',
            borderRight: '1px solid #21262d',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
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
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#4e5a6a', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
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
                  onClick={() => addBlockToCanvas(b.type)}
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
            💡 Tip: Drag blocks onto the workflow canvas to position them visually.
          </div>
        </aside>

        {/* Center: React Flow Canvas */}
        <div style={{ flex: 1, height: '100%', position: 'relative' }} onDragOver={onDragOver} onDrop={onDrop}>
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
            <Controls style={{ backgroundColor: '#161b22', borderColor: '#21262d', color: '#eceae4', fill: '#eceae4' }} />
            <MiniMap style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }} nodeColor="#6abf3c" maskColor="rgba(11, 15, 20, 0.7)" />

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
                }}
              >
                Blocks: <strong style={{ color: '#6abf3c' }}>{nodes.filter((n) => n.type === 'fieldNode').length}</strong>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Sidebar: Selected Node Inspector */}
        <aside
          style={{
            width: 320,
            backgroundColor: '#0f1419',
            borderLeft: '1px solid #21262d',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          {selectedBlockData ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>Block Inspector</div>
                  <div style={{ fontSize: 11, color: '#6abf3c' }}>Step #{selectedBlockData.index} • {selectedBlockData.type}</div>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 16 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
                {/* Question Input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8b9ab0', marginBottom: 6, textTransform: 'uppercase' }}>
                    Question Label
                  </label>
                  <textarea
                    rows={2}
                    value={selectedBlockData.label}
                    onChange={(e) => handleUpdateSelectedNode({ label: e.target.value })}
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

                {/* Description Input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8b9ab0', marginBottom: 6, textTransform: 'uppercase' }}>
                    Help Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={selectedBlockData.description}
                    onChange={(e) => handleUpdateSelectedNode({ description: e.target.value })}
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
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Placeholder Input */}
                {(selectedBlockData.type === 'TEXT' || selectedBlockData.type === 'EMAIL' || selectedBlockData.type === 'TEXTAREA' || selectedBlockData.type === 'NUMBER') && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8b9ab0', marginBottom: 6, textTransform: 'uppercase' }}>
                      Placeholder Text
                    </label>
                    <input
                      type="text"
                      value={selectedBlockData.placeholder}
                      onChange={(e) => handleUpdateSelectedNode({ placeholder: e.target.value })}
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
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {/* Required Toggle */}
                <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0d1117', padding: '10px 12px', borderRadius: 8, border: '1px solid #21262d' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#eceae4' }}>Required Field</div>
                    <div style={{ fontSize: 10, color: '#4e5a6a' }}>Require respondent to complete this</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedBlockData.isRequired}
                    onChange={(e) => handleUpdateSelectedNode({ isRequired: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#6abf3c', cursor: 'pointer' }}
                  />
                </div>

                {/* Options Manager for SELECT / CHECKBOX */}
                {(selectedBlockData.type === 'SELECT' || selectedBlockData.type === 'CHECKBOX') && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8b9ab0', marginBottom: 8, textTransform: 'uppercase' }}>
                      Options ({selectedBlockData.options.length})
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                      {selectedBlockData.options.map((opt, i) => (
                        <div key={opt.id || i} style={{ display: 'flex', gap: 6 }}>
                          <input
                            type="text"
                            value={opt.value}
                            onChange={(e) => {
                              const newOpts = selectedBlockData.options.map((o, idx) => (idx === i ? { ...o, value: e.target.value } : o))
                              handleUpdateSelectedNode({ options: newOpts })
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
                            }}
                            placeholder={`Option ${i + 1}`}
                          />
                          <button
                            onClick={() => {
                              const newOpts = selectedBlockData.options.filter((_, idx) => idx !== i)
                              handleUpdateSelectedNode({ options: newOpts })
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
                        const newOpts = [...selectedBlockData.options, { id: uid(), value: '' }]
                        handleUpdateSelectedNode({ options: newOpts })
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
                      }}
                    >
                      + Add Choice Option
                    </button>
                  </div>
                )}

                {/* Rating Stars Manager */}
                {selectedBlockData.type === 'RATING' && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8b9ab0', marginBottom: 8, textTransform: 'uppercase' }}>
                      Star Rating Scale
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[3, 5, 7, 10].map((n) => (
                        <button
                          key={n}
                          onClick={() => handleUpdateSelectedNode({ maxRating: n })}
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
                          }}
                        >
                          {n} Stars
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Control */}
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #21262d' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8b9ab0', marginBottom: 8, textTransform: 'uppercase' }}>
                    Reorder Step Position
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleMoveNodeUp(selectedNodeId!)}
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
                      }}
                    >
                      ◄ Move Left
                    </button>
                    <button
                      onClick={() => handleMoveNodeDown(selectedNodeId!)}
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
                      }}
                    >
                      ► Move Right
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: '#4e5a6a' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#8b9ab0', marginBottom: 4 }}>No Block Selected</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                Click any block on the React Flow canvas to inspect and edit its settings.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// ─── Exported Wrapper with ReactFlowProvider ──────────────────────────────────

export default function FormWorkflowBuilder({ formId }: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas formId={formId} />
    </ReactFlowProvider>
  )
}