'use client'

import React, { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashStyles } from '~/components/dashboard/dash-styles'
import { Sidebar } from '~/components/dashboard/sidebar'
import { Header } from '~/components/dashboard/header'
import { useGetLoggedInUserInfo } from '~/hooks/api/auth'
import { SessionExpiredModal } from '~/components/dashboard/session-expired-modal'
import { OverworldTheme, type Question as OverworldQuestion } from '~/components/themes/overworld'
import { NetherTheme, type Question as NetherQuestion } from '~/components/themes/nether'
import { AuraTheme, type Question as AuraQuestion } from '~/components/themes/aura'
import { DefaultTheme, type Question as DefaultQuestion } from '~/components/themes/default'


interface ThemeItem {
  id: string
  name: string
  icon: string
  badge?: string
  badgeColor?: string
  description: string
  features: string[]
  accentColor: string
  bgPreview: string
  available: boolean
}

const THEME_GALLERY: ThemeItem[] = [
  {
    id: 'overworld',
    name: 'Overworld Theme',
    icon: '⛏️',
    badge: 'POPULAR',
    badgeColor: 'bg-[rgba(106,191,60,0.15)] text-[#6abf3c] border-[rgba(106,191,60,0.3)]',
    description: 'Minecraft style 2D voxel landscape with procedurally drawn sky gradients, mountain horizons, fireflies, and block progress bar.',
    features: ['2D HTML5 Canvas Scene', 'Day/Sunset/Night Gradient Shifts', 'Minecraft Voxel Aesthetic', 'Block Progress Indicator'],
    accentColor: '#6abf3c',
    bgPreview: 'from-[#1e3c10] via-[#0d1e08] to-[#0a0e14]',
    available: true,
  },
  {
    id: 'nether',
    name: 'Nether Cavern Theme',
    icon: '🔥',
    badge: 'NEW',
    badgeColor: 'bg-[rgba(255,92,0,0.15)] text-[#ff5c00] border-[rgba(255,92,0,0.3)]',
    description: 'Minecraft Nether voxel cavern featuring animated lava rivers, glowing glowstone clusters, Piglins, floating Ghasts with swaying tentacles, and ember particles.',
    features: ['Voxel Nether Cavern Scene', 'Floating Ghast & Piglin Animations', 'Lava River Shimmers & Particle Embers', 'Glowing Crimson Accent Styling'],
    accentColor: '#ff5c00',
    bgPreview: 'from-[#3d0808] via-[#1a0303] to-[#080b14]',
    available: true,
  },
  {
    id: 'aura',
    name: 'AURA Festival Pass Theme',
    icon: '⚡',
    badge: 'INTERACTIVE',
    badgeColor: 'bg-[rgba(0,240,255,0.15)] text-[#00f0ff] border-[rgba(0,240,255,0.3)]',
    description: 'Cyberpunk event festival pass builder with real-time pass card generation, dynamic barcode/QR patterns, department cards, and interest tags.',
    features: ['Real-time Ticket Pass Generator', 'Neon Cyberpunk Palette (Cyan/Orange/Lime)', 'Department & Academic Year Cards', 'Interactive QR Code Generation'],
    accentColor: '#00f0ff',
    bgPreview: 'from-[#0d1b2a] via-[#12103a] to-[#080b14]',
    available: true,
  },
  {
    id: 'default',
    name: 'Default Modern Dark',
    icon: '📄',
    badge: 'CLASSIC',
    badgeColor: 'bg-[#21262d] text-[#eceae4] border-[#30363d]',
    description: 'Clean modern dark interface tailored for business forms, surveys, and high-conversion lead generation.',
    features: ['Clean Modern Card Layout', 'Smooth Glassmorphic Styling', 'Responsive Mobile Design', 'Fast Loading & Lightweight'],
    accentColor: '#a3e063',
    bgPreview: 'from-[#161b22] via-[#12161f] to-[#0a0e14]',
    available: true,
  },
  {
    id: 'end',
    name: 'End Portal Realm',
    icon: '🌌',
    badge: 'COMING SOON',
    badgeColor: 'bg-[rgba(147,51,234,0.15)] text-[#c084fc] border-[rgba(147,51,234,0.3)]',
    description: 'Floating obsidian pillars, Ender dragon particle trails, and starry void skybox gradient.',
    features: ['Ender Dragon Skybox', 'Obsidian Tower Scenery', 'Void Purple Particle Field'],
    accentColor: '#c084fc',
    bgPreview: 'from-[#1a0b2e] via-[#0f071a] to-[#0a0e14]',
    available: false,
  },
  {
    id: 'diamond',
    name: 'Diamond Mine Shrine',
    icon: '💎',
    badge: 'COMING SOON',
    badgeColor: 'bg-[rgba(59,130,246,0.15)] text-[#60a5fa] border-[rgba(59,130,246,0.3)]',
    description: 'Deep diamond cave with glowing turquoise ore blocks, pickaxe animations, and sparkling gem physics.',
    features: ['Diamond Ore Cave', 'Sparkling Gem Physics', 'Minecart Track Accents'],
    accentColor: '#60a5fa',
    bgPreview: 'from-[#0b1e36] via-[#071324] to-[#0a0e14]',
    available: false,
  },
]

const SAMPLE_QUESTIONS: (OverworldQuestion & NetherQuestion & AuraQuestion)[] = [
  {
    id: 1,
    type: 'text',
    question: "What's your name?",
    description: 'Tell us how we should address you in the experience.',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    id: 2,
    type: 'email',
    question: 'Where can we reach you?',
    description: 'Drop your email for confirmation updates.',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    id: 3,
    type: 'dropdown',
    question: 'Choose your faction or role.',
    description: 'Select the option that best describes your work.',
    options: ['Explorer', 'Builder', 'Creator', 'Developer'],
  },
  {
    id: 4,
    type: 'checkbox',
    question: 'What features pull you deeper?',
    description: 'Select all options that spark your interest.',
    options: ['Themes & Presets', 'Custom Domains', 'Analytics', 'Webhooks & API'],
  },
]

function ThemesContent() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null)

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

  const activeSampleTheme = THEME_GALLERY.find((t) => t.id === previewThemeId)

  return (
    <>
      <DashStyles />
      <div className="min-h-screen bg-[#0a0e14] font-['Outfit'] relative">
        {/* Session Expired / Unauthorized Modal */}
        <SessionExpiredModal isOpen={isUnauthorized} />

        {/* Sidebar */}
        <Sidebar
          active="themes"
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
                    <span>🎨</span> Theme Preset Gallery
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#eceae4] tracking-[-0.5px] m-0">
                    Respondent Theme Gallery
                  </h1>

                  <p className="mt-2.5 mb-0 text-[#8b9ab0] text-sm md:text-base leading-relaxed">
                    Explore interactive respondent themes. Click any theme to launch a live sample form preview and test how respondents will experience your forms.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    onClick={() => router.push('/dashboard/forms/builder')}
                    className="bg-[#6abf3c] text-[#0d1117] border-none rounded-xl px-5 py-3 text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(106,191,60,0.25)] hover:bg-[#7dd44a] transition-all"
                  >
                    <span>✏️</span> Create Form in Builder
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {THEME_GALLERY.map((theme) => (
                <div
                  key={theme.id}
                  className="group bg-[#161b22]/80 border border-[#21262d] hover:border-[#384350] rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative"
                >
                  {/* Theme Card Banner / Thumbnail */}
                  <div className={`h-40 bg-gradient-to-br ${theme.bgPreview} p-5 relative flex flex-col justify-between border-b border-[#21262d]`}>
                    <div className="flex items-center justify-between z-10">
                      <div className="w-10 h-10 rounded-xl bg-[#0d1117]/80 backdrop-blur-md border border-[#21262d] flex items-center justify-center text-xl shadow-lg">
                        {theme.icon}
                      </div>

                      {theme.badge && (
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${theme.badgeColor}`}>
                          {theme.badge}
                        </span>
                      )}
                    </div>

                    <div className="z-10">
                      <h3 className="text-lg font-extrabold text-[#eceae4] m-0 drop-shadow-md">
                        {theme.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="m-0 text-xs text-[#8b9ab0] leading-relaxed mb-4">
                        {theme.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {theme.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0d1117] text-[#6e7a8a] border border-[#21262d]"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-[#21262d]/60 flex items-center justify-between">
                      {theme.available ? (
                        <button
                          onClick={() => setPreviewThemeId(theme.id)}
                          className="w-full py-2.5 px-4 bg-[#161b22] text-[#eceae4] hover:text-[#6abf3c] border border-[#21262d] hover:border-[#6abf3c] rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 group-hover:bg-[#1f2633]"
                        >
                          <span>👁️</span> Live Sample Form Preview
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 bg-[#0d1117] text-[#4e5a6a] border border-[#21262d] rounded-xl text-xs font-bold cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
                        >
                          <span>🔒</span> Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Fullscreen Live Sample Form Preview Modal Overlay */}
      {previewThemeId && activeSampleTheme && (
        <div className="fixed inset-0 z-50 bg-[#080b14] flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Floating Control Header Bar */}
          <div className="h-14 bg-[#161b22]/90 backdrop-blur-md border-b border-[#21262d] px-6 flex items-center justify-between z-30 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreviewThemeId(null)}
                className="bg-transparent border-none text-[#6abf3c] text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 p-0 hover:underline"
              >
                ← Back to Theme Gallery
              </button>

              <span className="w-px h-4 bg-[#21262d]" />

              <div className="flex items-center gap-2">
                <span className="text-lg">{activeSampleTheme.icon}</span>
                <h1 className="m-0 text-[15px] font-extrabold text-[#eceae4] tracking-[-0.3px]">
                  Sample Preview: {activeSampleTheme.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setPreviewThemeId(null)
                  router.push('/dashboard/forms/builder')
                }}
                className="bg-[#6abf3c] text-[#0d1117] border-none rounded-lg px-4 py-1.5 text-[12px] font-bold cursor-pointer flex items-center gap-1.5 shadow-[0_2px_12px_rgba(106,191,60,0.2)] hover:bg-[#7dd44a] transition-all"
              >
                <span>✏️</span> Create Form with this Theme
              </button>
            </div>
          </div>

          {/* Canvas Rendering Active Sample Theme */}
          <div className="flex-1 relative overflow-auto">
            {previewThemeId === 'overworld' ? (
              <OverworldTheme
                title="Sample Form: Overworld Adventure"
                description="Experience the Minecraft Overworld 2D voxel scene with sky gradient transitions."
                questions={SAMPLE_QUESTIONS}
                onSubmit={(answers) => {
                  toast.success('Overworld sample submission complete!')
                  console.log('Sample submitted answers:', answers)
                }}
              />
            ) : previewThemeId === 'nether' ? (
              <NetherTheme
                title="Sample Form: Nether Journey"
                description="Experience the Minecraft Nether voxel cavern with lava shimmers and ghasts."
                questions={SAMPLE_QUESTIONS}
                onSubmit={(answers) => {
                  toast.success('Nether sample submission complete!')
                  console.log('Sample submitted answers:', answers)
                }}
              />
            ) : previewThemeId === 'aura' ? (
              <AuraTheme
                title="Sample Form: AURA Festival 2026"
                description="Build your festival pass ticket in real time with the Cyberpunk Aura theme."
                questions={SAMPLE_QUESTIONS}
                onSubmit={(answers) => {
                  toast.success('Aura sample ticket pass generated!')
                  console.log('Sample submitted answers:', answers)
                }}
              />
            ) : (
              <DefaultTheme
                title="Sample Form: Default Modern Theme"
                description="Clean indigo & slate interface with numbered step indicators and responsive controls."
                questions={SAMPLE_QUESTIONS}
                onSubmit={(answers) => {
                  toast.success('Default theme sample response submitted!')
                  console.log('Sample submitted answers:', answers)
                }}
              />
            )}

          </div>
        </div>
      )}
    </>
  )
}

export default function ThemesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-[#6e7a8a] bg-[#0a0e14] min-h-screen">Loading theme gallery...</div>}>
      <ThemesContent />
    </Suspense>
  )
}
