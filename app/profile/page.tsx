import AuthenticatedLayout from "../../src/components/layouts/authenticated-layout"
import TheProfilePage from "../../src/components/profile/the-profile-page"
import { createMetadata } from "../../src/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Profile",
	description: "Manage your WireTap account settings including profile picture, \
	personal information, password security, and display preferences.",
	path: "/profile",
	keywords: ["account settings", "profile management", "user preferences"]
})

export default function TheProfile(): React.ReactNode {
	return (
		<AuthenticatedLayout>
			<TheProfilePage />
		</AuthenticatedLayout>
	)
}
