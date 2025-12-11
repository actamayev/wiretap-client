"use client"

import eventsClass from "../../classes/events-class"

type ListenerHandler<E> = (payload: E) => void

// Note: Class methods are wrapped in arrow functions to preserve 'this' context when called as callbacks
export const listenersMap: {
	[K in ServerSocketEvents]: ListenerHandler<ServerSocketEventPayloadMap[K]>
} = {
	"market:prices": (payload: MarketPricesUpdate): void => {
		// Update each outcome price in the events class
		payload.prices.forEach((priceUpdate: PriceUpdate): void => {
			eventsClass.updateOutcomePrice(priceUpdate)
		})
	}
} as const
