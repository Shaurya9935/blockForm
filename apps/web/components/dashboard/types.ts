import React from 'react'

export type NavItem = {
  icon: React.ReactNode
  label: string
  id: string
  badge?: number
}

export type Form = {
  id: string
  name: string
  desc: string
  status: 'published' | 'draft'
  responses: number
  edited: string
  theme: 'college' | 'event' | 'startup' | 'gaming'
}
