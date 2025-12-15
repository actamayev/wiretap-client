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
		priceHistory: SinglePriceSnapshot[]
	}

	interface SinglePriceSnapshot {
		timestamp: Date
		price: number
	}

}

export {}
