import { optional, z } from "zod";


export const createFormInputModel = z.object({
    title: z.string().describe('Title of the form').min(1, 'Title is required').max(55, 'title cannot be exceed 55 charcters'),
    description: z.string().describe('Description of the form').max(300, 'Description cannot be exceed 300 characters').optional()
})

export const createFormOutputModel = z.object({
    id: z.string().describe('uuid of the created form')
})

export const listMyFormsInputModel = z.object({
    userId: z.string().describe('uuid of the user who created form').optional()
}).optional()

export const listMyFormsOutputModel = z.array(
    z.object({
        id: z.string().uuid().describe('id of the form'),
        title: z.string().describe('title of the form'),
        description: z.string().nullable().optional().describe('description of the form'),
        createdAt: z.date().optional().nullable().describe('Creation timestamp'),
        updatedAt: z.date().optional().nullable().describe('Last Updated timestamp')
    })
)