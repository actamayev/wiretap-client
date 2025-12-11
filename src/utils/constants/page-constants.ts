export const PrivatePageNames: PageNames[] = [
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

	// Private:
	"/profile",
	"/funds",
	// Open:

	"/contact",
	"/terms",
	"/privacy",
	"/404"
] as const
