//because i don't trust request inputs

import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

export const loginSchema = z
  .object({
    identifier: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string(),
  })
  .refine((data) => data.identifier || data.email, {
    message: "identifier or email is required",
    path: ["identifier"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
