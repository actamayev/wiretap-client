"use client"

// Import your classes here when you create them
// import marketPricesClass from "../../classes/market-prices-class"

type ListenerHandler<E> = (payload: E) => void

// Note: Class methods are wrapped in arrow functions to preserve 'this' context when called as callbacks
export const listenersMap: {
	[K in ServerSocketEvents]: ListenerHandler<ServerSocketEventPayloadMap[K]>
} = {
	"market:prices": (payload): void => {
		// TODO: Replace with actual handler
		console.log("📊 Received market prices:", payload.prices.length, "updates at", new Date(payload.timestamp))

		// Example of what you might do:
		// marketPricesClass.updatePrices(payload.prices)
		// or store in MobX store, update UI, etc.
	}
} as const
