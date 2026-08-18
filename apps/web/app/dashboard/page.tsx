'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { WelcomeCard } from '~/components/dashboard/welcome-card'
import { FormCard, EmptyForms } from '~/components/dashboard/form-cards'
import { BlueprintCard, BLUEPRINTS } from '~/components/dashboard/blueprint-cards'
import { IconPlus } from '~/components/dashboard/icons'
import { useGetForms } from '~/hooks/api/form'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'
import { SessionExpiredModal } from '~/components/dashboard/session-expired-modal'

export default function DashboardPage({ onBack }: { onBack?: () => void }) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const { user, isLoading: userLoading, isError: userError, error: userErr } = useGetLoggedInUserInfo()
  const { forms, isLoading, isError, error } = useGetForms()

  const handleCreateForm = () => router.push('/dashboard/forms/builder')

  const handleNav = (id: string) => {
    setActiveNav(id)
    if (id === 'forms') {
      router.push('/dashboard/forms')
    } else if (id === 'templates') {
      router.push('/dashboard/templates')
    } else if (id === 'themes') {
      router.push('/dashboard/themes')
    } else if (id === 'dashboard') {
      router.push('/dashboard')
    }
  }



  const isUnauthorized = Boolean(
    (!userLoading && (userError || !user)) ||
    (isError &&
      (error?.message?.toLowerCase().includes('unauthorized') ||
        error?.message?.toLowerCase().includes('not authenticated') ||
        error?.message?.toLowerCase().includes('jwt') ||
        error?.message?.toLowerCase().includes('login')))
  )

  const displayForms = forms || []
  const totalFormCount = displayForms.length

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
          onCreateForm={handleCreateForm}
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main layout — offset by sidebar width on desktop */}
        <div className="dash-layout ml-[240px] min-h-screen flex flex-col">
          {/* Header */}
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCreateForm={handleCreateForm} />

          {/* Content */}
          <main className="flex-1 p-[28px_28px_48px]">
            {/* Welcome card */}
            <section className="mb-6">
              <WelcomeCard onCreateForm={handleCreateForm} />
            </section>

            {/* My Forms */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                <div>
                  <h2 className="m-0 text-[18px] font-extrabold text-[#eceae4] tracking-[-0.3px]">
                    My Forms
                  </h2>
                  <div className="text-[12px] text-[#4e5a6a] mt-0.5">
                    {isLoading
                      ? 'Loading forms...'
                      : `${totalFormCount} form${totalFormCount === 1 ? '' : 's'} in your workspace`}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => router.push('/dashboard/forms')}
                    className="bg-transparent border-none text-[#6abf3c] text-[13px] font-semibold font-['Outfit'] cursor-pointer p-0 hover:underline"
                  >
                    View all →
                  </button>
                  <button
                    onClick={handleCreateForm}
                    className="flex items-center gap-1.5 bg-[#6abf3c] text-[#0d1117] border-none rounded-[7px] px-4 py-2 text-[13px] font-bold font-['Outfit'] cursor-pointer transition-all shadow-[0_2px_12px_rgba(106,191,60,0.2)] hover:bg-[#7dd44a] hover:-translate-y-0.5"
                  >
                    <IconPlus />
                    Create Form
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[14px]">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-[220px] bg-[#161b22] border border-[#21262d] rounded-[10px] opacity-60 animate-pulse"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="p-6 bg-[#161b22] border border-[#2d3741] rounded-[10px] text-[#f87171] text-[14px]">
                  Failed to load forms: {error?.message || 'Unknown error'}
                </div>
              ) : displayForms.length === 0 ? (
                <EmptyForms onCreateForm={handleCreateForm} />
              ) : (
                <div className="forms-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[14px]">
                  {displayForms.map((f, idx) => (
                    <FormCard key={f.id} form={f} index={idx} />
                  ))}
                </div>
              )}
            </section>

            {/* Blueprints */}
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="m-0 mb-1 text-[18px] font-extrabold text-[#eceae4] tracking-[-0.3px]">
                  Blueprints
                </h2>
                <div className="text-[12px] text-[#4e5a6a]">Start building faster with ready-made forms.</div>
              </div>
              <div className="blueprints-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[14px]">
                {BLUEPRINTS.map((bp) => (
                  <BlueprintCard key={bp.name} bp={bp} />
                ))}
              </div>
            </section>

            {/* Back link */}
            {onBack && (
              <div className="mt-8 pt-6 border-t border-[#21262d]">
                <button
                  onClick={onBack}
                  className="bg-transparent border-none text-[#4e5a6a] text-[13px] cursor-pointer font-['Outfit'] p-0 flex items-center gap-1.5 transition-colors hover:text-[#eceae4]"
                >
                  ← Back to landing
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
