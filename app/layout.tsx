import { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "../src/styles/globals.css"
import Providers from "./providers"
import { youngSerif } from "../src/utils/fonts"
import TailwindIndicator from "../src/components/tailwind-indicator"

export const metadata: Metadata = {
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "32x32 16x16", type: "image/x-icon" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
	},
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0042dc",
	viewportFit: "cover",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}): React.ReactNode {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${youngSerif.variable} dark`}
		>
			<body className="overflow-hidden">
				<Providers>
					{children}
				</Providers>
				<TailwindIndicator />
				{process.env.VERCEL_ENV === "production" && <Analytics />}
			</body>
		</html>
	)
}
