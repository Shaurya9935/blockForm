import { z } from 'zod'

export const formThemeZod = z.enum([
  "overworld",
  "nether",
  "end",
  "diamond",
  "cyberpunk",
  "retro",
])

export type FormThemeType = z.infer<typeof formThemeZod>

export const createFormInput = z.object({
  title: z.string().describe('title of the form').min(1, 'Title is required').max(50, 'Title cannot exceed 50 characters'),
  description: z.string().describe('description of the form').max(300, 'Description cannot exceed 300 characters').optional(),
  theme: formThemeZod.optional().default('overworld'),
  createdBy: z.string().uuid('Invalid user ID'),
})

export type createFormInputType = z.infer<typeof createFormInput>

export const updateFormInput = z.object({
  formId: z.string().uuid('Invalid form ID'),
  title: z.string().min(1).max(50).optional(),
  description: z.string().max(300).optional().nullable(),
  theme: formThemeZod.optional(),
})

export type UpdateFormInputType = z.infer<typeof updateFormInput>

export const listFormsByUserIdInput = z.object({
  userId: z.string().uuid().describe('id of the user who created form'),
})

export type listFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>

export const getFormByIdInput = z.object({
  formId: z.string().uuid('Invalid form ID'),
})

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>
