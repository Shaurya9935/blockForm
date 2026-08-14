'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import UnifiedFormBuilder from '~/components/builder/unified-form-builder'

function FormBuilderContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || undefined

  return <UnifiedFormBuilder formId={id} />
}

export default function FormBuilderPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#8b9ab0', backgroundColor: '#0b0f14', minHeight: '100vh' }}>Loading builder...</div>}>
      <FormBuilderContent />
    </Suspense>
  )
}
