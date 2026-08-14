'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useGetForm, useSubmitForm } from '~/hooks/api/form'
import { toast } from 'sonner'
import {
  FormLoadingState,
  FormNotFoundState,
  FormSuccessState,
} from '~/components/public-form/public-form-states'
import { PublicFormContainer } from '~/components/public-form/public-form-container'

export default function PublicFormSubmissionPage() {
  const params = useParams()
  const formId = (params?.form_id as string) || ''

  const { form, isLoading, error } = useGetForm(formId)
  const { submitFormAsync, isPending } = useSubmitForm()

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formId || !form?.fields) return

    const values = form.fields.map((field: any) => ({
      formFieldId: field.id,
      value: formData[field.id] || '',
    }))

    try {
      await submitFormAsync({
        formId,
        values,
      })
      setSubmitted(true)
      toast.success('Form response submitted successfully!')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit response')
    }
  }

  if (isLoading) {
    return <FormLoadingState />
  }

  if (error || !form) {
    return <FormNotFoundState message={error?.message} />
  }

  if (submitted) {
    return (
      <FormSuccessState
        formTitle={form.title}
        onReset={() => setSubmitted(false)}
      />
    )
  }

  return (
    <PublicFormContainer
      form={form}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  )
}
