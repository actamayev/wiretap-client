import AuthenticatedLayout from "../../src/components/layouts/authenticated-layout"
import { createMetadata } from "../../src/utils/seo/create-metadata"
import Events from "../../src/components/events/events"

export const metadata = createMetadata({
	title: "Events",
	description: "Events for the WireTap Pro platform.",
	path: "/events",
	keywords: ["events", "wiretap pro", "platform"]
})

export default function EventsPage(): React.ReactNode {
	return (
		<AuthenticatedLayout>
			<Events />
		</AuthenticatedLayout>
	)
}
