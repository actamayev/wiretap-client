/* eslint-disable max-depth */
import { action, makeAutoObservable, observable } from "mobx"

class EventsClass {
	public isRetrievingAllEvents = false
	public hasRetrievedAllEvents = false
	public retrievingSingleEvent: Map<EventSlug, boolean> = new Map()
	public events: Map<EventSlug, ExtendedSingleEvent> = new Map()
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

	public setEvents = action((newEvents: SingleEvent[]): void => {
		newEvents.forEach((event): void => this.addEvent(event.eventSlug, event))
		this.setHasRetrievedAllEvents(true)
		this.setIsRetrievingAllEvents(false)
	})

	public addEvent = action((eventSlug: EventSlug, event: SingleEvent): void => {
		const extendedEvent: ExtendedSingleEvent = {
			...event,
			eventMarkets: event.eventMarkets.map((market): ExtendedSingleMarket => ({
				...market,
				buyYesPrice: market.bestAsk ?? 0,
				buyNoPrice: 1 - (market.bestBid ?? 0),
				sellYesPrice: market.bestBid ?? 0,
				sellNoPrice: 1 - (market.bestAsk ?? 0)
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
					market.bestBid = priceUpdate.bestBid
					market.bestAsk = priceUpdate.bestAsk
					market.lastTradePrice = priceUpdate.lastTradePrice
					market.buyYesPrice = priceUpdate.bestAsk ?? 0
					market.buyNoPrice = 1 - (priceUpdate.bestBid ?? 0)
					market.sellYesPrice = priceUpdate.bestBid ?? 0
					market.sellNoPrice = 1 - (priceUpdate.bestAsk ?? 0)

					// Update spread if both bid and ask are available
					if (priceUpdate.bestBid !== null && priceUpdate.bestAsk !== null) {
						market.spread = priceUpdate.bestAsk - priceUpdate.bestBid
					} else {
						market.spread = null
					}
				}

				const midpointPrice = ((priceUpdate.bestAsk ?? 0) + (priceUpdate.bestBid ?? 0)) / 2

				// Add price snapshot to outcome's price history if bestAsk is available
				// (This happens for both Yes and No outcomes)
				if (priceUpdate.bestAsk !== null) {
					outcome.priceHistory.push({
						timestamp: new Date(),
						price: midpointPrice
					})
				}

				return // Found and updated, exit early
			}
		}
	})

	logout(): void {
		this.isRetrievingAllEvents = false
		this.hasRetrievedAllEvents = false
		this.retrievingSingleEvent = new Map()
		this.events = new Map()
		this.searchTerm = ""
	}
}

const eventsClass = new EventsClass()

export default eventsClass
