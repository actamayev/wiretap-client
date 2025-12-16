declare global {
	interface PriceUpdate {
		clobTokenId: ClobTokenId
		midpointPrice: number | null
		timestamp?: number // Unix timestamp in milliseconds (from WebSocket message)
	}
}

export {}
