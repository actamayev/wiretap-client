import { Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "../src/styles/globals.css"
import TailwindIndicator from "../src/components/tailwind-indicator"
import { youngSerif } from "../src/utils/fonts"

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#003da5",
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
				{children}
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
