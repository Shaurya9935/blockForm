'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
} from '@xyflow/react'
import { toast } from 'sonner'
import {
  useGetForm,
  useGetFormFields,
  useCreateForm,
  useBulkCreateFormFields,
  useUpdateForm,
} from '~/hooks/api/form'
import { normalizeOptions } from '~/lib/utils'

import {
  BuilderLeftSidebar,
  BLOCK_CONFIGS,
  type BlockType,
} from './builder-left-sidebar'
import { BuilderRightSidebar, type FormBlockData } from './builder-right-sidebar'
import { WorkflowMiddleSection } from './workflow-middle-section'
import { BlockListMiddleSection } from './block-list-middle-section'

const uid = () => Math.random().toString(36).slice(2, 9)

const generateLabelKey = (label: string, fallbackIdx: number) => {
  const clean = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return clean || `field_${fallbackIdx + 1}`
}

export interface UnifiedFormBuilderProps {
  formId?: string
  onClose?: () => void
}

type FormThemeChoice = 'overworld' | 'nether' | 'aura' | 'default'

interface ThemeOptionCard {
  id: FormThemeChoice
  name: string
  icon: string
  badge?: string
  badgeColor?: string
  description: string
  accentColor: string
}

const THEME_OPTIONS: ThemeOptionCard[] = [
  {
    id: 'overworld',
    name: 'Overworld Theme',
    icon: '⛏️',
    badge: 'POPULAR',
    badgeColor: 'bg-[rgba(106,191,60,0.15)] text-[#6abf3c] border-[rgba(106,191,60,0.3)]',
    description: 'Minecraft style 2D voxel landscape with procedurally drawn sky gradients & block progress bar.',
    accentColor: '#6abf3c',
  },
  {
    id: 'nether',
    name: 'Nether Cavern Theme',
    icon: '🔥',
    badge: 'NEW',
    badgeColor: 'bg-[rgba(255,92,0,0.15)] text-[#ff5c00] border-[rgba(255,92,0,0.3)]',
    description: 'Minecraft Nether voxel cavern with lava river shimmers, Piglins, floating Ghasts & embers.',
    accentColor: '#ff5c00',
  },
  {
    id: 'aura',
    name: 'AURA Festival Pass Theme',
    icon: '⚡',
    badge: 'INTERACTIVE',
    badgeColor: 'bg-[rgba(0,240,255,0.15)] text-[#00f0ff] border-[rgba(0,240,255,0.3)]',
    description: 'Cyberpunk event festival pass builder with real-time pass card generation & QR code.',
    accentColor: '#00f0ff',
  },
  {
    id: 'default',
    name: 'Default Modern Dark',
    icon: '📄',
    badge: 'CLASSIC',
    badgeColor: 'bg-[#21262d] text-[#eceae4] border-[#30363d]',
    description: 'Clean modern dark interface tailored for business forms, surveys, and high-conversion leads.',
    accentColor: '#a3e063',
  },
]

function UnifiedCanvas({ formId }: UnifiedFormBuilderProps) {
  const router = useRouter()
  const reactFlowInstance = useReactFlow()

  // Mode state: 'workflow' (React Flow canvas) vs 'block-list' (Vertical cards list)
  const [viewMode, setViewMode] = useState<'workflow' | 'block-list'>('workflow')

  // API Hooks
  const { form, isLoading: formLoading } = useGetForm(formId || '')
  const { fields, isLoading: fieldsLoading } = useGetFormFields(formId || '')
  const { createFormAsync, isPending: isCreatingForm } = useCreateForm()
  const { bulkCreateFormFieldsAsync, isPending: isBulkSaving } = useBulkCreateFormFields()
  const { updateFormAsync, isPending: isUpdatingTheme } = useUpdateForm()

  const isSaving = isCreatingForm || isBulkSaving || isUpdatingTheme

  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('Untitled Form Workflow')
  const [searchFilter, setSearchFilter] = useState('')

  // Theme Step Modal State
  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<FormThemeChoice>('overworld')
  const [targetFormId, setTargetFormId] = useState<string | null>(formId || null)

  // Sync Form Title & Theme
  useEffect(() => {
    if (form?.title) {
      setFormTitle(form.title)
    }
    if (form?.theme) {
      setSelectedTheme((form.theme as FormThemeChoice) || 'overworld')
    }
  }, [form])

  // Select node handler
  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id)
  }, [])

  // Delete node handler
  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const filtered = nds.filter((n) => n.id !== id)
        let step = 1
        return filtered.map((n) => {
          if (n.type === 'fieldNode') {
            const data = n.data as unknown as FormBlockData
            return {
              ...n,
              data: { ...data, index: step++ },
            }
          }
          return n
        })
      })
      setSelectedNodeId((prev) => (prev === id ? null : prev))
      toast.success('Block removed')
    },
    [setNodes]
  )

  // Move node up (left in horizontal layout)
  const handleMoveNodeUp = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const fieldIndices = nds
          .map((n, idx) => (n.type === 'fieldNode' ? idx : -1))
          .filter((i) => i !== -1)
        const currentFieldIdxPos = fieldIndices.findIndex((i) => nds[i]?.id === id)
        if (currentFieldIdxPos <= 0) return nds

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

  // Move node down (right in horizontal layout)
  const handleMoveNodeDown = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const fieldIndices = nds
          .map((n, idx) => (n.type === 'fieldNode' ? idx : -1))
          .filter((i) => i !== -1)
        const currentFieldIdxPos = fieldIndices.findIndex((i) => nds[i]?.id === id)
        if (currentFieldIdxPos === -1 || currentFieldIdxPos >= fieldIndices.length - 1) return nds

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

  // Reorder nodes via drag-and-drop
  const handleReorderNodes = useCallback(
    (draggedId: string, targetId: string) => {
      setNodes((nds) => {
        const fieldNodes = nds.filter((n) => n.type === 'fieldNode')
        const dragIdx = fieldNodes.findIndex((n) => n.id === draggedId)
        const targetIdx = fieldNodes.findIndex((n) => n.id === targetId)

        if (dragIdx === -1 || targetIdx === -1 || dragIdx === targetIdx) return nds

        const updatedFields = [...fieldNodes]
        const [movedNode] = updatedFields.splice(dragIdx, 1)
        if (!movedNode) return nds
        updatedFields.splice(targetIdx, 0, movedNode)

        // Recalculate horizontal positions and step indices
        let currentX = 420
        let step = 1

        const reordered = updatedFields.map((fn) => {
          const data = fn.data as unknown as FormBlockData
          const updated = {
            ...fn,
            position: { x: currentX, y: fn.position.y },
            data: { ...data, index: step++ },
          }
          currentX += 380
          return updated
        })

        // Move endNode to the end
        const endNode = nds.find((n) => n.id === 'end-node')
        if (endNode) {
          const updatedEndNode = { ...endNode, position: { x: currentX, y: endNode.position.y } }
          return [...reordered, updatedEndNode]
        }

        return reordered
      })
    },
    [setNodes]
  )

  // Automatic Horizontal Flow Layout
  const handleAutoLayout = useCallback(() => {
    setNodes((nds) => {
      let currentX = 420
      const startY = 180
      let step = 1

      const updated = nds.map((n) => {
        if (n.id === 'start-node') {
          return { ...n, position: { x: 80, y: startY } }
        }
        if (n.type === 'fieldNode') {
          const data = n.data as unknown as FormBlockData
          const nodeWithPos = {
            ...n,
            position: { x: currentX, y: startY },
            data: { ...data, index: step++ },
          }
          currentX += 380
          return nodeWithPos
        }
        if (n.id === 'end-node') {
          return { ...n, position: { x: currentX, y: startY } }
        }
        return n
      })

      // Re-connect linear edges between nodes
      const sortedFieldIds = updated
        .filter((n) => n.type === 'fieldNode')
        .map((n) => n.id)

      const newEdges: Edge[] = []
      let prevId = 'start-node'

      sortedFieldIds.forEach((fId) => {
        newEdges.push({
          id: `edge-${prevId}-${fId}`,
          source: prevId,
          target: fId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6abf3c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
        })
        prevId = fId
      })

      if (updated.some((n) => n.id === 'end-node')) {
        newEdges.push({
          id: `edge-${prevId}-end-node`,
          source: prevId,
          target: 'end-node',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6abf3c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
        })
      }

      setEdges(newEdges)
      return updated
    })

    toast.success('Auto-layout applied to horizontal flow')
  }, [setNodes, setEdges])

  // Load existing form fields into nodes and edges
  useEffect(() => {
    if (!fields || fields.length === 0) {
      if (!formLoading && !fieldsLoading && nodes.length === 0) {
        const initialNodes: Node[] = [
          {
            id: 'start-node',
            type: 'startNode',
            position: { x: 80, y: 180 },
            data: { label: 'Form Start' },
          },
          {
            id: 'node-default-1',
            type: 'fieldNode',
            position: { x: 420, y: 180 },
            data: {
              id: 'node-default-1',
              label: 'Full Name',
              labelKey: 'full_name',
              type: 'TEXT',
              description: 'Please enter your full name',
              placeholder: 'John Doe',
              isRequired: true,
              index: 1,
              onSelectNode: handleSelectNode,
              onDeleteNode: handleDeleteNode,
              onMoveNodeUp: handleMoveNodeUp,
              onMoveNodeDown: handleMoveNodeDown,
            },
          },
          {
            id: 'node-default-2',
            type: 'fieldNode',
            position: { x: 800, y: 180 },
            data: {
              id: 'node-default-2',
              label: 'Email Address',
              labelKey: 'email_address',
              type: 'EMAIL',
              description: 'We will send confirmations to this email',
              placeholder: 'john@example.com',
              isRequired: true,
              index: 2,
              onSelectNode: handleSelectNode,
              onDeleteNode: handleDeleteNode,
              onMoveNodeUp: handleMoveNodeUp,
              onMoveNodeDown: handleMoveNodeDown,
            },
          },
          {
            id: 'end-node',
            type: 'endNode',
            position: { x: 1180, y: 180 },
            data: { label: 'Form Submit' },
          },
        ]

        const initialEdges: Edge[] = [
          {
            id: 'edge-start-1',
            source: 'start-node',
            target: 'node-default-1',
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6abf3c', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
          },
          {
            id: 'edge-1-2',
            source: 'node-default-1',
            target: 'node-default-2',
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6abf3c', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
          },
          {
            id: 'edge-2-end',
            source: 'node-default-2',
            target: 'end-node',
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6abf3c', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
          },
        ]

        setNodes(initialNodes)
        setEdges(initialEdges)
      }
      return
    }

    // Build flow from DB fields
    const sortedFields = [...fields].sort((a, b) => Number(a.index) - Number(b.index))
    let currentX = 420
    const startY = 180

    const loadedNodes: Node[] = [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 80, y: startY },
        data: { label: 'Form Start' },
      },
    ]

    const loadedEdges: Edge[] = []
    let previousNodeId = 'start-node'

    sortedFields.forEach((f, idx) => {
      const nodeId = `node-${f.id}`
      const config = (f.config as any) || {}

      const posX = f.workflowX ?? currentX
      const posY = f.workflowY ?? startY

      loadedNodes.push({
        id: nodeId,
        type: 'fieldNode',
        position: { x: posX, y: posY },
        data: {
          id: nodeId,
          label: f.label,
          labelKey: f.labelKey,
          type: f.type as BlockType,
          description: f.description || '',
          placeholder: f.placeholder || '',
          isRequired: f.isRequired,
          index: idx + 1,
          options: config.options || [],
          maxRating: config.maxRating || 5,
          minValue: config.minValue,
          maxValue: config.maxValue,
          onSelectNode: handleSelectNode,
          onDeleteNode: handleDeleteNode,
          onMoveNodeUp: handleMoveNodeUp,
          onMoveNodeDown: handleMoveNodeDown,
        },
      })

      loadedEdges.push({
        id: `edge-${previousNodeId}-${nodeId}`,
        source: previousNodeId,
        target: nodeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6abf3c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
      })

      previousNodeId = nodeId
      currentX = posX + 380
    })

    // Add End Node
    loadedNodes.push({
      id: 'end-node',
      type: 'endNode',
      position: { x: currentX, y: startY },
      data: { label: 'Form Submit' },
    })

    loadedEdges.push({
      id: `edge-${previousNodeId}-end-node`,
      source: previousNodeId,
      target: 'end-node',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6abf3c', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
    })

    setNodes(loadedNodes)
    setEdges(loadedEdges)
  }, [fields, formLoading, fieldsLoading, handleSelectNode, handleDeleteNode, handleMoveNodeUp, handleMoveNodeDown, setNodes, setEdges])

  // Handle flow connections
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6abf3c', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6abf3c' },
          },
          eds
        )
      ),
    [setEdges]
  )

  // Drag over handler
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Add block handler
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
            id: newNodeId,
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

      let position: { x: number; y: number } | undefined
      try {
        position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })
      } catch (err) {
        position = undefined
      }

      addBlockToCanvas(blockType, position)
    },
    [reactFlowInstance, addBlockToCanvas]
  )

  // Selected block data
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

  // Update block by ID
  const handleUpdateBlockById = useCallback(
    (id: string, updates: Partial<FormBlockData>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === id) {
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
    [setNodes]
  )

  // Blocks array for block-list middle section
  const blocksList = useMemo(() => {
    return nodes
      .filter((n) => n.type === 'fieldNode')
      .map((n) => ({
        ...(n.data as unknown as FormBlockData),
        id: n.id,
      }))
  }, [nodes])

  // Step 1: Save Form Fields & Open Theme Selection Modal
  const handleProceedToThemeSelection = async () => {
    const fieldNodes = nodes.filter((n) => n.type === 'fieldNode')
    if (fieldNodes.length === 0) {
      toast.error('Add at least one field block to save the form')
      return
    }

    try {
      let currentFormId = formId || targetFormId

      // If no formId exists, create form first
      if (!currentFormId) {
        const createdForm = await createFormAsync({
          title: formTitle || 'Untitled Form',
          description: 'Created via BlockForm Builder',
        })
        currentFormId = createdForm.id
      }

      setTargetFormId(currentFormId)

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
          options: normalizeOptions(d.options),
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
        formId: currentFormId,
        fields: payloadFields,
      })

      toast.success('Form fields saved! Now select your theme.')
      setThemeModalOpen(true)
    } catch (err: any) {
      console.error('Save form error:', err)
      toast.error(err?.message || 'Failed to save form')
    }
  }

  // Step 2: Save Selected Theme & Open Live Preview Page
  const handleSaveThemeAndPreview = async () => {
    if (!targetFormId) {
      toast.error('Form ID is missing')
      return
    }

    try {
      const dbTheme = selectedTheme

      await updateFormAsync({
        formId: targetFormId,
        theme: dbTheme as any,
      })


      toast.success(`Form theme set to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}!`)
      setThemeModalOpen(false)
      router.push(`/dashboard/forms/preview?id=${targetFormId}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save form theme')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#0b0f14',
        color: '#eceae4',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Fixed Top Header Navbar */}
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
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Untitled Form"
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.3px',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'Outfit', sans-serif",
              }}
            />
            <div style={{ fontSize: 11, color: '#6abf3c', fontWeight: 600 }}>
              Form Builder Studio
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {viewMode === 'workflow' && (
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
          )}

          <button
            onClick={handleProceedToThemeSelection}
            disabled={isSaving}
            style={{
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(106,191,60,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isSaving ? 'Saving...' : 'Next: Select Theme →'}
          </button>
        </div>
      </header>

      {/* Sub-Header Bar (directly below navbar) with middle view switcher buttons */}
      <div
        style={{
          height: 48,
          backgroundColor: '#0d1117',
          borderBottom: '1px solid #21262d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
          zIndex: 15,
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: '#161b22',
            padding: 3,
            borderRadius: 8,
            border: '1px solid #21262d',
            gap: 2,
          }}
        >
          <button
            onClick={() => setViewMode('workflow')}
            style={{
              backgroundColor: viewMode === 'workflow' ? '#6abf3c' : 'transparent',
              color: viewMode === 'workflow' ? '#0d1117' : '#8b9ab0',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Workflow View (Flow Graph)
          </button>
          <button
            onClick={() => setViewMode('block-list')}
            style={{
              backgroundColor: viewMode === 'block-list' ? '#6abf3c' : 'transparent',
              color: viewMode === 'block-list' ? '#0d1117' : '#8b9ab0',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Block List View (Card List)
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Work Area */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Column 1: Left Blocks Palette Sidebar */}
        <BuilderLeftSidebar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          onAddBlock={addBlockToCanvas}
        />

        {/* Column 2: Middle Section (Workflow Flow Graph vs Block List View) */}
        {viewMode === 'workflow' ? (
          <WorkflowMiddleSection
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ) : (
          <BlockListMiddleSection
            blocks={blocksList}
            selectedBlockId={selectedNodeId}
            onSelectBlock={handleSelectNode}
            onDeleteBlock={handleDeleteNode}
            onMoveBlockUp={handleMoveNodeUp}
            onMoveBlockDown={handleMoveNodeDown}
            onReorderBlocks={handleReorderNodes}
            onAddBlock={addBlockToCanvas}
            onUpdateBlock={handleUpdateBlockById}
          />
        )}

        {/* Column 3: Right Properties Inspector Sidebar */}
        <BuilderRightSidebar
          selectedBlockData={selectedBlockData}
          selectedBlockId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
          onUpdateSelectedBlock={handleUpdateSelectedNode}
          onDeleteSelectedBlock={selectedNodeId ? handleDeleteNode : undefined}
          onMoveNodeUp={selectedNodeId ? handleMoveNodeUp : undefined}
          onMoveNodeDown={selectedNodeId ? handleMoveNodeDown : undefined}
        />

      </div>

      {/* Theme Selection Modal Step */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080b14]/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="max-w-[720px] w-full bg-[#161b22] border border-[#21262d] rounded-2xl p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative">
            <div className="mb-6 border-b border-[#21262d] pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(106,191,60,0.12)] border border-[rgba(106,191,60,0.25)] text-[#6abf3c] text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
                <span>Step 2 of 2</span> · Theme Selection
              </div>
              <h2 className="text-2xl font-extrabold text-[#eceae4] tracking-[-0.5px] m-0">
                Choose Form Theme & Presentation
              </h2>
              <p className="mt-1.5 mb-0 text-xs md:text-sm text-[#8b9ab0] leading-relaxed">
                Select how respondents will visually experience your form. You can test and switch themes anytime in the live preview.
              </p>
            </div>

            {/* Theme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id

                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#0d1117] border-[#6abf3c] ring-1 ring-[#6abf3c] shadow-[0_4px_20px_rgba(106,191,60,0.2)]'
                        : 'bg-[#0d1117]/50 border-[#21262d] hover:border-[#384350] hover:bg-[#0d1117]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{theme.icon}</span>
                        <span className="text-sm font-bold text-[#eceae4]">{theme.name}</span>
                      </div>

                      {theme.badge && (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${theme.badgeColor}`}>
                          {theme.badge}
                        </span>
                      )}
                    </div>

                    <p className="m-0 text-xs text-[#8b9ab0] leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#21262d]">
              <button
                type="button"
                onClick={() => {
                  setThemeModalOpen(false)
                  if (targetFormId) {
                    router.push(`/dashboard/forms/preview?id=${targetFormId}`)
                  }
                }}
                className="bg-transparent border-none text-[#8b9ab0] hover:text-[#eceae4] text-xs font-semibold cursor-pointer"
              >
                Skip & Preview Form ↗
              </button>

              <button
                type="button"
                onClick={handleSaveThemeAndPreview}
                disabled={isSaving}
                className="bg-[#6abf3c] text-[#0d1117] border-none rounded-xl px-6 py-3 text-sm font-extrabold cursor-pointer shadow-[0_4px_20px_rgba(106,191,60,0.3)] hover:bg-[#7dd44a] transition-all disabled:opacity-50"
              >
                {isSaving ? 'Applying Theme...' : 'Save Theme & Preview Form ↗'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UnifiedFormBuilder(props: UnifiedFormBuilderProps) {
  return (
    <ReactFlowProvider>
      <UnifiedCanvas {...props} />
    </ReactFlowProvider>
  )
}
