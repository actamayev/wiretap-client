"use client"

import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../polymarket/retrieve-outcome-price-history"
import { timeframeConfig } from "../constants/polymarket-constants"

export default async function retrieveEventPriceHistory(eventSlug: EventSlug): Promise<void> {
	const event = eventsClass.events.get(eventSlug)
	if (!event) return

	const market = event.eventMarkets[0]
	if (!market) return

	// Only retrieve price history for the First outcome
	const firstOutcome = market.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
	if (!firstOutcome) return

	const timeFrame = "1w"
	const config = timeframeConfig[timeFrame]

	// Ensure selected timeframe is set to "1w" immediately (before fetching)
	// This ensures the chart displays the correct timeframe even if data hasn't loaded yet
	eventsClass.setSelectedTimeframe(eventSlug, timeFrame)

	// Check if already retrieving or if data exists
	if (eventsClass.isRetrievingPriceHistory(eventSlug, firstOutcome.clobTokenId, timeFrame)) {
		return
	}

	const existingData = firstOutcome.priceHistory[timeFrame]
	if (existingData && existingData.length > 0) {
		return
	}

	eventsClass.setIsRetrievingPriceHistory(eventSlug, firstOutcome.clobTokenId, timeFrame, true)
	try {
		const priceHistoryResponse = await retrieveOutcomePriceHistory({
			market: firstOutcome.clobTokenId as string,
			interval: config.interval,
			fidelity: config.fidelity
		})
		eventsClass.setOutcomePriceHistory(
			eventSlug,
			firstOutcome.clobTokenId,
			timeFrame,
			priceHistoryResponse.history
		)
		// Ensure the selected timeframe is set to match what we just fetched
		eventsClass.setSelectedTimeframe(eventSlug, timeFrame)
	} catch (error) {
		console.error(`Error retrieving price history for outcome ${firstOutcome.clobTokenId}:`, error)
		eventsClass.setIsRetrievingPriceHistory(eventSlug, firstOutcome.clobTokenId, timeFrame, false)
	}
}

