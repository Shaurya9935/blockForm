import { z } from "zod";


export const createFormInputModel = z.object({
    title: z.string().describe('Title of the form').min(1, 'Title is required').max(55, 'title cannot be exceed 55 charcters'),
    description: z.string().describe('Description of the form').max(300, 'Description cannot be exceed 300 characters').optional()
})

export const createFormOutputModel = z.object({
    id: z.string().describe('uuid of the created form')
})