declare global {
	interface ExtendedSingleEvent extends SingleEvent {
		eventMarkets: ExtendedSingleMarket[]
	}

	interface ExtendedSingleMarket extends SingleMarket {
		buyYesPrice: number
		buyNoPrice: number
		sellYesPrice: number
		sellNoPrice: number
	}
}

export {}
