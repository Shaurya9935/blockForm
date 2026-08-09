import { z } from 'zod'

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe('name of the user'),
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
}) 

export type createUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>