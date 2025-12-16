"use client"

import isEqual from "lodash-es/isEqual"
import isNull from "lodash-es/isNull"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import retrieveEventPriceHistory from "./retrieve-event-price-history"
import polymarketWebSocketClient from "../../classes/polymarket-websocket-client"

// eslint-disable-next-line complexity
export default async function retrieveSingleEvent(eventSlug: EventSlug): Promise<void> {
	try {
		if (
			authClass.isLoggedIn === false ||
			eventsClass.isRetrievingSingleEvent(eventSlug) === true ||
			eventsClass.events.get(eventSlug) !== undefined
		) return

		eventsClass.setIsRetrievingSingleEvent(eventSlug, true)

		const eventsResponse = await wiretapApiClient.eventsDataService.retrieveSingleEvent(eventSlug)
		if (!isEqual(eventsResponse.status, 200) || isNonSuccessResponse(eventsResponse.data)) {
			throw Error ("Unable to retrieve event")
		}

		if (isNull(eventsResponse.data.event)) {
			throw Error ("Unable to retrieve event")
		}

		eventsClass.addSingleEventMetadata(eventSlug, eventsResponse.data.event)
		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)

		// Fetch price history for each outcome (1D interval)
		await retrieveEventPriceHistory(eventSlug)

		// Add Yes outcome clob token to WebSocket subscription
		const event = eventsClass.events.get(eventSlug)
		if (!event) return
		const market = event.eventMarkets[0]
		if (!market) return
		const yesOutcome = market.outcomes.find((outcome): boolean => outcome.outcome === "Yes")
		if (!yesOutcome) return
		// addToSubscription handles connection state - will connect if needed
		await polymarketWebSocketClient.addToSubscription([yesOutcome.clobTokenId])
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)
	}
}
