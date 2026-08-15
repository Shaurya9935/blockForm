'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { useGetForm, useUpdateForm } from '~/hooks/api/form'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'
import { SessionExpiredModal } from '~/components/dashboard/session-expired-modal'
import { PreviewFieldInput } from '~/components/form/preview-field-input'
import { OverworldTheme, type Question as OverworldQuestion } from '~/components/themes/overworld'
import { getOptionValues } from '~/lib/utils'

type ThemeId = 'default' | 'overworld'

interface ThemeOption {
  id: ThemeId
  name: string
  icon: string
  description: string
  badge?: string
}

const THEMES: ThemeOption[] = [
  {
    id: 'default',
    name: 'Default Theme',
    icon: '📄',
    description: 'Clean modern dark interface',
  },
  {
    id: 'overworld',
    name: 'Overworld Theme',
    icon: '⛏',
    description: 'Minecraft style 2D scene with sky gradient transitions',
    badge: 'NEW',
  },
]

// Field Mapper: Database Form Fields -> Overworld Questions
function mapFormFieldsToOverworldQuestions(fields: any[]): OverworldQuestion[] {
  if (!fields || fields.length === 0) return []

  return fields.map((field, idx) => {
    const config = (field.config as any) || {}
    const options = getOptionValues(config.options)

    let type: OverworldQuestion['type'] = 'text'

    if (field.type === 'EMAIL') {
      type = 'email'
    } else if (field.type === 'NUMBER') {
      type = 'number'
    } else if (field.type === 'SELECT') {
      type = 'dropdown'
    } else if (field.type === 'CHECKBOX') {
      type = 'checkbox'
    } else {
      type = 'text'
    }

    return {
      id: field.id || idx + 1,
      type,
      question: field.label || `Question ${idx + 1}`,
      placeholder: field.placeholder || undefined,
      required: field.isRequired,
      options: options.length > 0 ? options : (field.type === 'CHECKBOX' ? ['Yes'] : undefined),
    }
  })
}

function FormPreviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formId = searchParams.get('id') || ''

  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('overworld')

  // Auth & Form Hooks
  const { user, isLoading: userLoading, isError: userError } = useGetLoggedInUserInfo()
  const { form, isLoading: formLoading, error: formErr } = useGetForm(formId)
  const { updateFormAsync } = useUpdateForm()

  useEffect(() => {
    if (form?.theme) {
      setSelectedTheme((form.theme as ThemeId) || 'overworld')
    }
  }, [form?.theme])

  const handleSelectTheme = async (themeId: ThemeId) => {
    setSelectedTheme(themeId)
    if (formId) {
      try {
        await updateFormAsync({
          formId,
          theme: themeId as any,
        })
        toast.success(`Theme updated to ${themeId === 'overworld' ? 'Overworld' : 'Default'}`)
      } catch (err: any) {
        toast.error(err?.message || 'Failed to save theme setting')
      }
    }
  }

  const isUnauthorized = Boolean(
    (!userLoading && (userError || !user)) ||
    (formErr &&
      (formErr?.message?.toLowerCase().includes('unauthorized') ||
        formErr?.message?.toLowerCase().includes('not authenticated') ||
        formErr?.message?.toLowerCase().includes('jwt') ||
        formErr?.message?.toLowerCase().includes('login')))
  )

  const overworldQuestions = useMemo(() => {
    return mapFormFieldsToOverworldQuestions(form?.fields || [])
  }, [form?.fields])

  return (
    <>
      <DashStyles />
      <div className="min-h-screen bg-[#0a0e14] font-['Outfit'] flex flex-col relative overflow-hidden">

        {/* Session Expired / Unauthorized Modal */}
        <SessionExpiredModal isOpen={isUnauthorized} />

        {/* Floating Top Control Bar */}
        <div className="h-14 bg-[#161b22]/90 backdrop-blur-md border-b border-[#21262d] px-6 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(formId ? `/dashboard/forms?id=${formId}` : '/dashboard/forms')}
              className="bg-transparent border-none text-[#6abf3c] text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 p-0 hover:underline"
            >
              ← Back to Form Details
            </button>

            <span className="w-px h-4 bg-[#21262d]" />

            <h1 className="m-0 text-[15px] font-extrabold text-[#eceae4] tracking-[-0.3px]">
              {form?.title ? `Preview: ${form.title}` : 'Live Form Preview'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {formId && (
              <button
                onClick={() => router.push(`/dashboard/forms/builder?id=${formId}`)}
                className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-3.5 py-1.5 text-[12px] font-bold cursor-pointer flex items-center gap-1.5 shadow-[0_2px_12px_rgba(106,191,60,0.2)] hover:bg-[#7dd44a] transition-all"
              >
                ✏️ Edit Form in Builder
              </button>
            )}
          </div>
        </div>

        {/* Main Work Area with Right Theme Sidebar */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Main Preview Screen Canvas */}
          <div className="flex-1 relative overflow-auto">
            {formLoading ? (
              <div className="h-full flex items-center justify-center p-12 text-[#6e7a8a]">
                Loading live form preview...
              </div>
            ) : !form ? (
              <div className="h-full flex items-center justify-center p-6">
                <div className="bg-[#161b22] border border-dashed border-[#21262d] rounded-xl py-16 px-6 text-center flex flex-col items-center gap-4 max-w-[540px]">
                  <div className="text-[36px]">🔍</div>
                  <div>
                    <h3 className="mb-[6px] text-[#eceae4] text-[18px] font-bold">Form Not Found</h3>
                    <p className="m-0 text-[#6e7a8a] text-[13px]">
                      No form ID was provided or the requested form could not be loaded.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/forms')}
                    className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-5 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
                  >
                    Return to Forms
                  </button>
                </div>
              </div>
            ) : selectedTheme === 'overworld' ? (
              <div className="w-full h-full relative">
                <OverworldTheme
                  title={form.title}
                  description={form.description || undefined}
                  questions={overworldQuestions}
                  onSubmit={(answers) => {
                    toast.success('Overworld theme submission simulated!')
                    console.log('Submitted answers:', answers)
                  }}
                />
              </div>
            ) : (
              <div className="p-8 md:p-12 flex justify-center items-start min-h-full">
                <div className="w-full max-w-[640px] bg-[#161b22] border border-[#21262d] rounded-[16px] p-8 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] my-4">
                  <div className="border-b border-[#21262d] pb-5 mb-7">
                    <div className="inline-block px-2.5 py-1 rounded-full bg-[rgba(106,191,60,0.12)] text-[#6abf3c] border border-[rgba(106,191,60,0.25)] text-[11px] font-bold mb-3">
                      Default Theme
                    </div>
                    <h2 className="m-0 text-[24px] font-extrabold text-[#eceae4] tracking-[-0.5px]">
                      {form.title}
                    </h2>
                    {form.description && (
                      <p className="mt-2 mb-0 text-[#8b9ab0] text-[14px] leading-relaxed">
                        {form.description}
                      </p>
                    )}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      toast.success('Form response preview submission simulated!')
                    }}
                  >
                    {(!form.fields || form.fields.length === 0) ? (
                      <div className="text-center py-10 text-[#6e7a8a] text-[14px]">
                        This form does not have any fields configured yet.
                      </div>
                    ) : (
                      form.fields.map((field: any) => (
                        <div key={field.id} className="mb-6">
                          <label className="block text-[14px] font-bold text-[#c8d8b8] mb-1.5">
                            {field.label} {field.isRequired && <span className="text-[#ef4444]">*</span>}
                          </label>
                          {field.description && (
                            <div className="text-[12px] text-[#4e5a6a] mb-2">{field.description}</div>
                          )}

                          <PreviewFieldInput field={field} />
                        </div>
                      ))
                    )}

                    <button
                      type="submit"
                      disabled={!form.fields || form.fields.length === 0}
                      className="w-full py-3.5 px-4 bg-[#6abf3c] text-[#0d1117] border-none rounded-lg text-[15px] font-extrabold font-['Outfit'] cursor-pointer mt-4 shadow-[0_4px_16px_rgba(106,191,60,0.25)] hover:bg-[#7dd44a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Response
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Right Themes Sidebar */}
          <div className="w-[300px] shrink-0 bg-[#0d1117] border-l border-[#21262d] p-5 flex flex-col gap-4 z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.4)] overflow-y-auto">
            <div>
              <h3 className="m-0 text-[14px] font-extrabold text-[#eceae4] uppercase tracking-wider flex items-center gap-2">
                <span>🎨</span> Form Themes
              </h3>
              <p className="mt-1 mb-0 text-[12px] text-[#6e7a8a]">
                Select a visual theme to preview how respondents will experience your form.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              {THEMES.map((theme) => {
                const isActive = selectedTheme === theme.id

                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${

                      isActive
                        ? 'bg-[#161b22] border-[#6abf3c] shadow-[0_4px_20px_rgba(106,191,60,0.15)] ring-1 ring-[#6abf3c]'
                        : 'bg-[#161b22]/50 border-[#21262d] hover:border-[#384350] hover:bg-[#161b22]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[18px]">{theme.icon}</span>
                        <span className="text-[14px] font-bold text-[#eceae4]">{theme.name}</span>
                      </div>
                      {theme.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[rgba(106,191,60,0.15)] text-[#6abf3c] border border-[rgba(106,191,60,0.3)]">
                          {theme.badge}
                        </span>
                      )}
                    </div>
                    <p className="m-0 text-[12px] text-[#6e7a8a] leading-normal">
                      {theme.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function FormPreviewPage() {
  return (
    <Suspense fallback={<div className="p-10 text-[#6e7a8a] bg-[#0a0e14] min-h-screen">Loading form preview...</div>}>
      <FormPreviewContent />
    </Suspense>
  )
}
