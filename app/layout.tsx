import { Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "../src/styles/globals.css"
import Providers from "./providers"
import { youngSerif } from "../src/utils/fonts"
import TailwindIndicator from "../src/components/tailwind-indicator"

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#0042dc",
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
			className={youngSerif.variable}
		>
			<body className="overscroll-none overflow-hidden">
				<Providers>
					{children}
				</Providers>
				<TailwindIndicator />
				{process.env.VERCEL_ENV === "production" && (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				)}
			</body>
		</html>
	)
}
