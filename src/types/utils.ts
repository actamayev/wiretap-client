declare global {
	type EmailOrUnknown = "Email" | "Unknown"

	type EndpointHeaders =
		| "/auth"
		| "/trade"
		| "/events"
		| "/misc"
		| "/personal-info"
		| "/funds"


	interface SidebarNavData {
		title: "Events" | "Funds"
		url: PageNames
		textColor: string
	}

	//Auth
	type LoginOrRegister = "Login" | "Register"
}

export {}
