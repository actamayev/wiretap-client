declare global {
	type EmailOrUnknown = "Email" | "Unknown"

	type EndpointHeaders =
		| "/misc"

	//Auth
	type LoginOrRegister = "Login" | "Register"
	interface RegisterFormValues {
		age: number | null
		email: string
		username: string
		password: string
	}
}

export {}
