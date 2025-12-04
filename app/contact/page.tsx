import Contact from "../../src/page-components/contact"
import LayoutOnlyWrapper from "../../src/components/layouts/layout-only-wrapper"
import { createMetadata } from "../../src/utils/seo/create-metadata"

export const metadata = createMetadata({
	title: "Contact",
	description: "Reach out to the Wiretap team for support, feedback, or inquiries about Wiretap and our paper trading platform.",
	path: "/contact",
	keywords: ["wiretap support", "paper trading help", "contact"]
})

export default function ContactPage(): React.ReactNode {
	return (
		<LayoutOnlyWrapper>
			<Contact />
		</LayoutOnlyWrapper>
	)
}
