/* eslint-disable max-len */
import { createMetadata } from "../../src/utils/seo/create-metadata"
import DashboardPage from "../../src/page-components/dashboard"

export const metadata = createMetadata({
	title: "Wiretap | Dashboard",
	description: "The Wiretap dashboard is your portal to the world of prediction markets. Get real-time news, market data, and insights to make informed trading decisions.",
	path: "/dashboard",
	keywords: ["dashboard", "prediction markets", "trading intelligence", "real-time news", "market data", "bloomberg terminal", "trading tools", "news aggregation", "market intelligence", "breaking news", "trading platform"]
})

export default function Dashboard(): React.ReactNode {
	return (
		<DashboardPage />
	)
}
