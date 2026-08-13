'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { useListFormResponses, useDeleteSubmission } from '~/hooks/api/form'
import { toast } from 'sonner'

export default function FormResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const formId = (params?.id as string) || ''

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const { responsesData, isLoading, error } = useListFormResponses(formId)
  const { deleteSubmissionAsync, isPending: isDeleting } = useDeleteSubmission()

  const handleNav = (id: string) => {
    if (id === 'dashboard') router.push('/dashboard')
    else if (id === 'forms') router.push('/dashboard/forms')
  }

  // Handle Submission Deletion
  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return
    try {
      await deleteSubmissionAsync({ id: submissionId })
      toast.success('Response deleted successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete response')
    }
  }

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (!responsesData || !responsesData.fields || !responsesData.submissions) return

    const headers = ['Submission ID', 'Submitted At', ...responsesData.fields.map((f) => f.label)]

    const rows = responsesData.submissions.map((sub) => {
      const valuesMap = new Map((sub.values || []).map((v) => [v.formFieldId, v.value]))
      const fieldValues = responsesData.fields.map((f) => `"${(valuesMap.get(f.id) || '').replace(/"/g, '""')}"`)
      return [`"${sub.id}"`, `"${sub.createdAt ? new Date(sub.createdAt).toLocaleString() : ''}"`, ...fieldValues].join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${responsesData.form.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_responses.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('CSV Export downloaded')
  }

  // Copy share link
  const handleCopyShareLink = () => {
    const publicUrl = `${window.location.origin}/form/${formId}`
    navigator.clipboard.writeText(publicUrl)
    toast.success('Shareable form URL copied to clipboard!')
  }

  // Search filtering
  const fields = responsesData?.fields || []
  const submissions = (responsesData?.submissions || []).filter((sub) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    if (sub.id.toLowerCase().includes(q)) return true
    const values = sub.values || []
    return values.some((v) => v.value.toLowerCase().includes(q))
  })

  return (
    <>
      <DashStyles />
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', fontFamily: "'Outfit', sans-serif" }}>
        {/* Sidebar */}
        <Sidebar
          active="forms"
          onNav={handleNav}
          onCreateForm={() => router.push('/dashboard/forms')}
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main layout */}
        <div className="dash-layout" style={{ marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCreateForm={() => router.push('/dashboard/forms')} />

          <main style={{ flex: 1, padding: '28px 28px 48px' }}>
            {/* Back button */}
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
                marginBottom: 16,
                padding: 0,
              }}
            >
              ← Back to Forms
            </button>

            {isLoading ? (
              <div style={{ padding: 40, color: '#6e7a8a', textAlign: 'center' }}>
                Loading form responses...
              </div>
            ) : error ? (
              /* Unauthorized or Error State */
              <div
                style={{
                  backgroundColor: '#161b22',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 14,
                  padding: '48px 32px',
                  maxWidth: 540,
                  margin: '40px auto',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ fontSize: 42, marginBottom: 16 }}>🚫</div>
                <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: '#f87171' }}>
                  Access Restricted
                </h2>
                <p style={{ margin: '0 0 24px', fontSize: 14, color: '#8b9ab0', lineHeight: 1.6 }}>
                  {error.message || 'Only the creator of this form is authorized to view its submission responses.'}
                </p>
                <button
                  onClick={() => router.push('/dashboard/forms')}
                  style={{
                    backgroundColor: '#6abf3c',
                    color: '#0d1117',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Return to My Forms
                </button>
              </div>
            ) : (
              /* Form Responses Table Interface */
              <div>
                {/* Header & Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.5px' }}>
                      Responses: {responsesData?.form?.title}
                    </h1>
                    {responsesData?.form?.description && (
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6e7a8a' }}>
                        {responsesData.form.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => router.push(`/dashboard/forms/workflow/${formId}`)}
                      style={{
                        backgroundColor: '#161b22',
                        color: '#6abf3c',
                        border: '1px solid rgba(106,191,60,0.35)',
                        borderRadius: 8,
                        padding: '9px 16px',
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
                      onClick={() => router.push(`/dashboard/forms?id=${formId}`)}
                      style={{
                        backgroundColor: '#161b22',
                        color: '#eceae4',
                        border: '1px solid #2d3741',
                        borderRadius: 8,
                        padding: '9px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      📝 Standard Field Editor
                    </button>
                    <button
                      onClick={handleCopyShareLink}
                      style={{
                        backgroundColor: '#161b22',
                        color: '#eceae4',
                        border: '1px solid #2d3741',
                        borderRadius: 8,
                        padding: '9px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      🔗 Share Form URL
                    </button>
                    <button
                      onClick={handleExportCSV}
                      disabled={!submissions || submissions.length === 0}
                      style={{
                        backgroundColor: submissions && submissions.length > 0 ? '#6abf3c' : '#2d3741',
                        color: submissions && submissions.length > 0 ? '#0d1117' : '#6e7a8a',
                        border: 'none',
                        borderRadius: 8,
                        padding: '9px 16px',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: submissions && submissions.length > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: submissions && submissions.length > 0 ? '0 2px 12px rgba(106,191,60,0.2)' : 'none',
                      }}
                    >
                      📥 Export CSV
                    </button>
                  </div>
                </div>

                {/* Stat Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                  <div style={{ backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, color: '#6e7a8a', fontWeight: 600, marginBottom: 4 }}>TOTAL RESPONSES</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#6abf3c' }}>{submissions.length}</div>
                  </div>
                  <div style={{ backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, color: '#6e7a8a', fontWeight: 600, marginBottom: 4 }}>FORM FIELDS</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#eceae4' }}>{fields.length}</div>
                  </div>
                  <div style={{ backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, color: '#6e7a8a', fontWeight: 600, marginBottom: 4 }}>LATEST SUBMISSION</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#8b9ab0', marginTop: 6 }}>
                      {submissions.length > 0 && submissions[0]?.createdAt
                        ? new Date(submissions[0].createdAt).toLocaleDateString() + ' ' + new Date(submissions[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'No submissions yet'}
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: 20 }}>
                  <input
                    type="text"
                    placeholder="Search response answers or submission IDs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: 420,
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

                {/* Table View */}
                {submissions.length === 0 ? (
                  <div
                    style={{
                      backgroundColor: '#161b22',
                      border: '1px dashed #21262d',
                      borderRadius: 12,
                      padding: '60px 24px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📥</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#8b9ab0', marginBottom: 4 }}>
                      No responses recorded yet
                    </div>
                    <p style={{ margin: '0 0 16px', color: '#4e5a6a', fontSize: 13 }}>
                      Share your public form URL with respondents to start collecting submissions.
                    </p>
                    <button
                      onClick={handleCopyShareLink}
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
                      Copy Form URL
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#161b22',
                      border: '1px solid #21262d',
                      borderRadius: 12,
                      overflowX: 'auto',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #21262d' }}>
                          <th style={{ padding: '14px 16px', color: '#6e7a8a', fontWeight: 700, width: 40 }}>#</th>
                          <th style={{ padding: '14px 16px', color: '#6e7a8a', fontWeight: 700, minWidth: 160 }}>Submitted At</th>
                          {fields.map((field) => (
                            <th key={field.id} style={{ padding: '14px 16px', color: '#eceae4', fontWeight: 700, minWidth: 180 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>{field.label}</span>
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(106,191,60,0.12)',
                                    color: '#6abf3c',
                                    border: '1px solid rgba(106,191,60,0.25)',
                                  }}
                                >
                                  {field.type}
                                </span>
                              </div>
                            </th>
                          ))}
                          <th style={{ padding: '14px 16px', color: '#6e7a8a', fontWeight: 700, width: 80, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((sub, idx) => {
                          const valuesMap = new Map((sub.values || []).map((v) => [v.formFieldId, v.value]))

                          return (
                            <tr
                              key={sub.id}
                              style={{
                                borderBottom: '1px solid #21262d',
                                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                                transition: 'background-color 0.15s',
                              }}
                            >
                              <td style={{ padding: '14px 16px', color: '#4e5a6a', fontWeight: 600 }}>{idx + 1}</td>
                              <td style={{ padding: '14px 16px', color: '#8b9ab0' }}>
                                {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'Recently'}
                              </td>
                              {fields.map((field) => {
                                const val = valuesMap.get(field.id)
                                return (
                                  <td key={field.id} style={{ padding: '14px 16px', color: val ? '#eceae4' : '#4e5a6a' }}>
                                    {val || '-'}
                                  </td>
                                )
                              })}
                              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                <button
                                  onClick={() => handleDeleteSubmission(sub.id)}
                                  disabled={isDeleting}
                                  style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    borderRadius: 6,
                                    padding: '5px 10px',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
