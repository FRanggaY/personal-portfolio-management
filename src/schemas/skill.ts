import { z } from "zod"

export const CreateSkillAuthLoginFormSchema = z.object({
  code: z.string().min(1, {
    message: "Code must be at least 1 characters.",
  }).max(36, {
    message: "Code max be at least 36 characters.",
  }),
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }).max(512, {
    message: "Name max be at least 512 characters.",
  }),
  website_url: z.string().max(512, {
    message: "Website URL max be at least 512 characters.",
  }),
  category: z.string().max(512, {
    message: "Category max be at least 512 characters.",
  }),
  image: z.string().nullable(),
  logo: z.string().nullable(),
})

export const EditSkillAuthLoginFormSchema = z.object({
  code: z.string().min(1, {
    message: "Code must be at least 1 characters.",
  }).max(36, {
    message: "Code max be at least 36 characters.",
  }),
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }).max(512, {
    message: "Name max be at least 512 characters.",
  }),
  website_url: z.string().max(512, {
    message: "Website URL max be at least 512 characters.",
  }),
  category: z.string().max(512, {
    message: "Category max be at least 512 characters.",
  }),
  image: z.string().nullable(),
  logo: z.string().nullable(),
  is_active: z.boolean(),
})
