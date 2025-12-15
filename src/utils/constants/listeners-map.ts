"use client"

import eventsClass from "../../classes/events-class"
import fundsClass from "../../classes/funds-class"

type ListenerHandler<E> = (payload: E) => void

// Note: Class methods are wrapped in arrow functions to preserve 'this' context when called as callbacks
export const listenersMap: {
	[K in ServerSocketEvents]: ListenerHandler<ServerSocketEventPayloadMap[K]>
} = {
	"market:prices": (payload: MarketPricesUpdate): void => {
		console.log("market:prices", payload)
		// Update each outcome price in the events class and positions in funds class
		payload.prices.forEach((priceUpdate: PriceUpdate): void => {
			eventsClass.updateOutcomePrice(priceUpdate)
			fundsClass.updatePositionPrice(priceUpdate)
		})
	}
} as const
