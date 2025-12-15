declare global {
	interface SingleEvent extends SingleEventMetadata {
		eventMarkets: SingleMarket[]
	}

	interface SingleMarket extends SingleMarketMetadata {
		outcomes: SingleOutcome[]
		yesPrice: number
		noPrice: number
	}

	interface SingleOutcome extends SingleOutcomeMetadata {
		priceHistory: OutcomePriceHistories
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
	}

	interface SinglePriceSnapshot {
		timestamp: Date
		price: number
	}

}

export {}
