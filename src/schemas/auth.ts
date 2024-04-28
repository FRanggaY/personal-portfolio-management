import { z } from "zod"

export const FormSchema = z.object({
  username_or_email: z.string().min(1, {
    message: "Username or Email must be at least 1 characters.",
  }).max(50, {
    message: "Username or Email max be at least 50 characters.",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 characters.",
  }).max(512, {
    message: "Password max be at least 512 characters.",
  }),
})
