"use client"

import isEqual from "lodash-es/isEqual"
import isNull from "lodash-es/isNull"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import retrieveOutcomePriceHistory from "../polymarket/retrieve-outcome-price-history"

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
		const event = eventsClass.events.get(eventSlug)
		if (event) {
			const priceHistoryPromises = event.eventMarkets.flatMap((market): Promise<void>[] =>
				market.outcomes.map(async (outcome): Promise<void> => {
					try {
						const priceHistoryResponse = await retrieveOutcomePriceHistory({
							market: outcome.clobTokenId as string,
							interval: "1d",
							fidelity: 5
						})
						eventsClass.setOutcomePriceHistory(
							eventSlug,
							outcome.clobTokenId,
							"1d",
							priceHistoryResponse.history
						)
					} catch (error) {
						console.error(`Error retrieving price history for outcome ${outcome.clobTokenId}:`, error)
					}
				})
			)

			await Promise.allSettled(priceHistoryPromises)
		}

		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)
	}
}
