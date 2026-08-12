import { z } from 'zod'

export const createFormInput = z.object({
    title: z.string().describe('title of the form').min(1, 'Title is required').max(50, 'Title cannot exceed 50 characters'),
    description: z.string().describe('description of the form').max(300, 'Description cannot exceed 300 characters').optional(),
    createdBy: z.string().uuid('Invalid user ID')
})

export type createFormInputType = z.infer<typeof createFormInput>

export const listFormsByUserIdInput = z.object({
    userId: z.string().uuid().describe('id of the user who created form')
})

export type listFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>