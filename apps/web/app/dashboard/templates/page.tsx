'use client'

import React, { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'
import { SessionExpiredModal } from '~/components/dashboard/session-expired-modal'

interface TemplateTeaser {
  id: string
  title: string
  category: string
  description: string
  icon: string
  fieldsCount: number
  themeBadge: string
  badgeColor: string
  popular?: boolean
  newTag?: boolean
}

const TEMPLATE_TEASERS: TemplateTeaser[] = [
  {
    id: 'event-feedback',
    title: 'Event Feedback & Experience Survey',
    category: 'Events',
    description: 'Complete post-event satisfaction survey with ratings, highlights, logistics review, and future interest.',
    icon: '🎤',
    fieldsCount: 7,
    themeBadge: 'Overworld Theme',
    badgeColor: 'bg-[rgba(106,191,60,0.15)] text-[#6abf3c] border-[rgba(106,191,60,0.3)]',
    popular: true,
    newTag: true,
  },
  {
    id: 'college-registration',
    title: 'College Fest Registration',
    category: 'Events',
    description: 'Interactive student registration collecting academic department, year, tech tracks, and activity consent.',
    icon: '🏫',
    fieldsCount: 6,
    themeBadge: 'Overworld Theme',
    badgeColor: 'bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border-[rgba(201,168,76,0.3)]',
    popular: true,
  },
  {
    id: 'customer-survey',
    title: 'Product CSAT & Customer Satisfaction',
    category: 'Survey',
    description: 'Clean customer satisfaction survey with rating matrices, multi-choice feedback, and NPS scoring.',
    icon: '📋',
    fieldsCount: 6,
    themeBadge: 'Default Dark',
    badgeColor: 'bg-[rgba(96,165,250,0.15)] text-[#60a5fa] border-[rgba(96,165,250,0.3)]',
  },
  {
    id: 'gaming-community',
    title: 'Gaming Squad & Tournament Signup',
    category: 'Education',
    description: 'Esports tournament registration, discord contact, skill bracket matching, and game selections.',
    icon: '🎮',
    fieldsCount: 6,
    themeBadge: 'Nether Theme',
    badgeColor: 'bg-[rgba(167,139,250,0.15)] text-[#a78bfa] border-[rgba(167,139,250,0.3)]',
    newTag: true,
  },
  {
    id: 'aura-festival-pass',
    title: 'AURA 2026 Festival Pass',
    category: 'Events',
    description: 'Cyberpunk event pass builder generating real-time ticket cards with QR codes and interest badges.',
    icon: '⚡',
    fieldsCount: 5,
    themeBadge: 'Aura Theme',
    badgeColor: 'bg-[rgba(0,240,255,0.15)] text-[#00f0ff] border-[rgba(0,240,255,0.3)]',
    popular: true,
  },
  {
    id: 'nether-cavern',
    title: 'Nether Cavern Respondent Form',
    category: 'Themes',
    description: 'Deep Nether cavern layout featuring floating Ghasts, Piglins, lava river shimmers, and particle embers.',
    icon: '🔥',
    fieldsCount: 7,
    themeBadge: 'Nether Theme',
    badgeColor: 'bg-[rgba(255,92,0,0.15)] text-[#ff5c00] border-[rgba(255,92,0,0.3)]',
  },
]

const CATEGORIES = ['All Templates', 'Themes', 'Events', 'Survey', 'Leads', 'Education']

function TemplatesContent() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All Templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [notified, setNotified] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')

  // Auth Hook
  const { user, isLoading: userLoading, isError: userError } = useGetLoggedInUserInfo()

  const handleNav = (navId: string) => {
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


  const isUnauthorized = Boolean(!userLoading && (userError || !user))

  const filteredTemplates = TEMPLATE_TEASERS.filter((t) => {
    const matchesCategory = activeCategory === 'All Templates' || t.category === activeCategory
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.themeBadge.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifyEmail || !notifyEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setNotified(true)
    toast.success('You have been added to the Template Library Early Access list!')
  }

  return (
    <>
      <DashStyles />
      <div className="min-h-screen bg-[#0a0e14] font-['Outfit'] relative">
        {/* Session Expired / Unauthorized Modal */}
        <SessionExpiredModal isOpen={isUnauthorized} />

        {/* Sidebar */}
        <Sidebar
          active="templates"
          onNav={handleNav}
          onCreateForm={() => router.push('/dashboard/forms/builder')}
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="dash-layout ml-[240px] min-h-screen flex flex-col">
          <Header
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onCreateForm={() => router.push('/dashboard/forms/builder')}
          />

          <main className="flex-1 p-6 md:p-10 max-w-[1280px] w-full mx-auto">
            {/* Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#161b22] via-[#12161f] to-[#161b22] border border-[#21262d] rounded-2xl p-6 md:p-8 mb-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(106,191,60,0.08)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[radial-gradient(circle,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-[640px]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(106,191,60,0.12)] border border-[rgba(106,191,60,0.25)] text-[#6abf3c] text-[11px] font-extrabold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#6abf3c] animate-pulse" />
                    Feature in Development · v2.0 Coming Soon
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#eceae4] tracking-[-0.5px] m-0">
                    Form Templates & Theme Presets
                  </h1>

                  <p className="mt-2.5 mb-0 text-[#8b9ab0] text-sm md:text-base leading-relaxed">
                    Explore pre-built high-converting form templates, interactive respondent themes (Overworld, Nether, Aura), and custom workflow blueprints to launch forms in seconds.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    onClick={() => router.push('/dashboard/forms/builder')}
                    className="bg-[#6abf3c] text-[#0d1117] border-none rounded-xl px-5 py-3 text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(106,191,60,0.25)] hover:bg-[#7dd44a] transition-all"
                  >
                    <span>⚡</span> Build Blank Form
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-[#161b22] text-[#6abf3c] border-[#6abf3c] shadow-[0_2px_12px_rgba(106,191,60,0.15)]'
                          : 'bg-[#161b22]/40 text-[#8b9ab0] border-[#21262d] hover:border-[#384350] hover:text-[#eceae4]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>

              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search template teasers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-xs text-[#eceae4] placeholder-[#4e5a6a] outline-none focus:border-[#6abf3c] transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#4e5a6a]">🔍</span>
              </div>
            </div>

            {/* Template Teasers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => router.push(`/dashboard/forms/builder?blueprint=${template.id}`)}
                  className="group bg-[#161b22]/70 border border-[#21262d] hover:border-[#384350] rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 relative cursor-pointer"
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-[#21262d] flex items-center justify-center text-xl shadow-inner">
                        {template.icon}
                      </div>

                      <div className="flex items-center gap-2">
                        {template.popular && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[rgba(234,179,8,0.15)] text-[#fde047] border border-[rgba(234,179,8,0.3)]">
                            🔥 POPULAR
                          </span>
                        )}
                        {template.newTag && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[rgba(0,240,255,0.15)] text-[#00f0ff] border border-[rgba(0,240,255,0.3)]">
                            ✨ NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-[#eceae4] m-0 group-hover:text-[#6abf3c] transition-colors">
                      {template.title}
                    </h3>

                    <p className="mt-2 mb-4 text-xs text-[#8b9ab0] leading-relaxed line-clamp-3">
                      {template.description}
                    </p>
                  </div>

                  {/* Footer Meta & Action */}
                  <div className="pt-4 border-t border-[#21262d]/60 flex flex-col gap-3 mt-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${template.badgeColor}`}>
                        {template.themeBadge}
                      </span>

                      <span className="text-[11px] font-semibold text-[#6e7a8a]">
                        {template.fieldsCount} Fields Included
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/forms/builder?blueprint=${template.id}`)
                      }}
                      className="w-full bg-[#161b22] hover:bg-[rgba(106,191,60,0.12)] border border-[#21262d] hover:border-[rgba(106,191,60,0.35)] text-[#8b9ab0] hover:text-[#6abf3c] rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Use Starter Pack</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Early Access / Notification Card */}
            <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="max-w-[500px]">
                <div className="text-2xl mb-2">🎁</div>
                <h3 className="text-lg font-bold text-[#eceae4] m-0">
                  Want Early Access when Templates Launch?
                </h3>
                <p className="mt-1.5 mb-0 text-xs md:text-sm text-[#8b9ab0] leading-relaxed">
                  Join our v2.0 early access list to get 20+ ready-to-use form templates, community presets, and instant theme imports before public release.
                </p>
              </div>

              <div className="w-full md:w-auto shrink-0">
                {notified ? (
                  <div className="bg-[rgba(106,191,60,0.15)] border border-[rgba(106,191,60,0.3)] text-[#6abf3c] rounded-xl px-5 py-3 text-xs font-bold flex items-center gap-2">
                    <span>✓</span> You're registered for early template access!
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="email"
                      placeholder="Enter your email..."
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="bg-[#0d1117] border border-[#21262d] rounded-xl px-4 py-2.5 text-xs text-[#eceae4] placeholder-[#4e5a6a] outline-none focus:border-[#6abf3c] min-w-[220px]"
                    />
                    <button
                      type="submit"
                      className="bg-[#6abf3c] text-[#0d1117] border-none rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer hover:bg-[#7dd44a] transition-all whitespace-nowrap"
                    >
                      Notify Me
                    </button>
                  </form>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-[#6e7a8a] bg-[#0a0e14] min-h-screen">Loading templates library...</div>}>
      <TemplatesContent />
    </Suspense>
  )
}