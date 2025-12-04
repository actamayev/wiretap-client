export const PrivatePageNames: PageNames[] = [
	"/events",
	"/funds",
	"/profile"
]

// These are pages that you can view if you're logged in or not.
export const OpenPages: PageNames[] = [
	"/contact",
	"/terms",
	"/privacy",
]

export const staticPages = [
	"/",
	"/login",
	"/register",
	"/register-google",

	// Private:
	"/profile",
	"/events",
	"/funds",
	// Open:

	"/contact",
	"/terms",
	"/privacy",
	"/404"
] as const

export const PageToNavigateAfterLogin: PageNames = "/events"
