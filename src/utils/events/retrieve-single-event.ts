"use client"

import isEqual from "lodash-es/isEqual"
import isNull from "lodash-es/isNull"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import retrieveEventPriceHistory from "./retrieve-event-price-history"
import polymarketWebSocketClient from "../../classes/polymarket-websocket-client"

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

		// Fetch price history for each outcome (1D interval)
		await retrieveEventPriceHistory(eventSlug)

		// Add Yes outcome clob token to WebSocket subscription
		const event = eventsClass.events.get(eventSlug)
		if (event) {
			const market = event.eventMarkets[0]
			if (market) {
				const yesOutcome = market.outcomes.find((outcome): boolean => outcome.outcome === "Yes")
				if (yesOutcome && polymarketWebSocketClient.isWebSocketConnected()) {
					polymarketWebSocketClient.addToSubscription([yesOutcome.clobTokenId])
				}
			}
		}

		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)
	}
}
