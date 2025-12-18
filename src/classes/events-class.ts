/* eslint-disable max-depth */

import { action, makeAutoObservable, observable } from "mobx"
import { timeframeConfig } from "../utils/constants/polymarket-constants"

class EventsClass {
	public isRetrievingAllEvents = false
	public hasRetrievedAllEvents = false
	public retrievingSingleEvent: Map<EventSlug, boolean> = new Map()
	public events: Map<EventSlug, SingleEvent> = new Map()
	public searchTerm = ""
	public currentOffset = 0
	public hasMoreEvents = true // Track if there are more events to load

	constructor() {
		makeAutoObservable(this)
	}

	public setIsRetrievingAllEvents = action((newIsRetrievingAllEvents: boolean): void => {
		this.isRetrievingAllEvents = newIsRetrievingAllEvents
	})

	public setHasRetrievedAllEvents = action((newHasRetrievedAllEvents: boolean): void => {
		this.hasRetrievedAllEvents = newHasRetrievedAllEvents
	})

	public setIsRetrievingSingleEvent = action((eventSlug: EventSlug, newIsRetrievingSingleEvent: boolean): void => {
		this.retrievingSingleEvent.set(eventSlug, newIsRetrievingSingleEvent)
	})

	public setEventsMetadata = action((newEvents: SingleEventMetadata[]): void => {
		newEvents.forEach((eventMetadata): void => {
			this.addSingleEventMetadata(eventMetadata.eventSlug, eventMetadata)
			// Ensure timeframe is set to "1w" at event level after adding metadata
			const event = this.events.get(eventMetadata.eventSlug)
			if (event) {
				this.setSelectedTimeframe(eventMetadata.eventSlug, "1w")
			}
		})
		// If we got fewer events than expected (less than 20), we've reached the end
		this.hasMoreEvents = newEvents.length >= 20
		this.setHasRetrievedAllEvents(true)
		this.setIsRetrievingAllEvents(false)
	})

	public setCurrentOffset = action((offset: number): void => {
		this.currentOffset = offset
	})

	public incrementOffset = action((): void => {
		this.currentOffset += 20
	})

	public resetPagination = action((): void => {
		this.currentOffset = 0
		this.hasMoreEvents = true
		this.hasRetrievedAllEvents = false
	})

	public addSingleEventMetadata = action((eventSlug: EventSlug, event: SingleEventMetadata): void => {
		// Sort markets by midpoint price in descending order (highest price first)
		const sortedMarkets = [...event.eventMarkets].sort((a, b): number => {
			const priceA = a.midpointPrice ?? 0
			const priceB = b.midpointPrice ?? 0
			return priceB - priceA
		})

		const extendedEvent: SingleEvent = {
			...event,
			eventMarkets: sortedMarkets.map((market): SingleMarket => ({
				...market,
				firstOutcomePrice: (market.midpointPrice ?? 0),
				secondOutcomePrice: 1 - (market.midpointPrice ?? 0),
				outcomes: market.outcomes.map((outcome): SingleOutcome => ({
					...outcome,
					priceHistory: {
						"1h": [],
						"1d": [],
						"1w": [],
						"1m": [],
						max: []
					},
					retrievingPriceHistories: []
				}))
			})),
			// Default to the first market (highest midpoint price after sorting)
			selectedMarketId: sortedMarkets[0]?.marketId ?? (0 as MarketId),
			// Default timeframe for the event
			selectedTimeframe: "1w"
		}
		// Make the event observable so nested arrays (like priceHistory) are tracked
		// observable() automatically makes plain objects deeply observable
		const observableEvent = observable(extendedEvent)
		this.events.set(eventSlug, observableEvent)
	})

	/**
	 * Get the selected market for an event
	 */
	public getSelectedMarket = (eventSlug: EventSlug): SingleMarket | undefined => {
		const event = this.events.get(eventSlug)
		if (!event) return undefined
		return event.eventMarkets.find(
			(market): boolean => market.marketId === event.selectedMarketId
		)
	}

	/**
	 * Get the selected market ID for an event
	 */
	public getSelectedMarketId = (eventSlug: EventSlug): MarketId | undefined => {
		const event = this.events.get(eventSlug)
		if (!event) return undefined
		return event.selectedMarketId
	}

	/**
	 * Set the selected market for an event
	 */
	public setSelectedMarketId = action((eventSlug: EventSlug, marketId: MarketId): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		// Verify the market exists in this event
		const marketExists = event.eventMarkets.some(
			(market): boolean => market.marketId === marketId
		)
		if (!marketExists) return
		event.selectedMarketId = marketId
	})

	/**
	 * Find a market by ID within an event
	 */
	public getMarketById = (eventSlug: EventSlug, marketId: MarketId): SingleMarket | undefined => {
		const event = this.events.get(eventSlug)
		if (!event) return undefined
		return event.eventMarkets.find(
			(market): boolean => market.marketId === marketId
		)
	}

	public isRetrievingSingleEvent = (eventSlug: EventSlug): boolean => {
		return this.retrievingSingleEvent.get(eventSlug) || false
	}

	public setSearchTerm = action((newSearchTerm: string): void => {
		this.searchTerm = newSearchTerm
	})

	public setOutcomePriceHistory = action((
		eventSlug: EventSlug,
		marketId: MarketId,
		outcomeClobTokenId: ClobTokenId,
		interval: keyof OutcomePriceHistories,
		priceHistory: PriceHistoryEntry[]
	// eslint-disable-next-line max-params
	): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		const market = event.eventMarkets.find(
			(m): boolean => m.marketId === marketId
		)
		if (!market) return
		const outcome = market.outcomes.find(
			(singleOutcome): boolean => singleOutcome.clobTokenId === outcomeClobTokenId
		)
		if (!outcome) return
		outcome.priceHistory[interval] = priceHistory
		// Remove from retrieving array when data is set
		outcome.retrievingPriceHistories = outcome.retrievingPriceHistories.filter(
			(timeframe): boolean => timeframe !== interval
		)
	})

	public setIsRetrievingPriceHistory = action((
		eventSlug: EventSlug,
		marketId: MarketId,
		outcomeClobTokenId: ClobTokenId,
		interval: keyof OutcomePriceHistories,
		isRetrieving: boolean
	// eslint-disable-next-line max-params
	): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		const market = event.eventMarkets.find(
			(m): boolean => m.marketId === marketId
		)
		if (!market) return
		const outcome = market.outcomes.find(
			(singleOutcome): boolean => singleOutcome.clobTokenId === outcomeClobTokenId
		)
		if (!outcome) return

		if (isRetrieving) {
			// Add to retrieving array if not already present
			if (!outcome.retrievingPriceHistories.includes(interval)) {
				outcome.retrievingPriceHistories.push(interval)
			}
		} else {
			// Remove from retrieving array
			outcome.retrievingPriceHistories = outcome.retrievingPriceHistories.filter(
				(timeframe): boolean => timeframe !== interval
			)
		}
	})

	public isRetrievingPriceHistory = (
		eventSlug: EventSlug,
		marketId: MarketId,
		outcomeClobTokenId: ClobTokenId,
		interval: keyof OutcomePriceHistories
	): boolean => {
		const event = this.events.get(eventSlug)
		if (!event) return false
		const market = event.eventMarkets.find(
			(m): boolean => m.marketId === marketId
		)
		if (!market) return false
		const outcome = market.outcomes.find(
			(singleOutcome): boolean => singleOutcome.clobTokenId === outcomeClobTokenId
		)
		if (!outcome) return false
		return outcome.retrievingPriceHistories.includes(interval)
	}

	public getSelectedTimeframe = (eventSlug: EventSlug): keyof OutcomePriceHistories => {
		const event = this.events.get(eventSlug)
		if (!event) return "1w"
		return event.selectedTimeframe ?? "1w"
	}

	public setSelectedTimeframe = action((
		eventSlug: EventSlug,
		timeframe: keyof OutcomePriceHistories
	): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		event.selectedTimeframe = timeframe
	})

	/**
	 * Round timestamp to the nearest fidelity interval for a given timeframe
	 */
	private roundTimestampToFidelity(
		timestampSeconds: number,
		timeframe: keyof OutcomePriceHistories
	): number {
		const fidelity = timeframeConfig[timeframe].fidelity
		// Fidelity is in minutes, convert to seconds
		const fidelitySeconds = fidelity * 60
		// Round down to the nearest fidelity interval
		return Math.floor(timestampSeconds / fidelitySeconds) * fidelitySeconds
	}

	/**
	 * Get the window size (number of points) for a given timeframe
	 */
	private getWindowSize(timeframe: keyof OutcomePriceHistories): number {
		switch (timeframe) {
			case "1h":
				// 60 minutes / 1 minute = 60 points
				return 60
			case "1d":
				// 24 hours * 60 minutes / 5 minutes = 288 points
				return 288
			case "1w":
				// 7 days * 24 hours * 60 minutes / 30 minutes = 336 points
				return 336
			case "1m":
				// 30 days * 24 hours * 60 minutes / 180 minutes = 240 points
				return 240
			case "max":
				// MAX doesn't have a fixed window size - scale never compresses
				return Infinity
			default:
				return 60
		}
	}

	/**
	 * Apply sliding window logic to price history for a given timeframe
	 */
	private applySlidingWindow(
		history: PriceHistoryEntry[],
		timeframe: keyof OutcomePriceHistories,
		newEntry: PriceHistoryEntry
	): PriceHistoryEntry[] {
		const windowSize = this.getWindowSize(timeframe)
		const roundedTimestamp = this.roundTimestampToFidelity(newEntry.t, timeframe)

		// Sort history by timestamp (oldest first)
		const sortedHistory = [...history].sort((a, b): number => a.t - b.t)

		// Check if we have a "hot point" (latest point) in the same time bucket
		if (sortedHistory.length > 0) {
			const latestEntry = sortedHistory[sortedHistory.length - 1]
			const latestRoundedTimestamp = this.roundTimestampToFidelity(latestEntry.t, timeframe)

			// If the latest point is in the same time bucket, update it (hot point)
			if (latestRoundedTimestamp === roundedTimestamp) {
				// Update the hot point with new price and timestamp
				sortedHistory[sortedHistory.length - 1] = {
					...newEntry,
					t: roundedTimestamp
				}
				return sortedHistory
			}
		}

		// New time bucket - add new entry
		const newEntryWithRoundedTimestamp: PriceHistoryEntry = {
			...newEntry,
			t: roundedTimestamp
		}

		// For MAX timeframe, don't remove old points (scale never compresses)
		if (timeframe === "max") {
			return [...sortedHistory, newEntryWithRoundedTimestamp]
		}

		// For other timeframes, apply sliding window
		const updatedHistory = [...sortedHistory, newEntryWithRoundedTimestamp]

		// If we exceed the window size, remove the oldest point(s)
		if (updatedHistory.length > windowSize) {
			// Remove oldest points until we're at window size
			return updatedHistory.slice(updatedHistory.length - windowSize)
		}

		return updatedHistory
	}

	// eslint-disable-next-line complexity
	public updateOutcomePrice = action((priceUpdate: PriceUpdate): void => {
		// Find the event and market that contains an outcome with the matching clobTokenId
		for (const event of this.events.values()) {
			// Search across all markets in the event
			for (const market of event.eventMarkets) {
				const outcome = market.outcomes.find(
					(singleOutcome): boolean => singleOutcome.clobTokenId === priceUpdate.clobTokenId
				)

				if (!outcome) continue
				// Find the First outcome for this market
				const firstOutcome = market.outcomes.find(
					(singleOutcome): boolean => singleOutcome.outcomeIndex === 0
				)

				// Only update market-level pricing if this price update is for the First outcome
				if (firstOutcome && outcome.clobTokenId === firstOutcome.clobTokenId) {
					// Update market-level pricing from First outcome's best bid
					market.midpointPrice = priceUpdate.midpointPrice
					market.firstOutcomePrice = (priceUpdate.midpointPrice ?? 0)
					market.secondOutcomePrice = 1 - (priceUpdate.midpointPrice ?? 0)
				}

				// Add price snapshot to outcome's price history if bestAsk is available
				// (This happens for both First and Second outcomes)
				// Apply sliding window logic to all intervals for real-time updates
				if (priceUpdate.midpointPrice !== null) {
					// Use timestamp from WebSocket message if available, otherwise use current time
					// WebSocket timestamp is in milliseconds, but PriceHistoryEntry.t expects seconds (Unix timestamp)
					const timestampMs = priceUpdate.timestamp ?? new Date().getTime()
					const timestampSeconds = Math.floor(timestampMs / 1000)
					const priceEntry: PriceHistoryEntry = {
						t: timestampSeconds,
						p: priceUpdate.midpointPrice ?? 0,
						isWebSocket: true // Mark as WebSocket data
					}

					// Apply sliding window logic to each timeframe
					const timeframes: Array<keyof OutcomePriceHistories> = ["1h", "1d", "1w", "1m", "max"]
					for (const timeframe of timeframes) {
						outcome.priceHistory[timeframe] = this.applySlidingWindow(
							outcome.priceHistory[timeframe],
							timeframe,
							priceEntry
						)
					}
				}

				return // Found and updated, exit early
			}
		}
	})

	logout(): void {
		this.isRetrievingAllEvents = false
		this.hasRetrievedAllEvents = false
		this.retrievingSingleEvent = new Map()
		this.searchTerm = ""
	}
}

const eventsClass = new EventsClass()

export default eventsClass
