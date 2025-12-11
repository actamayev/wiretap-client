import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createMetadata } from "../../../src/utils/seo/create-metadata"
import SingleEventPage from "../../../src/components/event/single-event-page"
import AuthenticatedLayout from "../../../src/components/layouts/authenticated-layout"

interface EventPageProps {
	params: Promise<{
		eventSlug: EventSlug
	}>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
	const { eventSlug } = await params
	return createMetadata({
		title: "Event",
		description: "View and trade on this event",
		path: `/event/${eventSlug}`,
		keywords: ["events", "prediction", "markets"]
	})
}

export default async function EventPage({ params }: EventPageProps): Promise<React.ReactNode> {
	const { eventSlug } = await params

	// Basic validation - adjust regex based on your UUID format
	if (!eventSlug) {
		notFound()
	}

	return (
		<AuthenticatedLayout>
			<SingleEventPage eventSlug={eventSlug} />
		</AuthenticatedLayout>
	)
}

