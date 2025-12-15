"use client"

import { z } from "zod"

// Email regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const authSchema = z.object({
	email: z.string()
		.min(3, "Please enter your email to create your account")
		.max(100, "That's a bit long for an email - could you check it?")
		.refine((val): boolean => emailRegex.test(val), {
			message: "Hmm, that email format doesn't look quite right",
		}),
	password: z.string()
		.min(6, "Please enter your password (at least 6 characters)")
		.max(100, "That's an unusually long password - could you verify it?")
})
