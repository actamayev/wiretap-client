"use client"

import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../polymarket/retrieve-outcome-price-history"
import { timeframeConfig } from "../constants/polymarket-constants"

export default async function retrieveEventPriceHistory(
	eventSlug: EventSlug,
	marketId?: MarketId
): Promise<void> {
	const event = eventsClass.events.get(eventSlug)
	if (!event) return

	// Use provided marketId or fall back to selected market
	const targetMarketId = marketId ?? event.selectedMarketId
	const market = event.eventMarkets.find(
		(m): boolean => m.marketId === targetMarketId
	)
	if (!market) return

	// Only retrieve price history for the First outcome
	const firstOutcome = market.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
	if (!firstOutcome) return

	// Use the event's selected timeframe, or default to "1w" if not set
	const timeFrame = event.selectedTimeframe ?? "1w"
	const config = timeframeConfig[timeFrame]

	// Ensure selected timeframe is set (in case it wasn't set before)
	// This ensures the chart displays the correct timeframe even if data hasn't loaded yet
	eventsClass.setSelectedTimeframe(eventSlug, timeFrame)

	// Check if already retrieving or if data exists
	if (eventsClass.isRetrievingPriceHistory(eventSlug, market.marketId, firstOutcome.clobTokenId, timeFrame)) {
		return
	}

	const existingData = firstOutcome.priceHistory[timeFrame]
	if (existingData && existingData.length > 0) {
		return
	}

	eventsClass.setIsRetrievingPriceHistory(eventSlug, market.marketId, firstOutcome.clobTokenId, timeFrame, true)
	try {
		const priceHistoryResponse = await retrieveOutcomePriceHistory({
			market: firstOutcome.clobTokenId as string,
			interval: config.interval,
			fidelity: config.fidelity
		})
		eventsClass.setOutcomePriceHistory(
			eventSlug,
			market.marketId,
			firstOutcome.clobTokenId,
			timeFrame,
			priceHistoryResponse.history
		)
		// Ensure the selected timeframe is set to match what we just fetched
		eventsClass.setSelectedTimeframe(eventSlug, timeFrame)
	} catch (error) {
		console.error(`Error retrieving price history for outcome ${firstOutcome.clobTokenId}:`, error)
		eventsClass.setIsRetrievingPriceHistory(eventSlug, market.marketId, firstOutcome.clobTokenId, timeFrame, false)
	}
}

