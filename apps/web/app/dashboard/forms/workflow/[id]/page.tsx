import React, { use } from 'react'
import FormWorkflowBuilder from '~/components/workflow/form-builder'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function WorkflowPage({ params }: PageProps) {
  const { id } = use(params)

  return <FormWorkflowBuilder formId={id} />
}