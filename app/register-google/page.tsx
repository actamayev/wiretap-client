
import RegisterGoogleInfoComponent from "../../src/components/auth/register-google-info/register-google-info-component"
import { createMetadata } from "../../src/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Register Username",
	description: "Choose your unique username for Wiretap to start paper trading on Polymarket.",
	path: "/register-google",
	keywords: ["username creation", "paper trading", "google signup"]
})

export default function RegisterGoogle(): React.ReactNode {
	return <RegisterGoogleInfoComponent />
}
