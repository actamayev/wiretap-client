/* eslint-disable @typescript-eslint/naming-convention */
import { Metadata } from "next"

const BASE_URL = "https://wiretap.pro"

const DEFAULT_OG_IMAGE = "/og-default.jpg"

// Static keywords that appear on every page
const STATIC_KEYWORDS = [
	"prediction markets",
	"wiretap",
	"trading tools",
	"real-time news",
	"market intelligence"
] as const

type MetadataProps = {
	title: string
	description: string
	path: PageNames
	needsWiretapSuffix?: boolean
	keywords: string[]
	noIndex?: boolean
	structuredData?: Record<string, unknown>
}

export function createMetadata({
	title,
	description,
	path,
	needsWiretapSuffix = true,
	keywords,
	structuredData,
}: MetadataProps): Metadata {
	const formattedTitle = needsWiretapSuffix ? `${title} | Wiretap` : title
	const url = `${BASE_URL}${path}`
	const combinedKeywords = [...keywords, ...STATIC_KEYWORDS]

	return {
		metadataBase: new URL("https://wiretap.pro"),
		// Add title template support
		title: {
			default: formattedTitle,
			template: needsWiretapSuffix ? "%s | Wiretap" : "%s"
		},
		description,

		// Use relative URLs - metadataBase will resolve them
		alternates: {
			canonical: path,
		},

		openGraph: {
			title: formattedTitle,
			description,
			url,
			siteName: "Wiretap",
			locale: "en_US",
			type: "website",
			images: [
				{
					url: DEFAULT_OG_IMAGE, // Relative URL
					width: 1200,
					height: 630,
					alt: `Wiretap - ${title}`,
					type: "image/jpeg",
				},
			],
		},

		twitter: {
			card: "summary_large_image",
			title: formattedTitle,
			description,
			creator: "@wiretap_pro",
			images: [DEFAULT_OG_IMAGE], // Relative URL
		},

		keywords: combinedKeywords,
		authors: [{ name: "Wiretap Team" }],
		creator: "Wiretap",
		publisher: "Wiretap",

		// Add manifest
		manifest: "/manifest.webmanifest",

		robots: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},

		other: {
			"og:site_name": "Wiretap",
			...(structuredData && {
				"application/ld+json": JSON.stringify(structuredData)
			})
		}
	}
}
