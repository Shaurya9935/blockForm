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

  const isSaving = isCreatingForm || isBulkSaving

  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('Untitled Form Workflow')
  const [searchFilter, setSearchFilter] = useState('')

  // Sync Form Title
  useEffect(() => {
    if (form?.title) {
      setFormTitle(form.title)
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

        const nonFieldNodes = nds.filter((n) => n.type !== 'fieldNode')
        const startNode = nonFieldNodes.find((n) => n.id === 'start-node')
        const endNode = nonFieldNodes.find((n) => n.id === 'end-node')

        const result: Node[] = []
        if (startNode) result.push(startNode)
        result.push(...reordered)
        if (endNode) {
          result.push({
            ...endNode,
            position: { x: currentX, y: 180 },
          })
        }

        return result
      })
    },
    [setNodes]
  )

  // Helper to build sequential graph edges
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

  // Auto Layout Flow
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
    toast.success('Workflow auto-aligned')
  }, [setNodes, setEdges, buildSequentialEdges])

  // Initial load effect
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
            id: fieldNodeId,
            label: f.label,
            labelKey: f.labelKey,
            type: (f.type as BlockType) || 'TEXT',
            description: f.description || '',
            placeholder: f.placeholder || '',
            isRequired: f.isRequired,
            index: stepCount++,
            options: normalizeOptions(config.options).length > 0
              ? normalizeOptions(config.options)
              : ((f.type as BlockType) === 'SELECT' || (f.type as BlockType) === 'CHECKBOX'
                  ? [{ id: uid(), value: 'Option 1' }, { id: uid(), value: 'Option 2' }]
                  : []),
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
      const demoFieldId = `node-${uid()}`
      initialNodes.push({
        id: demoFieldId,
        type: 'fieldNode',
        position: { x: currentX, y: 180 },
        data: {
          id: demoFieldId,
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

  // Update edges whenever nodes order change
  useEffect(() => {
    setEdges(buildSequentialEdges(nodes))
  }, [nodes, buildSequentialEdges, setEdges])

  // Connect edges handler
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

  // Save Form Handler
  const handleSaveForm = async () => {
    const fieldNodes = nodes.filter((n) => n.type === 'fieldNode')
    if (fieldNodes.length === 0) {
      toast.error('Add at least one field block to save the form')
      return
    }

    try {
      let targetFormId = formId

      // If no formId exists, create form first
      if (!targetFormId) {
        const createdForm = await createFormAsync({
          title: formTitle || 'Untitled Form',
          description: 'Created via BlockForm Builder',
        })
        targetFormId = createdForm.id
      }

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
        formId: targetFormId,
        fields: payloadFields,
      })

      toast.success('Form saved successfully!')
      router.push('/dashboard/forms')
    } catch (err: any) {
      console.error('Save form error:', err)
      toast.error(err?.message || 'Failed to save form')
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
            onClick={handleSaveForm}
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
            {isSaving ? 'Saving...' : 'Save Form'}
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
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: viewMode === 'workflow' ? '#6abf3c' : 'transparent',
              color: viewMode === 'workflow' ? '#0d1117' : '#8b9ab0',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            ⚡ Workflow Canvas View
          </button>
          <button
            onClick={() => setViewMode('block-list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: viewMode === 'block-list' ? '#6abf3c' : 'transparent',
              color: viewMode === 'block-list' ? '#0d1117' : '#8b9ab0',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            📋 Block Cards View
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar (Same for both middle views) */}
        <BuilderLeftSidebar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          onAddBlock={(type) => addBlockToCanvas(type)}
        />

        {/* Middle Section (Dynamically switches between Workflow and Block Cards View) */}
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
            onUpdateBlock={handleUpdateBlockById}
            onDeleteBlock={handleDeleteNode}
            onMoveBlockUp={handleMoveNodeUp}
            onMoveBlockDown={handleMoveNodeDown}
            onAddBlock={(type) => addBlockToCanvas(type)}
            onReorderBlocks={handleReorderNodes}
          />
        )}

        {/* Right Sidebar (Same for both middle views) */}
        <BuilderRightSidebar
          selectedBlockData={selectedBlockData}
          selectedBlockId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
          onUpdateSelectedBlock={handleUpdateSelectedNode}
          onDeleteSelectedBlock={handleDeleteNode}
          onMoveNodeUp={handleMoveNodeUp}
          onMoveNodeDown={handleMoveNodeDown}
        />
      </div>
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
