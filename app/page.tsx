import { structuredData } from "../src/utils/seo/landing-data"
import { createMetadata } from "../src/utils/seo/create-metadata"
import Events from "../src/components/events/events"
import AuthenticatedLayout from "../src/components/layouts/authenticated-layout"

export const metadata = createMetadata({
	title: "Wiretap | Paper trading on Polymarket",
	description: "Paper trade on Polymarket",
	path: "/",
	keywords: [
		"prediction markets",
		"trading intelligence",
		"market data",
		"polymarket",
		"paper trading",
		"trading tools",
		"market intelligence"
	],
	needsWiretapSuffix: false
})

export default function Home(): React.ReactNode {
	return (
		<AuthenticatedLayout>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<Events />
		</AuthenticatedLayout>
	)
}
