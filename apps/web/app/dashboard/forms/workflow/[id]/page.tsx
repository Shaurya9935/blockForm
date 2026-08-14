import React, { use } from 'react'
import UnifiedFormBuilder from '~/components/builder/unified-form-builder'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function WorkflowPage({ params }: PageProps) {
  const { id } = use(params)

  return <UnifiedFormBuilder formId={id} />
}