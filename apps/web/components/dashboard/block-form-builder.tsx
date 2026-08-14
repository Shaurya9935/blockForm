'use client'

import UnifiedFormBuilder from '~/components/builder/unified-form-builder'

interface BlockFormBuilderProps {
  onClose?: () => void
  formId?: string
}

export function BlockFormBuilder({ onClose, formId }: BlockFormBuilderProps) {
  return <UnifiedFormBuilder formId={formId} onClose={onClose} />
}

export default BlockFormBuilder
