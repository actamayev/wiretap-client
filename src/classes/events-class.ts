
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
		newEvents.forEach((event): void => {
			this.addSingleEventMetadata(event.eventSlug, event)
			// Ensure timeframe is set to "1w" after adding metadata (double-check)
			this.setSelectedTimeframe(event.eventSlug, "1w")
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
		const extendedEvent: SingleEvent = {
			...event,
			eventMarkets: event.eventMarkets.map((market): SingleMarket => ({
				...market,
				firstOutcomePrice: (market.midpointPrice ?? 0),
				secondOutcomePrice: 1 - (market.midpointPrice ?? 0),
				selectedTimeframe: "1w",
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
			}))
		}
		// Make the event observable so nested arrays (like priceHistory) are tracked
		// observable() automatically makes plain objects deeply observable
		const observableEvent = observable(extendedEvent)
		this.events.set(eventSlug, observableEvent)
	})

	public isRetrievingSingleEvent = (eventSlug: EventSlug): boolean => {
		return this.retrievingSingleEvent.get(eventSlug) || false
	}

	public setSearchTerm = action((newSearchTerm: string): void => {
		this.searchTerm = newSearchTerm
	})

	public setOutcomePriceHistory = action((
		eventSlug: EventSlug,
		outcomeClobTokenId: ClobTokenId,
		interval: keyof OutcomePriceHistories,
		priceHistory: PriceHistoryEntry[]
	): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		const market = event.eventMarkets[0]
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
		outcomeClobTokenId: ClobTokenId,
		interval: keyof OutcomePriceHistories,
		isRetrieving: boolean
	): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		const market = event.eventMarkets[0]
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
		outcomeClobTokenId: ClobTokenId,
		interval: keyof OutcomePriceHistories
	): boolean => {
		const event = this.events.get(eventSlug)
		if (!event) return false
		const market = event.eventMarkets[0]
		const outcome = market.outcomes.find(
			(singleOutcome): boolean => singleOutcome.clobTokenId === outcomeClobTokenId
		)
		if (!outcome) return false
		return outcome.retrievingPriceHistories.includes(interval)
	}

	public getSelectedTimeframe = (eventSlug: EventSlug): keyof OutcomePriceHistories => {
		const event = this.events.get(eventSlug)
		if (!event) return "1w"
		const market = event.eventMarkets[0]
		if (!market) return "1w"
		return market.selectedTimeframe
	}

	public setSelectedTimeframe = action((
		eventSlug: EventSlug,
		timeframe: keyof OutcomePriceHistories
	): void => {
		const event = this.events.get(eventSlug)
		if (!event) return
		const market = event.eventMarkets[0]
		if (!market) return
		market.selectedTimeframe = timeframe
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
			const market = event.eventMarkets[0]
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
