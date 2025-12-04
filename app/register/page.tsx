import { createMetadata } from "../../src/utils/seo/create-metadata"
import RegisterComponent from "../../src/components/auth/register/register-component"

export const metadata = createMetadata({
	title: "Register",
	description: "Create a Wiretap account to start paper trading on Polymarket.",
	path: "/register",
	keywords: ["register", "paper trading", "sign up"]
})

export default function Register(): React.ReactNode {
	return <RegisterComponent />
}
