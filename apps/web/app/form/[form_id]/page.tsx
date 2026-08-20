'use client'

import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useGetForm, useSubmitForm } from '~/hooks/api/form'
import { toast } from 'sonner'
import {
  FormLoadingState,
  FormNotFoundState,
  FormSuccessState,
} from '~/components/public-form/public-form-states'
import { PublicFormContainer } from '~/components/public-form/public-form-container'
import { OverworldTheme, type Question as OverworldQuestion } from '~/components/themes/overworld'
import { NetherTheme, type Question as NetherQuestion } from '~/components/themes/nether'
import { AuraTheme, type Question as AuraQuestion } from '~/components/themes/aura'
import { getOptionValues } from '~/lib/utils'

import { DefaultTheme, type Question as DefaultQuestion } from '~/components/themes/default'

function mapFormFieldsToQuestions(fields: any[]): (OverworldQuestion & NetherQuestion & AuraQuestion & DefaultQuestion)[] {
  if (!fields || fields.length === 0) return []

  return fields.map((field, idx) => {
    const config = (field.config as any) || {}
    const options = getOptionValues(config.options)

    let type: 'text' | 'email' | 'number' | 'dropdown' | 'checkbox' = 'text'

    if (field.type === 'EMAIL') {
      type = 'email'
    } else if (field.type === 'NUMBER') {
      type = 'number'
    } else if (field.type === 'SELECT') {
      type = 'dropdown'
    } else if (field.type === 'CHECKBOX') {
      type = 'checkbox'
    } else {
      type = 'text'
    }

    return {
      id: field.id || idx + 1,
      type,
      question: field.label || `Question ${idx + 1}`,
      description: field.description || 'Answer before continuing.',
      placeholder: field.placeholder || undefined,
      required: field.isRequired,
      options: options.length > 0 ? options : (field.type === 'CHECKBOX' ? ['Yes'] : undefined),
    }
  })
}


export default function PublicFormSubmissionPage() {
  const params = useParams()
  const formId = (params?.form_id as string) || ''

  const { form, isLoading, error } = useGetForm(formId)
  const { submitFormAsync, isPending } = useSubmitForm()

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const mappedQuestions = useMemo(() => {
    return mapFormFieldsToQuestions(form?.fields || [])
  }, [form?.fields])

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

  const handleThemeSubmit = async (answers: Record<string | number, string | string[]>) => {
    if (!formId || !form?.fields) return

    const values = form.fields.map((field: any) => {
      const rawVal = answers[field.id]
      const valueStr = Array.isArray(rawVal) ? rawVal.join(', ') : (rawVal || '')
      return {
        formFieldId: field.id,
        value: valueStr,
      }
    })

    try {
      await submitFormAsync({
        formId,
        values,
      })
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

  if (form.theme === 'aura') {
    return (
      <AuraTheme
        title={form.title}
        description={form.description || undefined}
        questions={mappedQuestions}
        onSubmit={handleThemeSubmit}
      />
    )
  }

  if (form.theme === 'nether') {
    return (
      <NetherTheme
        title={form.title}
        description={form.description || undefined}
        questions={mappedQuestions}
        onSubmit={handleThemeSubmit}
      />
    )
  }

  if (form.theme === 'default') {
    return (
      <DefaultTheme
        title={form.title}
        description={form.description || undefined}
        questions={mappedQuestions}
        onSubmit={handleThemeSubmit}
      />
    )
  }

  if (form.theme === 'overworld') {

    return (
      <OverworldTheme
        title={form.title}
        description={form.description || undefined}
        questions={mappedQuestions}
        formExperience={((form as any).formExperience as 'journey' | 'scroll') || 'journey'}
        onSubmit={handleThemeSubmit}
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
