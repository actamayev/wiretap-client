import TermsPage from "../../src/page-components/terms"
import LayoutOnlyWrapper from "../../src/components/layouts/layout-only-wrapper"
import { createMetadata } from "../../src/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Terms",
	description: "Our terms govern the use of the Wiretap website. Read our terms to find out more",
	path: "/terms",
	keywords: ["terms of service", "wiretap", "terms and conditions"]
})

export default function Terms(): React.ReactNode {
	return (
		<LayoutOnlyWrapper>
			<TermsPage />
		</LayoutOnlyWrapper>
	)
}
