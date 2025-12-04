import LoginComponent from "../../src/components/auth/login/login-component"
import { createMetadata } from "../../src/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Login",
	description: "Sign in to your account to access Wiretap and start paper trading on Polymarket.",
	path: "/login",
	keywords: ["login", "paper trading", "sign in"]
})

export default function Login(): React.ReactNode {
	return <LoginComponent />
}
