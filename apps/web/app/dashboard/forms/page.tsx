'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { CreateFormModal } from '~/components/dashboard/create-form-modal'
import { IconPlus } from '~/components/dashboard/icons'
import { useGetForms, useGetForm } from '~/hooks/api/form'
import { toast } from 'sonner'
import { getOptionValues } from '~/lib/utils'

function RenderPreviewFieldInput({ field }: { field: any }) {
  const config = (field.config as any) || {}
  const options = getOptionValues(config.options)

  if (field.type === 'SELECT') {
    return (
      <select
        required={field.isRequired}
        className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c]"
      >
        <option value="">-- Select an option --</option>
        {options.map((optVal: string, i: number) => (
          <option key={i} value={optVal}>
            {optVal}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'CHECKBOX') {
    return (
      <div className="flex flex-col gap-2">
        {options.map((optVal: string, i: number) => (
          <label
            key={i}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#0d1117] border border-[#21262d] rounded-md text-[#eceae4] text-[13px] cursor-pointer hover:border-[#2d3741]"
          >
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#6abf3c] cursor-pointer"
            />
            <span>{optVal}</span>
          </label>
        ))}
      </div>
    )
  }

  if (field.type === 'RATING') {
    const maxRating = config.maxRating || 5
    return (
      <div className="flex gap-2">
        {Array.from({ length: maxRating }).map((_, i) => (
          <span key={i} className="text-2xl text-[#fbbf24] cursor-pointer hover:scale-110 transition-transform">
            ★
          </span>
        ))}
      </div>
    )
  }

  if (field.type === 'TEXTAREA') {
    return (
      <textarea
        rows={4}
        placeholder={field.placeholder || ''}
        required={field.isRequired}
        className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c] resize-y"
      />
    )
  }

  if (field.type === 'DATE') {
    return (
      <input
        type="date"
        required={field.isRequired}
        className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c]"
      />
    )
  }

  if (field.type === 'YES_NO') {
    return (
      <div className="flex gap-3">
        {['Yes', 'No'].map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0d1117] border border-[#21262d] rounded-md text-[#eceae4] text-[13px] cursor-pointer hover:border-[#2d3741]"
          >
            <input type="radio" name={field.labelKey} value={opt} required={field.isRequired} />
            {opt}
          </label>
        ))}
      </div>
    )
  }

  return (
    <input
      type={field.type === 'NUMBER' ? 'number' : field.type === 'EMAIL' ? 'email' : field.type === 'PASSWORD' ? 'password' : 'text'}
      min={config.minValue}
      max={config.maxValue}
      placeholder={field.placeholder || ''}
      required={field.isRequired}
      className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-[#eceae4] text-[14px] font-['Outfit'] outline-none box-border focus:border-[#6abf3c]"
    />
  )
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

  // TRPC Hooks
  const { forms, isLoading: formsLoading } = useGetForms()
  const { form, isLoading: formLoading } = useGetForm(selectedFormId || '')

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
      <div className="min-h-screen bg-[#0a0e14] font-['Outfit']">
        {/* Sidebar */}
        <Sidebar
          active={activeNav}
          onNav={handleNav}
          onCreateForm={() => router.push('/dashboard/forms/builder')}
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="dash-layout ml-[240px] min-h-screen flex flex-col">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCreateForm={() => router.push('/dashboard/forms/builder')} />

          <main className="flex-1 p-[28px_28px_48px]">
            {selectedFormId ? (
              /* ── SINGLE FORM VIEW ────────────────────────────────────────── */
              <div>
                {/* Back button & Form Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <button
                      onClick={() => router.push('/dashboard/forms')}
                      className="bg-transparent border-none text-[#6abf3c] text-[13px] font-semibold cursor-pointer inline-flex items-center gap-1.5 mb-[10px] p-0 hover:underline"
                    >
                      ← Back to Forms
                    </button>
                    <h1 className="m-0 text-[24px] font-extrabold text-[#eceae4] tracking-[-0.5px]">
                      {formLoading ? 'Loading form...' : form?.title || 'Form Details'}
                    </h1>
                    {form?.description && (
                      <p className="mt-1 mb-0 text-[13px] text-[#6e7a8a]">{form.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 items-center flex-wrap">
                    <div className="flex bg-[#161b22] border border-[#21262d] rounded-lg p-[3px]">
                      <button
                        onClick={() => setActiveTab('fields')}
                        className={`border-none rounded-md px-3.5 py-1.5 text-[12px] font-bold cursor-pointer transition-all ${
                          activeTab === 'fields'
                            ? 'bg-[#6abf3c] text-[#0d1117]'
                            : 'bg-transparent text-[#8b9ab0] hover:text-[#eceae4]'
                        }`}
                      >
                        Form Fields ({form?.fields?.length || 0})
                      </button>
                      <button
                        onClick={() => setActiveTab('preview')}
                        className={`border-none rounded-md px-3.5 py-1.5 text-[12px] font-bold cursor-pointer transition-all ${
                          activeTab === 'preview'
                            ? 'bg-[#6abf3c] text-[#0d1117]'
                            : 'bg-transparent text-[#8b9ab0] hover:text-[#eceae4]'
                        }`}
                      >
                        Live Preview
                      </button>
                    </div>

                    <button
                      onClick={() => router.push(`/dashboard/forms/builder?id=${selectedFormId}`)}
                      className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-4 py-2 text-[13px] font-bold cursor-pointer flex items-center gap-1.5 shadow-[0_2px_12px_rgba(106,191,60,0.2)] hover:bg-[#7dd44a] transition-all"
                    >
                      Edit Form
                    </button>
                  </div>
                </div>

                {/* Tab 1: Form Fields View */}
                {activeTab === 'fields' && (
                  <div>
                    {formLoading ? (
                      <div className="p-10 text-center text-[#6e7a8a]">Loading form fields...</div>
                    ) : !form?.fields || form.fields.length === 0 ? (
                      <div className="bg-[#161b22] border border-dashed border-[#21262d] rounded-xl py-[60px] px-6 text-center flex flex-col items-center gap-4">
                        <div className="text-[32px]">📝</div>
                        <div>
                          <h3 className="mb-[6px] text-[#eceae4] text-[16px] font-bold">
                            No fields in this form yet
                          </h3>
                          <p className="m-0 text-[#4e5a6a] text-[13px]">
                            Open the Form Builder to add questions and build your form workflow.
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => router.push(`/dashboard/forms/builder?id=${selectedFormId}`)}
                            className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-5 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
                          >
                            ✏️ Open Form Builder
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {form.fields.map((field, idx) => (
                          <div
                            key={field.id}
                            className="bg-[#161b22] border border-[#21262d] rounded-[10px] px-5 py-4 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-[14px]">
                              <div className="w-7 h-7 rounded-md bg-[#0d1117] border border-[#21262d] text-[#6abf3c] text-[12px] font-extrabold flex items-center justify-center shrink-0">
                                #{field.index || idx + 1}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-[2px]">
                                  <span className="text-[15px] font-bold text-[#eceae4]">{field.label}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(106,191,60,0.12)] text-[#6abf3c] border border-[rgba(106,191,60,0.25)]">
                                    {field.type}
                                  </span>
                                  {field.isRequired && (
                                    <span className="text-[11px] text-[#ef4444] font-bold">*Required</span>
                                  )}
                                </div>
                                <div className="text-[12px] text-[#4e5a6a] flex gap-3">
                                  <span>Key: <code className="text-[#8b9ab0]">{field.labelKey}</code></span>
                                  {field.placeholder && <span>Placeholder: "{field.placeholder}"</span>}
                                </div>
                                {field.description && (
                                  <div className="text-[12px] text-[#6e7a8a] mt-1">{field.description}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Live Form Preview */}
                {activeTab === 'preview' && (
                  <div className="max-w-[600px] mx-auto bg-[#161b22] border border-[#21262d] rounded-[14px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="border-b border-[#21262d] pb-4 mb-6">
                      <h2 className="m-0 text-[20px] font-extrabold text-[#eceae4]">{form?.title}</h2>
                      {form?.description && <p className="mt-1.5 mb-0 text-[#6e7a8a] text-[13px]">{form.description}</p>}
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); toast.success('Form preview submission simulated!') }}>
                      {form?.fields?.map((field) => (
                        <div key={field.id} className="mb-5">
                          <label className="block text-[13px] font-bold text-[#c8d8b8] mb-1.5">
                            {field.label} {field.isRequired && <span className="text-[#ef4444]">*</span>}
                          </label>
                          {field.description && (
                            <div className="text-[12px] text-[#4e5a6a] mb-1.5">{field.description}</div>
                          )}

                          <RenderPreviewFieldInput field={field} />
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="w-full p-3 bg-[#6abf3c] text-[#0d1117] border-none rounded-lg text-[14px] font-extrabold font-['Outfit'] cursor-pointer mt-2.5 hover:bg-[#7dd44a] transition-colors"
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="m-0 text-[24px] font-extrabold text-[#eceae4] tracking-[-0.5px]">
                      All Forms
                    </h1>
                    <div className="text-[13px] text-[#4e5a6a] mt-1">
                      Manage, build, and collect responses for all forms in your workspace.
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/dashboard/forms/builder')}
                    className="flex items-center gap-1.5 bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-4 py-2.5 text-[13px] font-bold cursor-pointer shadow-[0_2px_12px_rgba(106,191,60,0.2)] hover:bg-[#7dd44a] transition-all"
                  >
                    <IconPlus /> Create Form
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Search forms by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-[400px] px-3.5 py-2.5 bg-[#161b22] border border-[#21262d] rounded-lg text-[#eceae4] text-[13px] font-['Outfit'] outline-none focus:border-[#2d3741]"
                  />
                </div>

                {/* Forms Grid */}
                {formsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-[180px] bg-[#161b22] rounded-[10px] opacity-50 animate-pulse" />
                    ))}
                  </div>
                ) : filteredForms.length === 0 ? (
                  <div className="bg-[#161b22] border border-dashed border-[#21262d] rounded-xl py-[60px] px-6 text-center">
                    <div className="text-[28px] mb-3">📋</div>
                    <div className="text-[16px] font-bold text-[#8b9ab0] mb-1">No forms found</div>
                    <p className="m-0 mb-4 text-[#4e5a6a] text-[13px]">
                      {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first form.'}
                    </p>
                    <button
                      onClick={() => router.push('/dashboard/forms/builder')}
                      className="bg-[#6abf3c] text-[#0d1117] border-none rounded-[7px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
                    >
                      Create Form
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredForms.map((f) => (
                      <div
                        key={f.id}
                        className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-[#2d3741] hover:-translate-y-0.5"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[16px] font-bold text-[#eceae4]">{f.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(106,191,60,0.15)] text-[#6abf3c] border border-[rgba(106,191,60,0.3)]">
                              Active
                            </span>
                          </div>
                          <div className="text-[13px] text-[#6e7a8a] leading-[1.5]">
                            {f.description || 'No description provided.'}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/forms/builder?id=${f.id}`)}
                            className="flex-1 px-3 py-2 bg-[#6abf3c] text-[#0d1117] border-none rounded-md text-[12px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
                          >
                            Edit Form
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/forms/${f.id}`)}
                            className="flex-1 px-3 py-2 bg-[#1f2630] text-[#a3e063] border border-[#2d3741] rounded-md text-[12px] font-bold cursor-pointer hover:bg-[#2d3741] transition-colors"
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
    </>
  )
}

export default function FormsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-[#6e7a8a] bg-[#0a0e14] min-h-screen">Loading forms...</div>}>
      <FormsContent />
    </Suspense>
  )
}
