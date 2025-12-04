import AuthenticatedLayout from "../../src/components/layouts/authenticated-layout"
import { createMetadata } from "../../src/utils/seo/create-metadata"
import TheFundsPage from "../../src/components/funds/funds-page/the-funds-page"

export const metadata = createMetadata({
	title: "Funds",
	description: "View and manage your funds",
	path: "/funds",
	keywords: ["funds", "management", "investments"]
})

export default function FundsPage(): React.ReactNode {
	return (
		<AuthenticatedLayout>
			<TheFundsPage />
		</AuthenticatedLayout>
	)
}
