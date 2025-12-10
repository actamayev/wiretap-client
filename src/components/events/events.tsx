"use client"

import { useEffect, useMemo } from "react"
import { observer } from "mobx-react"
import eventsClass from "../../classes/events-class"
import InternalContainerLayout from "../layouts/internal-container-layout"
import retrieveAllEvents from "../../utils/events/retrieve-all-events"
import authClass from "../../classes/auth-class"
import SingleEventCard from "./single-event-card"

function Events(): React.ReactNode {
	useEffect((): void => {
		void retrieveAllEvents()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authClass.isFinishedWithSignup])

	const events = useMemo((): SingleEvent[] => {
		const allEvents = Array.from(eventsClass.events.values())
		const searchTerm = eventsClass.searchTerm.toLowerCase().trim()

		if (!searchTerm) {
			return allEvents.sort((a: SingleEvent, b: SingleEvent): number => b.eventTotalVolume - a.eventTotalVolume)
		}

		const filteredEvents = allEvents.filter((event: SingleEvent): boolean => {
			const titleMatch = event.eventTitle.toLowerCase().includes(searchTerm)
			const descriptionMatch = event.eventDescription.toLowerCase().includes(searchTerm)
			const slugMatch = event.eventSlug.toLowerCase().includes(searchTerm)
			const marketMatch = event.eventMarkets.some((market: SingleMarket): boolean =>
				market.marketQuestion?.toLowerCase().includes(searchTerm) ?? false
			)

			return titleMatch || descriptionMatch || slugMatch || marketMatch
		})

		return filteredEvents.sort((a: SingleEvent, b: SingleEvent): number => b.eventTotalVolume - a.eventTotalVolume)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventsClass.events.size, eventsClass.searchTerm])

	const hasSearchTerm = eventsClass.searchTerm.trim().length > 0

	return (
		<InternalContainerLayout preventElasticScroll={true}>
			{events.length === 0 ? (
				<div className="flex flex-col h-full w-full px-6 pt-6">
					<div className="flex items-center justify-center h-full">
						<p className="text-button-text text-lg">
							{hasSearchTerm
								? `No events found matching "${eventsClass.searchTerm}"`
								: "No events available"}
						</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col w-full p-6">
					<div className="grid grid-cols-2 gap-6 w-full">
						{events.map((event): React.ReactNode => {
							return <SingleEventCard key={event.eventId} event={event} />
						})}
					</div>
				</div>
			)}
		</InternalContainerLayout>
	)
}

export default observer(Events)
