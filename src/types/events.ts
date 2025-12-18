declare global {
	interface SingleEvent extends SingleEventMetadata {
		eventMarkets: SingleMarket[]
		selectedMarketId: MarketId
	}

	interface SingleMarket extends SingleMarketMetadata {
		outcomes: SingleOutcome[]
		firstOutcomePrice: number
		secondOutcomePrice: number
		selectedTimeframe: keyof OutcomePriceHistories
	}

	interface SingleOutcome extends SingleOutcomeMetadata {
		priceHistory: OutcomePriceHistories
		retrievingPriceHistories: Array<keyof OutcomePriceHistories>
	}

	interface OutcomePriceHistories {
		"1h": PriceHistoryEntry[]
		"1d": PriceHistoryEntry[]
		"1w": PriceHistoryEntry[]
		"1m": PriceHistoryEntry[]
		max: PriceHistoryEntry[]
	}

	interface PriceHistoryEntry {
		t: number
		p: number
		isWebSocket?: boolean // True if this data point came from WebSocket, false/undefined if from API
	}

	interface SinglePriceSnapshot {
		timestamp: Date
		price: number
	}

}

export {}
