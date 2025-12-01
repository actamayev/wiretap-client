"use client"

import { z } from "zod"

// Email regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailUpdatesSchema = z.object({
	email: z.string()
		.min(3, "Please enter your email to stay updated")
		.max(100, "That's a bit long for an email - could you check it?")
		.refine((val): boolean => emailRegex.test(val), {
			message: "Hmm, that email format doesn't look quite right",
		}),
})
