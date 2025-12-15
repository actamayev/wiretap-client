
import { action, makeAutoObservable, observable } from "mobx"

class EventsClass {
	public isRetrievingAllEvents = false
	public hasRetrievedAllEvents = false
	public retrievingSingleEvent: Map<EventSlug, boolean> = new Map()
	public events: Map<EventSlug, SingleEvent> = new Map()
	public searchTerm = ""

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
		newEvents.forEach((event): void => this.addSingleEventMetadata(event.eventSlug, event))
		this.setHasRetrievedAllEvents(true)
		this.setIsRetrievingAllEvents(false)
	})

	public addSingleEventMetadata = action((eventSlug: EventSlug, event: SingleEventMetadata): void => {
		const extendedEvent: SingleEvent = {
			...event,
			eventMarkets: event.eventMarkets.map((market): SingleMarket => ({
				...market,
				yesPrice: ((market.midpointPrice ?? 0) + (market.midpointPrice ?? 0)) / 2,
				noPrice: 1 - (((market.midpointPrice ?? 0) + (market.midpointPrice ?? 0)) / 2),
				selectedTimeframe: "1d",
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
		if (!event) return "1d"
		const market = event.eventMarkets[0]
		if (!market) return "1d"
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

	// eslint-disable-next-line complexity
	public updateOutcomePrice = action((priceUpdate: PriceUpdate): void => {
		// Find the event and market that contains an outcome with the matching clobTokenId
		for (const event of this.events.values()) {
			const market = event.eventMarkets[0]
			const outcome = market.outcomes.find(
				(singleOutcome): boolean => singleOutcome.clobTokenId === priceUpdate.clobTokenId
			)

			if (outcome) {
				// Find the "Yes" outcome for this market
				const yesOutcome = market.outcomes.find(
					(singleOutcome): boolean => singleOutcome.outcome === "Yes"
				)

				// Only update market-level pricing if this price update is for the "Yes" outcome
				if (yesOutcome && outcome.clobTokenId === yesOutcome.clobTokenId) {
					// Update market-level pricing from Yes outcome's best bid
					market.midpointPrice = priceUpdate.midpointPrice
					market.yesPrice = ((priceUpdate.midpointPrice ?? 0) + (priceUpdate.midpointPrice ?? 0)) / 2
					market.noPrice = 1 - (((priceUpdate.midpointPrice ?? 0) + (priceUpdate.midpointPrice ?? 0)) / 2)
				}

				// Add price snapshot to outcome's price history if bestAsk is available
				// (This happens for both Yes and No outcomes)
				// Add to all intervals for real-time updates
				if (priceUpdate.midpointPrice !== null) {
					// Use timestamp from WebSocket message if available, otherwise use current time
					// WebSocket timestamp is in milliseconds, but PriceHistoryEntry.t expects seconds (Unix timestamp)
					const timestampMs = priceUpdate.timestamp ?? new Date().getTime()
					const timestampSeconds = Math.floor(timestampMs / 1000)
					const priceEntry: PriceHistoryEntry = {
						t: timestampSeconds,
						p: priceUpdate.midpointPrice ?? 0
					}
					outcome.priceHistory["1h"].push(priceEntry)
					outcome.priceHistory["1d"].push(priceEntry)
					outcome.priceHistory["1w"].push(priceEntry)
					outcome.priceHistory["1m"].push(priceEntry)
					outcome.priceHistory.max.push(priceEntry)
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
