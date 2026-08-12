'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { WelcomeCard } from '~/components/dashboard/welcome-card'
import { StatCard, STATS } from '~/components/dashboard/stat-cards'
import { FormCard, EmptyForms, FORMS } from '~/components/dashboard/form-cards'
import { BlueprintCard, BLUEPRINTS } from '~/components/dashboard/blueprint-cards'
import { ActivityFeed } from '~/components/dashboard/activity-feed'
import { AnalyticsCard } from '~/components/dashboard/analytics-card'
import { CreateFormModal } from '~/components/dashboard/create-form-modal'
import { IconPlus } from '~/components/dashboard/icons'
import { useGetForms } from '~/hooks/api/form'

export default function DashboardPage({ onBack }: { onBack?: () => void }) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [useMockData, setUseMockData] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { forms, isLoading, isError, error } = useGetForms()

  const handleCreateForm = () => setCreateModalOpen(true)

  const handleNav = (id: string) => {
    setActiveNav(id)
    if (id === 'forms') {
      router.push('/dashboard/forms')
    }
  }

  const displayForms = useMockData ? FORMS : (forms || [])
  const totalFormCount = displayForms.length

  return (
    <>
      <DashStyles />
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e14', fontFamily: "'Outfit', sans-serif" }}>

        {/* Sidebar */}
        <Sidebar
          active={activeNav}
          onNav={handleNav}
          onCreateForm={handleCreateForm}
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main layout — offset by sidebar width on desktop */}
        <div
          className="dash-layout"
          style={{ marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCreateForm={handleCreateForm} />

          {/* Content */}
          <main style={{ flex: 1, padding: '28px 28px 48px' }}>

            {/* Welcome card */}
            <section style={{ marginBottom: 24 }}>
              <WelcomeCard onCreateForm={handleCreateForm} />
            </section>

            {/* Stats row */}
            <section style={{ marginBottom: 32 }}>
              <div
                className="stats-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
              >
                {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
              </div>
            </section>

            {/* My Forms */}
            <section style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.3px' }}>
                    My Forms
                  </h2>
                  <div style={{ fontSize: 12, color: '#4e5a6a', marginTop: 2 }}>
                    {isLoading ? 'Loading forms...' : `${totalFormCount} form${totalFormCount === 1 ? '' : 's'} in your workspace`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Toggle demo mock data */}
                  <button
                    onClick={() => setUseMockData(!useMockData)}
                    style={{
                      background: 'none',
                      border: '1px solid #21262d',
                      borderRadius: 6,
                      color: useMockData ? '#6abf3c' : '#4e5a6a',
                      fontSize: 11,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: 'pointer',
                      padding: '5px 10px',
                    }}
                    title="Toggle demo forms"
                  >
                    {useMockData ? 'Showing Mock Forms' : 'Show Mock Forms'}
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/forms')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6abf3c',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    View all →
                  </button>
                  <button
                    onClick={handleCreateForm}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: '#6abf3c',
                      color: '#0d1117',
                      border: 'none',
                      borderRadius: 7,
                      padding: '8px 16px',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 12px rgba(106,191,60,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = '#7dd44a'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = '#6abf3c'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                    }}
                  >
                    <IconPlus />
                    Create Form
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 14,
                  }}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      style={{
                        height: 220,
                        backgroundColor: '#161b22',
                        border: '1px solid #21262d',
                        borderRadius: 10,
                        opacity: 0.6,
                        animation: 'pulse 1.5s infinite ease-in-out',
                      }}
                    />
                  ))}
                </div>
              ) : isError ? (
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: '#161b22',
                    border: '1px solid #2d3741',
                    borderRadius: 10,
                    color: '#f87171',
                    fontSize: 14,
                  }}
                >
                  Failed to load forms: {error?.message || 'Unknown error'}
                </div>
              ) : displayForms.length === 0 ? (
                <EmptyForms onCreateForm={handleCreateForm} />
              ) : (
                <div
                  className="forms-grid"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
                >
                  {displayForms.map((f, idx) => (
                    <FormCard key={f.id} form={f} index={idx} />
                  ))}
                </div>
              )}
            </section>

            {/* Blueprints */}
            <section style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#eceae4', letterSpacing: '-0.3px' }}>
                  Blueprints
                </h2>
                <div style={{ fontSize: 12, color: '#4e5a6a' }}>Start building faster with ready-made forms.</div>
              </div>
              <div
                className="blueprints-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
              >
                {BLUEPRINTS.map((bp) => <BlueprintCard key={bp.name} bp={bp} />)}
              </div>
            </section>

            {/* Activity + Analytics */}
            <section>
              <div
                className="activity-layout"
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
              >
                <ActivityFeed />
                <AnalyticsCard />
              </div>
            </section>

            {/* Back link */}
            {onBack && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #21262d' }}>
                <button
                  onClick={onBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4e5a6a',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#eceae4')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4e5a6a')}
                >
                  ← Back to landing
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Form Modal */}
      {createModalOpen && <CreateFormModal onClose={() => setCreateModalOpen(false)} />}
    </>
  )
}
