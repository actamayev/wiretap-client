"use client"

import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../polymarket/retrieve-outcome-price-history"

export default async function retrieveEventPriceHistory(eventSlug: EventSlug): Promise<void> {
	const event = eventsClass.events.get(eventSlug)
	if (!event) return

	const market = event.eventMarkets[0]
	if (!market) return

	// Only retrieve price history for the First outcome
	const firstOutcome = market.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
	if (!firstOutcome) return

	// Check if already retrieving or if data exists
	if (eventsClass.isRetrievingPriceHistory(eventSlug, firstOutcome.clobTokenId, "1d")) {
		return
	}

	const existingData = firstOutcome.priceHistory["1d"]
	if (existingData && existingData.length > 0) {
		return
	}

	eventsClass.setIsRetrievingPriceHistory(eventSlug, firstOutcome.clobTokenId, "1d", true)
	try {
		const priceHistoryResponse = await retrieveOutcomePriceHistory({
			market: firstOutcome.clobTokenId as string,
			interval: "1d",
			fidelity: 5
		})
		eventsClass.setOutcomePriceHistory(
			eventSlug,
			firstOutcome.clobTokenId,
			"1d",
			priceHistoryResponse.history
		)
	} catch (error) {
		console.error(`Error retrieving price history for outcome ${firstOutcome.clobTokenId}:`, error)
		eventsClass.setIsRetrievingPriceHistory(eventSlug, firstOutcome.clobTokenId, "1d", false)
	}
}

