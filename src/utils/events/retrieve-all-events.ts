//eslint-disable-file max-depth
"use client"

import isEqual from "lodash-es/isEqual"
import { isErrorResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import eventsClass from "../../classes/events-class"
import retrieveEventPriceHistory from "./retrieve-event-price-history"
import polymarketWebSocketClient from "../../classes/polymarket-websocket-client"

//eslint-disable-next-line complexity
export default async function retrieveAllEvents(offset?: number): Promise<void> {
	try {
		// If offset is explicitly provided, use it; otherwise default to 0 for initial load
		const currentOffset = offset ?? 0

		// For initial load (offset 0), check if we've already retrieved
		if (currentOffset === 0 && eventsClass.hasRetrievedAllEvents) {
			return
		}

		// Prevent concurrent requests
		if (eventsClass.isRetrievingAllEvents) {
			return
		}

		eventsClass.setIsRetrievingAllEvents(true)
		eventsClass.setCurrentOffset(currentOffset)

		const eventsResponse = await wiretapApiClient.eventsDataService.retrieveAllEvents(currentOffset)
		if (!isEqual(eventsResponse.status, 200) || isErrorResponse(eventsResponse.data)) {
			throw Error ("Unable to retrieve events")
		}

		eventsClass.setEventsMetadata(eventsResponse.data.events)

		// Increment offset for next page if there are more events
		// hasMoreEvents is set in setEventsMetadata based on response length
		if (eventsClass.hasMoreEvents) {
			eventsClass.incrementOffset()
		}

		// Fetch price history for each event (1W interval)
		const priceHistoryPromises = eventsResponse.data.events.map(
			(event): Promise<void> => retrieveEventPriceHistory(event.eventSlug)
		)
		await Promise.allSettled(priceHistoryPromises)

		// Add all First outcome clob tokens to WebSocket subscription
		// This handles both initial load and paginated loads - new events are automatically added
		const clobTokenIds: ClobTokenId[] = []
		for (const eventMetadata of eventsResponse.data.events) {
			// Events are already added to the map via setEventsMetadata above
			const event = eventsClass.events.get(eventMetadata.eventSlug)
			if (!event) continue
			const market = event.eventMarkets[0]
			if (!market) continue
			const firstOutcome = market.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
			if (!firstOutcome) continue
			clobTokenIds.push(firstOutcome.clobTokenId)
		}
		if (clobTokenIds.length > 0) {
			// addToSubscription handles connection state - will connect if needed
			// It also merges new tokens with existing subscription and reconnects if necessary
			await polymarketWebSocketClient.addToSubscription(clobTokenIds)
		}
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingAllEvents(false)
	}
}

export async function retrieveMoreEvents(): Promise<void> {
	// Load the next page using the current offset
	// currentOffset is already set to the next page offset after previous load
	if (!eventsClass.hasMoreEvents || eventsClass.isRetrievingAllEvents) {
		return
	}
	await retrieveAllEvents(eventsClass.currentOffset)
}
