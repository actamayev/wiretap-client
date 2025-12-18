import { structuredData } from "../src/utils/seo/landing-data"
import { createMetadata } from "../src/utils/seo/create-metadata"
import Events from "../src/components/events/events"
import AuthenticatedLayout from "../src/components/layouts/authenticated-layout"

export const metadata = createMetadata({
	title: "Wiretap | Paper trade Prediction Markets",
	description: "Paper trade Prediction Markets",
	path: "/",
	keywords: [
		"prediction markets",
		"paper trading",
		"trading tools",
		"market intelligence",
		"prediction markets",
		"polymarket",
		"kalshi"
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
