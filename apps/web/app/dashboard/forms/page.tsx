'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { CreateFormModal } from '~/components/dashboard/create-form-modal'
import { useGetForms, useGetForm } from '~/hooks/api/form'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'
import { SessionExpiredModal } from '~/components/dashboard/session-expired-modal'
import { SingleFormView } from '~/components/form/single-form-view'
import { FormsGridView } from '~/components/form/forms-grid-view'

function FormsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedFormId = searchParams.get('id')

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('forms')
  const [createFormModalOpen, setCreateFormModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'fields' | 'preview'>('fields')

  // Auth & TRPC Hooks
  const { user, isLoading: userLoading, isError: userError } = useGetLoggedInUserInfo()
  const { forms, isLoading: formsLoading, isError: formsError, error: formsErr } = useGetForms()
  const { form, isLoading: formLoading } = useGetForm(selectedFormId || '')

  // Navigation handler
  const handleNav = (navId: string) => {
    setActiveNav(navId)
    if (navId === 'dashboard') {
      router.push('/dashboard')
    } else if (navId === 'forms') {
      router.push('/dashboard/forms')
    } else if (navId === 'templates') {
      router.push('/dashboard/templates')
    } else if (navId === 'themes') {
      router.push('/dashboard/themes')
    }
  }



  const isUnauthorized = Boolean(
    (!userLoading && (userError || !user)) ||
    (formsError &&
      (formsErr?.message?.toLowerCase().includes('unauthorized') ||
        formsErr?.message?.toLowerCase().includes('not authenticated') ||
        formsErr?.message?.toLowerCase().includes('jwt') ||
        formsErr?.message?.toLowerCase().includes('login')))
  )

  const filteredForms = (forms || []).filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      <DashStyles />
      <div className="min-h-screen bg-[#0a0e14] font-['Outfit'] relative">
        {/* Session Expired / Unauthorized Modal */}
        <SessionExpiredModal isOpen={isUnauthorized} />

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
              <SingleFormView
                formId={selectedFormId}
                form={form}
                formLoading={formLoading}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onBack={() => router.push('/dashboard/forms')}
                onEditForm={() => router.push(`/dashboard/forms/builder?id=${selectedFormId}`)}
              />
            ) : (
              <FormsGridView
                formsLoading={formsLoading}
                filteredForms={filteredForms}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onCreateForm={() => router.push('/dashboard/forms/builder')}
                onEditForm={(fId) => router.push(`/dashboard/forms/builder?id=${fId}`)}
                onViewResponses={(fId) => router.push(`/dashboard/forms/${fId}`)}
              />
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
