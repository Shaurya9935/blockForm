'use client'

import React from 'react'
import { IconPlus } from '~/components/dashboard/icons'

interface FormsGridViewProps {
  formsLoading: boolean
  filteredForms: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateForm: () => void
  onEditForm: (formId: string) => void
  onViewResponses: (formId: string) => void
}

export function FormsGridView({
  formsLoading,
  filteredForms,
  searchQuery,
  setSearchQuery,
  onCreateForm,
  onEditForm,
  onViewResponses,
}: FormsGridViewProps) {
  return (
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
          onClick={onCreateForm}
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
            onClick={onCreateForm}
            className="bg-[#6abf3c] text-[#0d1117] border-none rounded-[7px] px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
          >
            Create Form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredForms.map((f: any) => (
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
                  onClick={() => onEditForm(f.id)}
                  className="flex-1 px-3 py-2 bg-[#6abf3c] text-[#0d1117] border-none rounded-md text-[12px] font-bold cursor-pointer hover:bg-[#7dd44a] transition-colors"
                >
                  Edit Form
                </button>
                <button
                  onClick={() => onViewResponses(f.id)}
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
  )
}
