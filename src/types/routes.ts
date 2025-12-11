declare global {
	type StaticPageNames =
		| "/"
		| "/profile"
		| "/funds"
		| "/contact"
		| "/terms"
		| "/privacy"
		| "/404"

	type EventsPages =
		| `/event/${EventSlug}`

	type FundsPages =
		| "/funds"
		| `/funds/${FundsUUID}`

	type PageNames = StaticPageNames | EventsPages | FundsPages
}

export {}
