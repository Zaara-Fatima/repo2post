import {z} from "zod"

export const generatedPostSchema = z.object({
    hook : z.string().min(1),
    content : z.string().min(1),
    hashtags: z.array(z.string()).min(1),
    cta: z.string().min(1)
})

export const generatePostRequestSchema = z.object({
    repositoryId: z.string().min(1)
})