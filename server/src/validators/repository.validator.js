import z from "zod";

export const analyzeRepositoryRequestSchema= z.object({
    url: z.url()
})

export const repositoryIdParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid repository ID")
})