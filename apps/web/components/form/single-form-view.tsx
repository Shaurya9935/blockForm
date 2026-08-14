'use client'

import React from 'react'
import { toast } from 'sonner'
import { PreviewFieldInput } from './preview-field-input'

interface SingleFormViewProps {
  formId: string
  form: any
  formLoading: boolean
  activeTab: 'fields' | 'preview'
  setActiveTab: (tab: 'fields' | 'preview') => void
  onBack: () => void
  onEditForm: () => void
}

export function SingleFormView({
  formId,
  form,
  formLoading,
  activeTab,
  setActiveTab,
  onBack,
  onEditForm,
}: SingleFormViewProps) {
  return (
    <div>
      {/* Back button & Form Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <button
            onClick={onBack}
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
            onClick={onEditForm}
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
                  onClick={onEditForm}
                  className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-5 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
                >
                  ✏️ Open Form Builder
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {form.fields.map((field: any, idx: number) => (
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
            {form?.fields?.map((field: any) => (
              <div key={field.id} className="mb-5">
                <label className="block text-[13px] font-bold text-[#c8d8b8] mb-1.5">
                  {field.label} {field.isRequired && <span className="text-[#ef4444]">*</span>}
                </label>
                {field.description && (
                  <div className="text-[12px] text-[#4e5a6a] mb-1.5">{field.description}</div>
                )}

                <PreviewFieldInput field={field} />
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
  )
}
