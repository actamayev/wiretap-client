import Missing from "../src/page-components/missing"
import { createMetadata } from "@/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Page Not Found",
	description: "We couldn't find the page you're looking for. Return to the Wiretap homepage to continue your journey.",
	path: "/404",
	keywords: ["page not found", "navigation help", "wiretap site map"],
	noIndex: true
})

export default function NotFoundPage(): React.ReactNode {
	return <Missing />
}
