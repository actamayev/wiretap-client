//eslint-disable-file max-depth
"use client"

import isEqual from "lodash-es/isEqual"
import { isErrorResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import eventsClass from "../../classes/events-class"
import retrieveEventPriceHistory from "./retrieve-event-price-history"
import polymarketWebSocketClient from "../../classes/polymarket-websocket-client"

//eslint-disable-next-line complexity
export default async function retrieveAllEvents(): Promise<void> {
	try {
		if (
			eventsClass.isRetrievingAllEvents === true ||
			eventsClass.hasRetrievedAllEvents === true
		) return

		eventsClass.setIsRetrievingAllEvents(true)

		const eventsResponse = await wiretapApiClient.eventsDataService.retrieveAllEvents()
		if (!isEqual(eventsResponse.status, 200) || isErrorResponse(eventsResponse.data)) {
			throw Error ("Unable to retrieve events")
		}

		eventsClass.setEventsMetadata(eventsResponse.data.events)

		// Fetch price history for each event (1D interval)
		const priceHistoryPromises = eventsResponse.data.events.map(
			(event): Promise<void> => retrieveEventPriceHistory(event.eventSlug)
		)
		await Promise.allSettled(priceHistoryPromises)

		// Add all First outcome clob tokens to WebSocket subscription
		const clobTokenIds: ClobTokenId[] = []
		for (const eventMetadata of eventsResponse.data.events) {
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
			await polymarketWebSocketClient.addToSubscription(clobTokenIds)
		}
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingAllEvents(false)
	}
}
