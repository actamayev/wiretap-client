import { LucideIcon } from "lucide-react"

declare global {
	type EmailOrUnknown = "Email" | "Unknown"

	type EndpointHeaders =
		| "/auth"
		| "/misc"
		| "/personal-info"
		| "/funds"


	interface SidebarNavData {
		title: "Events" | "Funds"
		url: PageNames
		icon: LucideIcon
		textColor: string
	}

	//Auth
	type LoginOrRegister = "Login" | "Register"

	interface NewGoogleInfoFormValues {
		username: string
	}
}

export {}
