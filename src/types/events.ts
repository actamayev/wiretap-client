declare global {
	interface ExtendedSingleEvent extends SingleEvent {
		eventMarkets: ExtendedSingleMarket[]
	}

	interface ExtendedSingleMarket extends SingleMarket {
		yesPrice: number
		noPrice: number
	}
}

export {}
