'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { CreateFormModal } from '~/components/dashboard/create-form-modal'
import { IconPlus, IconDots } from '~/components/dashboard/icons'
import {
  useGetForms,
  useGetForm,
  useCreateFormField,
  useBulkCreateFormFields,
  useUpdateFormField,
  useDeleteFormField,
} from '~/hooks/api/form'
import { toast } from 'sonner'

type FieldType = 'TEXT' | 'NUMBER' | 'EMAIL' | 'YES_NO' | 'PASSWORD'

interface FormFieldItem {
  id: string
  label: string
  labelKey: string
  type: FieldType
  description?: string | null
  placeholder?: string | null
  isRequired: boolean
  index: string
}

function FormsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedFormId = searchParams.get('id')

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('forms')
  const [createFormModalOpen, setCreateFormModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'fields' | 'preview'>('fields')

  // Field modal state
  const [fieldModalOpen, setFieldModalOpen] = useState(false)
  const [editingField, setEditingField] = useState<FormFieldItem | null>(null)

  // Form field state inputs
  const [fieldLabel, setFieldLabel] = useState('')
  const [fieldLabelKey, setFieldLabelKey] = useState('')
  const [fieldType, setFieldType] = useState<FieldType>('TEXT')
  const [fieldDescription, setFieldDescription] = useState('')
  const [fieldPlaceholder, setFieldPlaceholder] = useState('')
  const [fieldIsRequired, setFieldIsRequired] = useState(false)
  const [fieldIndex, setFieldIndex] = useState('1')

  // TRPC Hooks
  const { forms, isLoading: formsLoading, isError: formsIsError, error: formsError } = useGetForms()
  const { form, isLoading: formLoading } = useGetForm(selectedFormId || '')

  const { createFormFieldAsync, isPending: isCreatingField } = useCreateFormField()
  const { bulkCreateFormFieldsAsync, isPending: isBulkCreating } = useBulkCreateFormFields()
  const { updateFormFieldAsync, isPending: isUpdatingField } = useUpdateFormField()
  const { deleteFormFieldAsync, isPending: isDeletingField } = useDeleteFormField()

  // Reset modal input fields
  const resetFieldModal = () => {
    setEditingField(null)
    setFieldLabel('')
    setFieldLabelKey('')
    setFieldType('TEXT')
    setFieldDescription('')
    setFieldPlaceholder('')
    setFieldIsRequired(false)

    const existingFieldsCount = form?.fields?.length || 0
    setFieldIndex(String(existingFieldsCount + 1))
  }

  // Open modal for editing
  const handleOpenEditModal = (field: FormFieldItem) => {
    setEditingField(field)
    setFieldLabel(field.label)
    setFieldLabelKey(field.labelKey)
    setFieldType(field.type)
    setFieldDescription(field.description || '')
    setFieldPlaceholder(field.placeholder || '')
    setFieldIsRequired(field.isRequired)
    setFieldIndex(field.index)
    setFieldModalOpen(true)
  }

  // Handle Save Field
  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormId || !fieldLabel.trim()) return

    const generatedKey = fieldLabelKey.trim()
      ? fieldLabelKey.trim()
      : fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')

    try {
      if (editingField) {
        await updateFormFieldAsync({
          id: editingField.id,
          label: fieldLabel.trim(),
          labelKey: generatedKey,
          type: fieldType,
          description: fieldDescription.trim() || undefined,
          placeholder: fieldPlaceholder.trim() || null,
          isRequired: fieldIsRequired,
          index: fieldIndex,
        })
        toast.success('Form field updated successfully!')
      } else {
        await createFormFieldAsync({
          formId: selectedFormId,
          label: fieldLabel.trim(),
          labelKey: generatedKey,
          type: fieldType,
          description: fieldDescription.trim() || undefined,
          placeholder: fieldPlaceholder.trim() || null,
          isRequired: fieldIsRequired,
          index: fieldIndex,
        })
        toast.success('Form field added successfully!')
      }
      setFieldModalOpen(false)
      resetFieldModal()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save form field')
    }
  }

  // Handle Delete Field
  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form field?')) return
    try {
      await deleteFormFieldAsync({ id })
      toast.success('Field deleted')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete field')
    }
  }

  // Handle Add Preset Fields (Bulk Creation)
  const handleAddPresetFields = async () => {
    if (!selectedFormId) return
    const currentCount = form?.fields?.length || 0
    try {
      await bulkCreateFormFieldsAsync({
        formId: selectedFormId,
        fields: [
          {
            label: 'Full Name',
            labelKey: 'full_name',
            type: 'TEXT',
            placeholder: 'Enter your full name',
            description: 'Provide your first and last name',
            isRequired: true,
            index: String(currentCount + 1),
          },
          {
            label: 'Email Address',
            labelKey: 'email',
            type: 'EMAIL',
            placeholder: 'you@example.com',
            description: 'We will send confirmation here',
            isRequired: true,
            index: String(currentCount + 2),
          },
          {
            label: 'Would you recommend us?',
            labelKey: 'recommend',
            type: 'YES_NO',
            description: 'Your feedback helps us improve',
            isRequired: false,
            index: String(currentCount + 3),
          },
        ],
      })
      toast.success('Preset fields added!')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add preset fields')
    }
  }

  // Navigation handler
  const handleNav = (navId: string) => {
    setActiveNav(navId)
    if (navId === 'dashboard') {
      router.push('/dashboard')
    } else if (navId === 'forms') {
      router.push('/dashboard/forms')
    }
  }

  const filteredForms = (forms || []).filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      <DashStyles />
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', fontFamily: "'Outfit', sans-serif" }}>
        {/* Sidebar */}
        <Sidebar
          active={activeNav}
          onNav={handleNav}
          onCreateForm={() => router.push('/dashboard/forms/builder')}
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="dash-layout" style={{ marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCreateForm={() => router.push('/dashboard/forms/builder')} />

          <main style={{ flex: 1, padding: '28px 28px 48px' }}>
            {selectedFormId ? (
              /* ── SINGLE FORM BUILDER & FIELD MANAGER VIEW ────────────────── */
              <div>
                {/* Back button & Form Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <button
                      onClick={() => router.push('/dashboard/forms')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6abf3c',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 10,
                        padding: 0,
                      }}
                    >
                      ← Back to Forms
                    </button>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.5px' }}>
                      {formLoading ? 'Loading form...' : form?.title || 'Form Builder'}
                    </h1>
                    {form?.description && (
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6e7a8a' }}>{form.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ display: 'flex', backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 3 }}>
                      <button
                        onClick={() => setActiveTab('fields')}
                        style={{
                          backgroundColor: activeTab === 'fields' ? '#6abf3c' : 'transparent',
                          color: activeTab === 'fields' ? '#0d1117' : '#8b9ab0',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        Field Editor ({form?.fields?.length || 0})
                      </button>
                      <button
                        onClick={() => setActiveTab('preview')}
                        style={{
                          backgroundColor: activeTab === 'preview' ? '#6abf3c' : 'transparent',
                          color: activeTab === 'preview' ? '#0d1117' : '#8b9ab0',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        Live Preview
                      </button>
                    </div>

                    <button
                      onClick={() => router.push(`/dashboard/forms/workflow/${selectedFormId}`)}
                      style={{
                        backgroundColor: '#161b22',
                        color: '#6abf3c',
                        border: '1px solid rgba(106,191,60,0.35)',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 2px 10px rgba(106,191,60,0.15)',
                      }}
                    >
                      ⚡ Visual Workflow Builder
                    </button>

                    <button
                      onClick={() => router.push(`/dashboard/forms/${selectedFormId}`)}
                      style={{
                        backgroundColor: '#161b22',
                        color: '#a3e063',
                        border: '1px solid rgba(106,191,60,0.3)',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      📊 View Responses →
                    </button>

                    <button
                      onClick={handleAddPresetFields}
                      disabled={isBulkCreating}
                      style={{
                        backgroundColor: '#161b22',
                        color: '#a3e063',
                        border: '1px solid rgba(106,191,60,0.3)',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: isBulkCreating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      ⚡ Add Preset Fields
                    </button>

                    <button
                      onClick={() => {
                        resetFieldModal()
                        setFieldModalOpen(true)
                      }}
                      style={{
                        backgroundColor: '#6abf3c',
                        color: '#0d1117',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 2px 12px rgba(106,191,60,0.2)',
                      }}
                    >
                      <IconPlus /> Add Field
                    </button>
                  </div>
                </div>

                {/* Tab 1: Fields Editor */}
                {activeTab === 'fields' && (
                  <div>
                    {formLoading ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#6e7a8a' }}>Loading form fields...</div>
                    ) : !form?.fields || form.fields.length === 0 ? (
                      <div
                        style={{
                          backgroundColor: '#161b22',
                          border: '1px dashed #21262d',
                          borderRadius: 12,
                          padding: '60px 24px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 16,
                        }}
                      >
                        <div style={{ fontSize: 32 }}>📝</div>
                        <div>
                          <h3 style={{ margin: '0 0 6px', color: '#eceae4', fontSize: 16, fontWeight: 700 }}>
                            No fields in this form yet
                          </h3>
                          <p style={{ margin: 0, color: '#4e5a6a', fontSize: 13 }}>
                            Add input fields like text, email, numbers, or yes/no questions to start building.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            onClick={() => {
                              resetFieldModal()
                              setFieldModalOpen(true)
                            }}
                            style={{
                              backgroundColor: '#6abf3c',
                              color: '#0d1117',
                              border: 'none',
                              borderRadius: 7,
                              padding: '10px 18px',
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            + Add First Field
                          </button>
                          <button
                            onClick={handleAddPresetFields}
                            style={{
                              backgroundColor: '#1f2630',
                              color: '#a3e063',
                              border: '1px solid #2d3741',
                              borderRadius: 7,
                              padding: '10px 18px',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            ⚡ Load Starter Preset
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {form.fields.map((field, idx) => (
                          <div
                            key={field.id}
                            style={{
                              backgroundColor: '#161b22',
                              border: '1px solid #21262d',
                              borderRadius: 10,
                              padding: '16px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 16,
                              transition: 'border-color 0.2s',
                            }}
                          >
                            {/* Left info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 6,
                                  backgroundColor: '#0d1117',
                                  border: '1px solid #21262d',
                                  color: '#6abf3c',
                                  fontSize: 12,
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                #{field.index || idx + 1}
                              </div>

                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                  <span style={{ fontSize: 15, fontWeight: 700, color: '#eceae4' }}>{field.label}</span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      padding: '2px 8px',
                                      borderRadius: 100,
                                      backgroundColor: 'rgba(106,191,60,0.12)',
                                      color: '#6abf3c',
                                      border: '1px solid rgba(106,191,60,0.25)',
                                    }}
                                  >
                                    {field.type}
                                  </span>
                                  {field.isRequired && (
                                    <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>*Required</span>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, color: '#4e5a6a', display: 'flex', gap: 12 }}>
                                  <span>Key: <code style={{ color: '#8b9ab0' }}>{field.labelKey}</code></span>
                                  {field.placeholder && <span>Placeholder: "{field.placeholder}"</span>}
                                </div>
                                {field.description && (
                                  <div style={{ fontSize: 12, color: '#6e7a8a', marginTop: 4 }}>{field.description}</div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleOpenEditModal(field as FormFieldItem)}
                                style={{
                                  backgroundColor: '#1f2630',
                                  color: '#eceae4',
                                  border: '1px solid #2d3741',
                                  borderRadius: 6,
                                  padding: '6px 12px',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteField(field.id)}
                                disabled={isDeletingField}
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#f87171',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  borderRadius: 6,
                                  padding: '6px 12px',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Live Form Preview */}
                {activeTab === 'preview' && (
                  <div
                    style={{
                      maxWidth: 600,
                      margin: '0 auto',
                      backgroundColor: '#161b22',
                      border: '1px solid #21262d',
                      borderRadius: 14,
                      padding: 32,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div style={{ borderBottom: '1px solid #21262d', paddingBottom: 16, marginBottom: 24 }}>
                      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#eceae4' }}>{form?.title}</h2>
                      {form?.description && <p style={{ margin: '6px 0 0', color: '#6e7a8a', fontSize: 13 }}>{form.description}</p>}
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); toast.success('Form preview submission simulated!') }}>
                      {form?.fields?.map((field) => (
                        <div key={field.id} style={{ marginBottom: 20 }}>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#c8d8b8', marginBottom: 6 }}>
                            {field.label} {field.isRequired && <span style={{ color: '#ef4444' }}>*</span>}
                          </label>
                          {field.description && (
                            <div style={{ fontSize: 12, color: '#4e5a6a', marginBottom: 6 }}>{field.description}</div>
                          )}

                          {field.type === 'YES_NO' ? (
                            <div style={{ display: 'flex', gap: 12 }}>
                              {['Yes', 'No'].map((opt) => (
                                <label
                                  key={opt}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '8px 16px',
                                    backgroundColor: '#0d1117',
                                    border: '1px solid #21262d',
                                    borderRadius: 6,
                                    color: '#eceae4',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <input type="radio" name={field.labelKey} value={opt} required={field.isRequired} />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              type={field.type === 'NUMBER' ? 'number' : field.type === 'EMAIL' ? 'email' : field.type === 'PASSWORD' ? 'password' : 'text'}
                              placeholder={field.placeholder || ''}
                              required={field.isRequired}
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
                          fontFamily: "'Outfit', sans-serif",
                          cursor: 'pointer',
                          marginTop: 10,
                        }}
                      >
                        Submit Response
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              /* ── FORMS LIST VIEW ────────────────────────────────────────── */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.5px' }}>
                      All Forms
                    </h1>
                    <div style={{ fontSize: 13, color: '#4e5a6a', marginTop: 4 }}>
                      Manage, build, and collect responses for all forms in your workspace.
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/dashboard/forms/builder')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: '#6abf3c',
                      color: '#0d1117',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 18px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(106,191,60,0.2)',
                    }}
                  >
                    <IconPlus /> Create Form
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div style={{ marginBottom: 20 }}>
                  <input
                    type="text"
                    placeholder="Search forms by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: 400,
                      padding: '10px 14px',
                      backgroundColor: '#161b22',
                      border: '1px solid #21262d',
                      borderRadius: 8,
                      color: '#eceae4',
                      fontSize: 13,
                      fontFamily: "'Outfit', sans-serif",
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Forms Grid */}
                {formsLoading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {[1, 2, 3].map((n) => (
                      <div key={n} style={{ height: 180, backgroundColor: '#161b22', borderRadius: 10, opacity: 0.5 }} />
                    ))}
                  </div>
                ) : filteredForms.length === 0 ? (
                  <div
                    style={{
                      backgroundColor: '#161b22',
                      border: '1px dashed #21262d',
                      borderRadius: 12,
                      padding: '60px 24px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 12 }}>📋</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#8b9ab0', marginBottom: 4 }}>No forms found</div>
                    <p style={{ margin: '0 0 16px', color: '#4e5a6a', fontSize: 13 }}>
                      {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first form.'}
                    </p>
                    <button
                      onClick={() => router.push('/dashboard/forms/builder')}
                      style={{
                        backgroundColor: '#6abf3c',
                        color: '#0d1117',
                        border: 'none',
                        borderRadius: 7,
                        padding: '9px 16px',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Create Form
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {filteredForms.map((f) => (
                      <div
                        key={f.id}
                        style={{
                          backgroundColor: '#161b22',
                          border: '1px solid #21262d',
                          borderRadius: 12,
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: 16,
                          transition: 'transform 0.15s, border-color 0.15s',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#eceae4' }}>{f.title}</span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 100,
                                backgroundColor: 'rgba(106,191,60,0.15)',
                                color: '#6abf3c',
                                border: '1px solid rgba(106,191,60,0.3)',
                              }}
                            >
                              Active
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: '#6e7a8a', lineHeight: 1.5 }}>
                            {f.description || 'No description provided.'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => router.push(`/dashboard/forms?id=${f.id}`)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              backgroundColor: '#6abf3c',
                              color: '#0d1117',
                              border: 'none',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Manage Fields
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/forms/${f.id}`)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              backgroundColor: '#1f2630',
                              color: '#a3e063',
                              border: '1px solid #2d3741',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            View Responses →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Form Modal */}
      {createFormModalOpen && <CreateFormModal onClose={() => setCreateFormModalOpen(false)} />}

      {/* Add / Edit Form Field Modal */}
      {fieldModalOpen && (
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
            if (e.target === e.currentTarget) setFieldModalOpen(false)
          }}
        >
          <form
            onSubmit={handleSaveField}
            style={{
              backgroundColor: '#161b22',
              border: '1px solid #2d3741',
              borderRadius: 14,
              padding: '28px',
              width: '100%',
              maxWidth: 500,
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#eceae4' }}>
                {editingField ? 'Edit Form Field' : 'Add New Form Field'}
              </h3>
              <button
                type="button"
                onClick={() => setFieldModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#4e5a6a', cursor: 'pointer', fontSize: 20 }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>
                Field Label <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Full Name"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #2d3741',
                  borderRadius: 6,
                  color: '#eceae4',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>
                  Field Type
                </label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as FieldType)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #2d3741',
                    borderRadius: 6,
                    color: '#eceae4',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="EMAIL">Email</option>
                  <option value="YES_NO">Yes / No</option>
                  <option value="PASSWORD">Password</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>
                  Label Key (slug)
                </label>
                <input
                  type="text"
                  placeholder="e.g. full_name"
                  value={fieldLabelKey}
                  onChange={(e) => setFieldLabelKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #2d3741',
                    borderRadius: 6,
                    color: '#eceae4',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>
                Description / Helper Text
              </label>
              <input
                type="text"
                placeholder="Optional instructions for user"
                value={fieldDescription}
                onChange={(e) => setFieldDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #2d3741',
                  borderRadius: 6,
                  color: '#eceae4',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>
                  Placeholder
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fieldPlaceholder}
                  onChange={(e) => setFieldPlaceholder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #2d3741',
                    borderRadius: 6,
                    color: '#eceae4',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b9ab0', marginBottom: 6 }}>
                  Sort Order Index
                </label>
                <input
                  type="text"
                  value={fieldIndex}
                  onChange={(e) => setFieldIndex(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #2d3741',
                    borderRadius: 6,
                    color: '#eceae4',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#eceae4' }}>
                <input
                  type="checkbox"
                  checked={fieldIsRequired}
                  onChange={(e) => setFieldIsRequired(e.target.checked)}
                />
                Mark as Required field
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setFieldModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'transparent',
                  border: '1px solid #2d3741',
                  borderRadius: 6,
                  color: '#8b9ab0',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingField || isUpdatingField}
                style={{
                  flex: 2,
                  padding: '10px',
                  backgroundColor: '#6abf3c',
                  color: '#0d1117',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isCreatingField || isUpdatingField ? 'Saving...' : editingField ? 'Update Field' : 'Create Field'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default function FormsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#6e7a8a', backgroundColor: '#0a0e14', minHeight: '100vh' }}>Loading forms...</div>}>
      <FormsContent />
    </Suspense>
  )
}
