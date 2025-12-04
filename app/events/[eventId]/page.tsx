import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createMetadata } from "../../../src/utils/seo/create-metadata"
import SingleEventPage from "../../../src/components/events/single-event-page"
import AuthenticatedLayout from "../../../src/components/layouts/authenticated-layout"

interface EventPageProps {
	params: Promise<{
		eventId: EventUUID
	}>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
	const { eventId } = await params
	return createMetadata({
		title: "Event",
		description: "View and trade on this event",
		path: `/events/${eventId}`,
		keywords: ["events", "prediction", "markets"]
	})
}

export default async function EventPage({ params }: EventPageProps): Promise<React.ReactNode> {
	const { eventId } = await params

	// Basic validation - adjust regex based on your UUID format
	if (!eventId || !/^[a-fA-F0-9-]{36}$/.test(eventId)) {
		notFound()
	}

	return (
		<AuthenticatedLayout>
			<SingleEventPage eventUUID={eventId} />
		</AuthenticatedLayout>
	)
}

