import Landing from "../src/page-components/landing"
import { structuredData } from "../src/utils/seo/landing-data"
import { createMetadata } from "../src/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Wiretap | Paper trading for Polymarket",
	// eslint-disable-next-line max-len
	description: "We give prediction market traders an unfair advantage. Aggregate thousands of real-time sources and get breaking news to your feed within seconds. Personalized for your events, built for power users.",
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
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<Landing />
		</>
	)
}
