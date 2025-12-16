"use client"

import { useEffect, useMemo, useRef } from "react"
import { observer } from "mobx-react"
import eventsClass from "../../classes/events-class"
import ContainerLayout from "../layouts/container-layout"
import retrieveAllEvents, { retrieveMoreEvents } from "../../utils/events/retrieve-all-events"
import authClass from "../../classes/auth-class"
import SingleEventCard from "./single-event-card"
import EventCardSkeleton from "./event-card-skeleton"

// eslint-disable-next-line max-lines-per-function
function Events(): React.ReactNode {
	useEffect((): void => {
		void retrieveAllEvents()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authClass.isLoggedIn])

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
	const isLoading = eventsClass.isRetrievingAllEvents && events.length === 0
	const loadMoreRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	// Infinite scroll: load more events when scrolling near bottom
	useEffect((): (() => void) | undefined => {
		// Don't load more if there's a search term (search filters local events)
		if (hasSearchTerm) return undefined

		// Find the scrolling container (parent of the content)
		const scrollContainer = containerRef.current?.closest(".overflow-y-auto") as HTMLElement | null
		if (!scrollContainer) {
			console.warn("Could not find scrolling container for IntersectionObserver")
			return undefined
		}

		const intersectionObserver = new IntersectionObserver(
			(entries): void => {
				const [entry] = entries
				// Always access latest values from eventsClass (MobX observable)
				const hasMore = eventsClass.hasMoreEvents
				const isRetrieving = eventsClass.isRetrievingAllEvents

				console.log("Sentinel element intersection:", {
					isIntersecting: entry.isIntersecting,
					hasMoreEvents: hasMore,
					isRetrieving,
					currentOffset: eventsClass.currentOffset,
					eventsCount: events.length
				})

				// Load more when sentinel element is visible and we have more events to load
				if (
					entry.isIntersecting &&
					hasMore &&
					!isRetrieving
				) {
					console.log("✅ Triggering retrieveMoreEvents")
					void retrieveMoreEvents()
				}
			},
			{
				root: scrollContainer, // Use the scrolling container as root
				rootMargin: "200px" // Start loading 200px before reaching the bottom
			}
		)

		const currentRef = loadMoreRef.current
		if (!currentRef) {
			// Sentinel element not rendered yet (hasMoreEvents might be false)
			// Observer will be set up when sentinel appears
			return undefined
		}

		console.log("Setting up IntersectionObserver", {
			hasMoreEvents: eventsClass.hasMoreEvents,
			scrollContainer: !!scrollContainer
		})
		intersectionObserver.observe(currentRef)

		return (): void => {
			if (currentRef) {
				intersectionObserver.unobserve(currentRef)
			}
		}
		// Re-run when search term changes, events are added, or hasMoreEvents changes
		// MobX observables are accessed directly inside the callback
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasSearchTerm, events.length, eventsClass.hasMoreEvents])

	const renderContent = (): React.ReactNode => {
		if (isLoading) {
			return (
				<div className="flex flex-col w-full p-6">
					<div className="grid grid-cols-2 gap-6 w-full">
						{/* Show 8 skeleton cards while loading */}
						{Array.from({ length: 8 }).map((_, index): React.ReactNode => (
							<EventCardSkeleton key={`skeleton-${index}`} />
						))}
					</div>
				</div>
			)
		}

		if (events.length === 0) {
			return (
				<div className="flex flex-col h-full w-full px-6 pt-6">
					<div className="flex items-center justify-center h-full">
						<p className="text-button-text text-lg">
							{hasSearchTerm
								? `No events found matching "${eventsClass.searchTerm}"`
								: "No events available"}
						</p>
					</div>
				</div>
			)
		}

		return (
			<div ref={containerRef} className="flex flex-col w-full p-6">
				<div className="grid grid-cols-2 gap-6 w-full">
					{events.map((event): React.ReactNode => {
						return <SingleEventCard key={event.eventId} event={event} />
					})}
				</div>
				{/* Sentinel element for infinite scroll - only render when there are more events */}
				{!hasSearchTerm && eventsClass.hasMoreEvents && (
					<div ref={loadMoreRef} className="flex justify-center py-4">
						{eventsClass.isRetrievingAllEvents && (
							<div className="flex items-center gap-2 text-muted-foreground">
								<EventCardSkeleton />
								<span className="text-sm">Loading more events...</span>
							</div>
						)}
					</div>
				)}
			</div>
		)
	}

	return (
		<ContainerLayout>
			{renderContent()}
		</ContainerLayout>
	)
}

export default observer(Events)
