"use client"

import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../polymarket/retrieve-outcome-price-history"

export default async function retrieveEventPriceHistory(eventSlug: EventSlug): Promise<void> {
	const event = eventsClass.events.get(eventSlug)
	if (!event) return

	const market = event.eventMarkets[0]
	if (!market) return

	// Only retrieve price history for the "Yes" outcome
	const yesOutcome = market.outcomes.find((outcome): boolean => outcome.outcome === "Yes")
	if (!yesOutcome) return

	try {
		const priceHistoryResponse = await retrieveOutcomePriceHistory({
			market: yesOutcome.clobTokenId as string,
			interval: "1d",
			fidelity: 5
		})
		eventsClass.setOutcomePriceHistory(
			eventSlug,
			yesOutcome.clobTokenId,
			"1d",
			priceHistoryResponse.history
		)
	} catch (error) {
		console.error(`Error retrieving price history for outcome ${yesOutcome.clobTokenId}:`, error)
	}
}

